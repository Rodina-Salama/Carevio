<template>
  <section class="services-section">
    <div class="container">
      <div class="section-header">
        <h2>Our Services</h2>
        <router-link to="/services" class="explore-btn">
          Explore More Services →
        </router-link>
      </div>

      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">
            <img src="@/assets/service1.png" alt="Elderly Care" />
          </div>
          <h3>Elderly Care</h3>
          <p>
            Compassionate care for seniors, ensuring comfort and well-being at
            home.
          </p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <img src="@/assets/service2.png" alt="Pediatric Support" />
          </div>
          <h3>Pediatric Support</h3>
          <p>
            Specialized care for children, providing comfort and support in a
            familiar setting.
          </p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <img src="@/assets/service3.png" alt="Injections & IV Therapy" />
          </div>
          <h3>Injections & IV Therapy</h3>
          <p>
            Professional administration of injections and IV fluids, ensuring
            safety and efficacy.
          </p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <img src="@/assets/service4.png" alt="Bedridden Patient" />
          </div>
          <h3>Bedridden Patient</h3>
          <p>
            Dedicated assistance for bedridden patients, focusing on comfort and
            comprehensive care.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ServicesSection",
};
</script>

<style scoped>
.services-section {
  padding: 4rem 1rem;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  color: #19599a;
  margin: auto;
}

.explore-btn {
  background-color: transparent;
  color: #19599a;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid #19599a;
}

.explore-btn:hover {
  background-color: #19599a;
  color: white;
  transform: translateY(-2px);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.service-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.service-icon {
  width: 100%;
  margin: 0 auto 1.5rem;
  flex: 0 0 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.service-card h3 {
  color: #19599a;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.service-card p {
  color: #555;
  line-height: 1.6;
  margin-top: auto;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .services-section {
    padding: 3rem 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .service-icon {
    flex: 0 0 100px;
  }

  .service-icon img {
    width: 80px;
    height: 80px;
  }
}
</style>
