<template>
  <section class="who-we-are">
    <div class="container">
      <div class="content">
        <div class="text">
          <h2>Who Are We?</h2>
          <p>
            We are a team of compassionate, highly trained caregivers and
            licensed nurses dedicated to providing personalized, professional
            care in the comfort of your home. Our mission is simple: to support
            families and improve lives by delivering trustworthy, heartfelt home
            nursing services tailored to each individual’s needs.
          </p>
          <p>
            We believe home is where healing happens best. That’s why our nurses
            go beyond routine tasks. We build real relationships, offer
            emotional support, and ensure that each client feels safe, seen, and
            valued.
          </p>
        </div>
        <div class="image">
          <img src="@/assets/who-we-are.png" alt="Team Image" />
        </div>
      </div>
    </div>
  </section>
  <section class="what-we-offer">
    <div class="offer-content">
      <h2>What We Offer</h2>
      <p>
        We offer specialized care and personalized activities to provide
        comfort,safety, and well-being to our seniors, promoting quality of life
        on a daily basis.
      </p>
    </div>
  </section>
  <section class="how-it-works">
    <div class="container">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step-card">
          <img src="@/assets/Step1.png" alt="Step 1" />
          <h3>Step 1 - Search on our site</h3>
        </div>
        <div class="step-card">
          <img src="@/assets/Step2.png" alt="Step 2" />
          <h3>Step 2 - Connect With a Nurse</h3>
        </div>
        <div class="step-card">
          <img src="@/assets/Step3.png" alt="Step 3" />
          <h3>Step 3 - Get Care at Home</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "WhoWeAre",
};
</script>

<style scoped>
.who-we-are {
  padding: 4rem 0;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.text {
  flex: 1;
  text-align: left;
  align-self: flex-start;
}

.text h2 {
  font-size: 2.5rem;
  color: #19599a;
  margin: 0 0 1rem 0;
}

.text p {
  font-size: 1.1rem;
  color: #0d0d0d;
  line-height: 1.6;
  margin-top: 0;
}

.image {
  flex: 1;
  max-width: 50%;
}

.image img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

.what-we-offer {
  background-color: #edf4fc;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.offer-content {
  text-align: center;
  max-width: 800px;
}

.offer-content h2 {
  font-size: 2.2rem;
  color: #19599a;
  margin-bottom: 1rem;
}

.offer-content p {
  font-size: 1.1rem;
  color: #0d0d0d;
  line-height: 1.6;
}

.how-it-works {
  padding: 4rem 1rem;
  text-align: center;
  border-radius: 12px;
  margin-top: 2rem;
}

.how-it-works h2 {
  font-size: 2.2rem;
  color: #19599a;
  margin-bottom: 2rem;
}

.steps {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.step-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  flex: 1 1 250px;
}

.step-card img {
  max-width: 300px;
  margin-bottom: 1rem;
}

.step-card h3 {
  font-size: 1.3rem;
  color: #0d0d0d;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 992px) {
  .content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .text,
  .image {
    max-width: 100%;
    flex: 1 1 100%;
  }

  .text h2 {
    font-size: 2rem;
  }

  .image img {
    width: 100%;
    height: auto;
  }

  .offer-content h2,
  .how-it-works h2 {
    font-size: 2rem;
  }

  .step-card {
    padding: 1.5rem;
  }

  .step-card h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .text h2,
  .offer-content h2,
  .how-it-works h2 {
    font-size: 1.7rem;
  }

  .text p,
  .offer-content p {
    font-size: 1rem;
  }

  .step-card img {
    max-width: 100%;
  }

  .steps {
    flex-direction: column;
    gap: 1.5rem;
  }

  .step-card {
    max-width: 100%;
  }
}
</style>
