// Load Memberstack 2.0 library
(function() {
  const script = document.createElement('script');
  script.src = 'https://static.memberstack.com/scripts/v2/memberstack.js';
  script.setAttribute('data-memberstack-app', 'app_cmiqs1b7y008x0tq4e19d6vn8');
  script.type = 'text/javascript';
  document.head.appendChild(script);
})();

// Header component
const headerHTML = `
<header class="header">
  <div class="header-container">
    <div class="header-left">
      <a href="/">
        <img src="https://storage.googleapis.com/studio-design-asset-files/projects/BmqMD8eYOX/s-150x150_686290b7-1837-4dfb-b2f2-aa0d7b1af84d.svg" alt="JICSS" class="logo">
      </a>
      <a href="https://jicss.org/" class="header-title">Japan Institute for CyberSpace Studies</a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="nav" id="nav">
      <a data-ms-content="members" href="/whitepapers/">WHITE PAPERS</a>
      <a href="/about">MISSION</a>
      <a href="/team">TEAM</a>
      <a href="/news">NEWS</a>
      <a href="/contact">CONTACT</a>
      <a data-ms-content="!members" data-ms-modal="login" href="#">Login</a>
      <a data-ms-content="members" data-ms-action="logout" href="#">Logout</a>
    </nav>
  </div>
</header>
`;


// Footer component with dynamic year
const footerHTML = `
<footer class="footer">
  <div class="footer-container">
    <p>&copy; <span id="copyright-year"></span> Japan Institute for Cyberspace Studies. All rights reserved.</p>
    <div class="footer-links">
      <a href="https://jicss.org/privacypolicy">Privacy Policy</a>
      <a href="https://jicss.org/contact">Contact</a>
    </div>
  </div>
</footer>
`;

// Insert on page load
document.addEventListener('DOMContentLoaded', function() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');
  
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = headerHTML;
    
    // Setup hamburger menu
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    if (hamburger && nav) {
      hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
      
      // Close menu when clicking nav links
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });
    }
  }
  
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
    // Set dynamic copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
  }
});
