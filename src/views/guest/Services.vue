<template>
  <section class="services-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Our Services</h2>
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

        <div class="service-card">
          <div class="service-icon">
            <img src="@/assets/service5.png" alt="Disability Care" />
          </div>
          <h3>Disability Care</h3>
          <p>
            Support for patients with disability, Helping with Hygiene, feeding,
            mobility, medication
          </p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <img src="@/assets/service6.png" alt="Vital Signs Monitoring" />
          </div>
          <h3>Vital Signs Monitoring</h3>
          <p>
            Track heart rate, temperature, blood pressure, and oxygen using
            devices
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ServicesPage",
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
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  color: #19599a;
  margin-bottom: 1rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.service-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.service-icon {
  width: 100%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon img {
  width: 300px;
  height: 200px;
  object-fit: contain;
}

.service-card h3 {
  color: #19599a;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.service-card p {
  color: #555;
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .services-section {
    padding: 2rem 1rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .service-icon img {
    width: 180px;
    height: 180px;
  }
}
</style>
