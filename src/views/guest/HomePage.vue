<template>
  <div class="home-page">
    <!-- Hero Section (Unchanged) -->
    <section class="hero-section">
      <div class="carousel-container">
        <Carousel
          :items-to-show="1"
          :autoplay="true"
          :autoplayTimeout="1000000"
          :wrapAround="true"
          :pauseAutoplayOnHover="true"
          :transition="1500"
          :mouseDrag="false"
          direction="forward"
        >
          <Slide v-for="(img, index) in images" :key="index">
            <img :src="img" alt="Slide" class="slider-img" />
          </Slide>
        </Carousel>

        <div class="hero-overlay">
          <div class="hero-text">
            <h1>
              Professional <span class="highlight">Nursing Care</span><br />
              At Your Doorstep
            </h1>
            <p>
              Connect with verified, experienced nurses for home care, elderly
              care, post-operative support, and specialized medical services.
            </p>

            <div class="search-bar">
              <select>
                <option>Choose city</option>
                <option>Cairo</option>
                <option>Alexandria</option>
              </select>
              <select>
                <option>Choose area</option>
                <option>NasrCity</option>
                <option>Heliopolis</option>
                <option>Maadi</option>
              </select>
              <select>
                <option>Search service</option>
                <option>Wound care</option>
                <option>Elderly care</option>
              </select>
              <button class="search-btn">Search</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="why-choose">
      <h2>Why Choose <span class="highlight">Carevio</span>?</h2>
      <div class="features">
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/contract.png" alt="Trusted Nurses" />
          </div>
          <h3>Trusted Nurses</h3>
          <p>
            All our caregivers are licensed, verified, and experienced in
            professional home care.
          </p>
        </div>
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/chat.png" alt="24/7 Support" />
          </div>
          <h3>24/7 Support</h3>
          <p>
            We're available round the clock to answer your questions or schedule
            care quickly.
          </p>
        </div>
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/location.png" alt="In-Home Care" />
          </div>
          <h3>In-Home Care</h3>
          <p>
            Book trusted nurses to come directly to your home, wherever you are.
          </p>
        </div>
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/currencies.png" alt="Affordable Pricing" />
          </div>
          <h3>Affordable Pricing</h3>
          <p>
            Transparent pricing plans tailored to your needs without
            compromising on quality.
          </p>
        </div>
      </div>
    </section>

    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>Real experiences from our users</h2>
          <p class="subtitle">
            Discover their stories, how satisfied they were, and how our
            platform made a difference in their lives. We are always committed
            to providing high-quality, reliable care that truly meets your
            needs.
          </p>
        </div>

        <Carousel
          :items-to-show="1"
          :autoplay="true"
          :autoplayTimeout="10000"
          :wrapAround="true"
          :pauseAutoplayOnHover="true"
          :transition="4500"
          :mouseDrag="true"
          direction="forward"
          class="testimonials-carousel"
        >
          <Slide v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p>"{{ testimonial.text }}"</p>
              </div>
              <div class="testimonial-author">
                <h4>{{ testimonial.name }}</h4>
                <div class="rating">
                  <span v-for="star in testimonial.rating" :key="star">★</span>
                </div>
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

import slider1 from "@/assets/slider1.jpg";
import slider2 from "@/assets/slider2.jpg";

const images = [slider1, slider2];

const testimonials = [
  {
    name: "Karim Yasser",
    text: "I tried the platform after a friend recommended it. The nurse arrived on time and knew exactly what to do. I highly recommend it.",
    rating: 5,
  },
  {
    name: "Sarah Mohamed",
    text: "The caregiver was professional and compassionate. She took excellent care of my elderly mother and followed all medical instructions perfectly.",
    rating: 5,
  },
  {
    name: "Ahmed Samir",
    text: "Booking was easy and the nurse was very knowledgeable. Will definitely use this service again for post-surgery care.",
    rating: 4,
  },
];
</script>

<style scoped>
.home-page {
  position: relative;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 85vh;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 90%;
}

.slider-img {
  width: 100%;
  height: 80vh;
  object-fit: cover;
  display: block;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-text {
  width: 90%;
  max-width: 800px;
  color: white;
  text-align: center;
  background: rgba(6, 33, 58, 0.6);
  padding: 1.5rem;
  border-radius: 10px;
  z-index: 10;
}

.hero-text h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  padding-top: 2rem;
}

.highlight {
  color: #00c6ff;
}

.hero-text p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #f0f0f0;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

select,
.search-btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  outline: none;
}

select {
  background-color: white;
  color: #333;
  min-width: 150px;
}

.search-btn {
  background-color: #19599a;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #009acb;
}

/* WHY CHOOSE SECTION  */
.why-choose {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
}

.why-choose h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.why-choose h2::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: #19599a;
}

.why-choose {
  text-align: center;
  padding: 3rem 1rem;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature {
  flex: 1 1 calc(25% - 2rem); /* 4 cards per row (25% width minus gap) */
  min-width: 250px;
  max-width: 300px;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Medium screens (3 cards per row) */
@media (max-width: 1024px) {
  .feature {
    flex: 1 1 calc(33.33% - 2rem); /* 3 cards per row */
  }
}

/* Small screens (2 cards per row) */
@media (max-width: 768px) {
  .feature {
    flex: 1 1 calc(50% - 2rem); /* 2 cards per row */
  }
}

/* Extra small screens (1 card per row) */
@media (max-width: 480px) {
  .feature {
    flex: 1 1 100%; /* Full width */
    max-width: 100%;
  }
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(25, 89, 154, 0.15);
}

.icon-box {
  width: 80px;
  height: 80px;
  background-color: #19599a;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;
}

.feature:hover .icon-box {
  background-color: #00c6ff;
  transform: scale(1.05);
}

.icon-box img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.feature h3 {
  color: #19599a;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.feature p {
  color: #555;
  line-height: 1.6;
}

/* Testimonials Section */

.testimonials-section {
  padding: 4rem 1rem;
  background-color: #f8f9fa;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.section-header h2 {
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  color: #19599a;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: clamp(1rem, 2vw, 1.1rem);
  color: #555;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.testimonials-carousel {
  padding: 0 1rem;
  width: 100%;
}

.testimonial-card {
  background: white;
  border-radius: 12px;
  padding: clamp(1.5rem, 3vw, 2rem);
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 90%;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.testimonial-content {
  font-size: clamp(1rem, 2vw, 1.1rem);
  line-height: 1.7;
  color: #333;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.testimonial-author h4 {
  color: #19599a;
  margin-bottom: 0.5rem;
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.rating {
  color: #ffc107;
  font-size: clamp(1rem, 2vw, 1.2rem);
  letter-spacing: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    height: 75vh;
  }

  .hero-text h1 {
    font-size: 1.8rem;
    padding-top: 1rem;
  }

  .hero-text p {
    font-size: 1rem;
  }

  .slider-img {
    height: 75vh;
  }

  .search-bar {
    flex-direction: column;
    align-items: center;
  }

  select {
    width: 100%;
  }

  .search-btn {
    width: 100%;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature {
    max-width: 90%;
    padding: 1.5rem;
  }

  .testimonials-section {
    padding: 3rem 0.5rem;
  }

  .testimonial-card {
    width: 95%;
    min-height: 220px;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .testimonials-carousel {
    padding: 0;
  }

  .testimonial-card {
    width: 100%;
    min-height: 200px;
    padding: 1.2rem;
    border-radius: 8px;
  }
}
</style>
