/* shared.js — inject navbar and footer into every page */

const currentPage = location.pathname.split('/').pop() || 'index.html';

function isActive(href) {
  return currentPage === href ? 'active' : '';
}

document.getElementById('navbar-placeholder').innerHTML = `
  <nav class="navbar">
    <a href="index.html" class="logo">
      <img src="logo.png" alt="Miti Mayetri" style="height:60px; width:auto;">
    </a>
    <ul class="nav-links">
      <li><a href="index.html"        class="${isActive('index.html')}">Home</a></li>
      <li><a href="about.html"        class="${isActive('about.html')}">About</a></li>
      <li><a href="success-stories.html" class="${isActive('success-stories.html')}">Success Stories</a></li>
      <li><a href="index.html#membership">Membership</a></li>
      <li><a href="contact.html"      class="${isActive('contact.html')}">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <a href="https://forms.gle/jrAWi5nGFJL1nZMP6" class="btn-primary">Register Now ♥</a>
    </div>
  </nav>
`;

document.getElementById('footer-placeholder').innerHTML = `
  <footer>
    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-logo">
          <img src="logo.png" alt="Miti Mayetri" style="height:70px; width:auto;">
        </div>
        <p class="footer-tagline">Bringing Sindhi Souls Together</p>
        <p>The most trusted matchmaking service dedicated to the Sindhi community worldwide.</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="success-stories.html">Success Stories</a></li>
          <li><a href="index.html#membership">Membership Plans</a></li>
          <li><a href="refund-policy.html">Refund Policy</a></li>
          <li><a href="contact.html">Contact Info</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact Us</h4>
        <ul>
          <li><a href="#">📍 Jabalpur, MP</a></li>
          <li><a href="mailto:info@mitimayetri.com">✉ info@mitimayetri.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026, Miti Mayetri. All rights reserved.</span>
      <span>Made with ♥ for the Community</span>
    </div>
  </footer>
`;
