// netlify/functions/verify-payment.js
//
// Called by the /profiles page right after Razorpay's checkout
// popup reports success. Re-checks the payment signature on the
// server (never trust the browser) and only THEN writes a "paid"
// row into the unlocks table, using the Supabase service role key
// which is allowed to bypass Row Level Security.

const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const {
      profileId,
      amountPaise,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      buyerName,
      buyerPhone,
      buyerEmail,
    } = JSON.parse(event.body || "{}");

    if (!profileId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    // 1. Verify the signature Razorpay sent matches one we can
    //    only produce with our secret key. This is what proves
    //    the payment is real and wasn't faked from the browser.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    // 2. Record the attempt either way, so nothing silently vanishes.
    const { error } = await supabase.from("unlocks").insert({
      profile_id: profileId,
      buyer_name: buyerName || null,
      buyer_phone: buyerPhone || null,
      buyer_email: buyerEmail || null,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount_paise: amountPaise || null,
      status: isValid ? "paid" : "failed",
    });

    if (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ error: "Could not save unlock record" }) };
    }

    if (!isValid) {
      return { statusCode: 400, body: JSON.stringify({ verified: false }) };
    }

    return { statusCode: 200, body: JSON.stringify({ verified: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Verification failed" }) };
  }
};
