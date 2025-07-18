<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-column">
        <div class="logo-section">
          <img
            src="@/assets/logo2.png"
            alt="Carevio Logo"
            class="footer-logo"
          />
          <h2 class="footer-title">Carevio</h2>
        </div>
        <p class="footer-description">
          A digital platform that connects families in need of home nursing
          services with certified and trusted nurses.
        </p>
      </div>

      <div class="footer-column">
        <h3 class="footer-heading">Pages</h3>
        <ul class="footer-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/browse">Browse Our Nurses</router-link></li>
          <li><router-link to="/services">Services</router-link></li>
          <li><router-link to="/contact">Contact Us</router-link></li>
        </ul>
      </div>

      <div class="footer-column contact-column">
        <h3 class="footer-heading">Contact Info</h3>
        <ul class="contact-info">
          <li>
            <span class="contact-icon">📞</span>
            <span>+1 (555) 123-4567</span>
          </li>
          <li>
            <span class="contact-icon">✉️</span>
            <span>contact@Carevio.com</span>
          </li>
          <li>
            <span class="contact-icon">📍</span>
            <span>123 Healthcare Ave, Medical City, MC 12345</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="copyright">&copy; 2025 Carevio. All rights reserved.</div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer {
  background-color: #19599a;
  color: white;
  padding: 2rem 1rem 1rem;
  font-family: "Cairo", sans-serif;
  margin-top: 20px;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.footer-column {
  flex: 1;
  min-width: 250px;
  margin-bottom: 1.5rem;
}

.contact-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.footer-logo {
  width: 50px;
  height: 50px;
}

.footer-title {
  font-size: 1.8rem;
  margin: 0;
}

.footer-description {
  line-height: 1.6;
  opacity: 0.9;
}

.footer-heading {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #00c6ff;
}

.contact-info {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.contact-info li {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.contact-icon {
  font-size: 1.2rem;
}

.copyright {
  text-align: center;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer {
    padding: 1.5rem 1rem 1rem;
  }

  .footer-column {
    flex: 1 1 100%;
  }

  .footer-container {
    flex-direction: column;
    gap: 2rem;
  }

  .contact-column {
    align-items: center;
    text-align: center;
  }

  .contact-info li {
    justify-content: center;
  }
}
</style>
