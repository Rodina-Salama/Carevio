<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="carousel-container">
        <Carousel
          :items-to-show="1"
          :autoplay="true"
          :autoplayTimeout="10000"
          :wrapAround="true"
          :pauseAutoplayOnHover="true"
          :transition="4500"
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
              {{ $t("hero.titlePrefix") }}
              <span class="highlight">{{ $t("hero.titleHighlight") }}</span
              ><br />
              {{ $t("hero.titleSuffix") }}
            </h1>
            <p>
              {{ $t("hero.description") }}
            </p>

            <div class="search-bar">
              <!-- City -->
              <select v-model="selectedCity">
                <option value="">{{ $t("hero.chooseCity") }}</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>

              <!-- Area -->
              <select v-model="selectedArea" :disabled="!selectedCity">
                <option value="">{{ $t("hero.chooseArea") }}</option>
                <option v-for="area in filteredAreas" :key="area" :value="area">
                  {{ area }}
                </option>
              </select>

              <select v-model="selectedService">
                <option value="">{{ $t("hero.searchService") }}</option>
                <option
                  v-for="service in specializationOptions"
                  :key="service"
                  :value="service"
                >
                  {{ service }}
                </option>
              </select>

              <button class="search-btn" @click="handleSearch">
                {{ $t("hero.searchButton") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="why-choose">
      <h2>
        {{ $t("whyChoose.titlePrefix") }}
        <span class="highlight">{{ $t("whyChoose.titleHighlight") }}</span
        >?
      </h2>
      <div class="features">
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/contract.png" alt="Trusted Nurses" />
          </div>
          <h3>{{ $t("whyChoose.trustedNursesTitle") }}</h3>
          <p>
            {{ $t("whyChoose.trustedNursesDescription") }}
          </p>
        </div>
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/chat.png" alt="24/7 Support" />
          </div>
          <h3>{{ $t("whyChoose.supportTitle") }}</h3>
          <p>
            {{ $t("whyChoose.supportDescription") }}
          </p>
        </div>
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/location.png" alt="In-Home Care" />
          </div>
          <h3>{{ $t("whyChoose.inHomeCareTitle") }}</h3>
          <p>
            {{ $t("whyChoose.inHomeCareDescription") }}
          </p>
        </div>
        <div class="feature">
          <div class="icon-box">
            <img src="@/assets/currencies.png" alt="Affordable Pricing" />
          </div>
          <h3>{{ $t("whyChoose.affordablePricingTitle") }}</h3>
          <p>
            {{ $t("whyChoose.affordablePricingDescription") }}
          </p>
        </div>
      </div>
    </section>

    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>{{ $t("testimonials.title") }}</h2>
        </div>
        <p class="subtitle">
          {{ $t("testimonials.subtitle") }}
        </p>

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

    <section class="services-section">
      <div class="container">
        <div class="section-header">
          <h2>{{ $t("services.title") }}</h2>
          <button @click="navigateToServices" class="explore-btn">
            {{ $t("services.moreServices") }}
          </button>
        </div>

        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">
              <img src="@/assets/service1.png" alt="Elderly Care" />
            </div>
            <h3>{{ $t("services.elderlyCareTitle") }}</h3>
            <p>
              {{ $t("services.elderlyCareDesc") }}
            </p>
          </div>

          <div class="service-card">
            <div class="service-icon">
              <img src="@/assets/service2.png" alt="Pediatric Support" />
            </div>
            <h3>{{ $t("services.pediatricTitle") }}</h3>
            <p>
              {{ $t("services.pediatricDesc") }}
            </p>
          </div>

          <div class="service-card">
            <div class="service-icon">
              <img src="@/assets/service3.png" alt="Injections & IV Therapy" />
            </div>
            <h3>{{ $t("services.injectionsTitle") }}</h3>
            <p>
              {{ $t("services.injectionsDesc") }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

import slider1 from "@/assets/slider1.jpg";
import slider2 from "@/assets/slider2.jpg";
import { cities, areas } from "@/data/locationOptions";
import { specializationOptions } from "@/data/specializationOptions";

const router = useRouter();

const filteredAreas = computed(() => {
  return areas[selectedCity.value] || [];
});

// Refs for form inputs
const selectedCity = ref("");
const selectedArea = ref("");
const selectedService = ref("");

const images = [slider1, slider2];

const testimonials = [
  {
    name: "Karim Yasser",
    text: "I tried the platform after a friend recommended it. The nurse arrived on time and knew exactly what to do. I highly recommend it.",
    rating: 5,
  },
  {
    name: "Ahmed Samir",
    text: "The caregiver was professional and compassionate. She took excellent care of my elderly mother and followed all medical instructions perfectly.",
    rating: 4,
  },
  {
    name: "Rodina",
    text: "Booking was easy and the nurse was very knowledgeable. Will definitely use this service again for post-surgery care.",
    rating: 5,
  },
  {
    name: "Sarah Mohamed",
    text: "At first I worried about strangers coming to my home. But after the first visit, I felt completely safe. Very professional.",
    rating: 5,
  },
];

const handleSearch = () => {
  router.push({
    path: "/browse",
    query: {
      city: selectedCity.value,
      area: selectedArea.value,
      service: selectedService.value,
    },
  });
};

// Scroll-to-top solution
const navigateToServices = () => {
  router.push("/services").then(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};
</script>
<!-- Your existing styles remain exactly the same -->
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}

.hero-text {
  width: 90%;
  max-width: 800px;
  color: white;
  text-align: center;
  background: rgba(6, 33, 58, 0.6);
  padding: 3rem;
  border-radius: 10px;
  z-index: 10;
}

.hero-text h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  padding-top: 4rem;
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
  justify-content: flex-start;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature {
  flex: 1 1 calc(25% - 1.5rem);
  /* 4 cards per row (25% width minus gap) */
  min-width: 200px;
  max-width: 250px;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Medium screens (3 cards per row) */
@media (max-width: 1024px) {
  .feature {
    flex: 1 1 calc(33.33% - 2rem);
    /* 3 cards per row */
    margin-bottom: 60px;
  }
}

/* Small screens (2 cards per row) */
@media (max-width: 768px) {
  .feature {
    flex: 1 1 calc(50% - 2rem);
    /* 2 cards per row */
  }
}

/* Extra small screens (1 card per row) */
@media (max-width: 480px) {
  .feature {
    flex: 1 1 100%;
    /* Full width */
    max-width: 100%;
    margin-bottom: 60px;
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
  text-align: center;
}

.section-header h2 {
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  color: #19599a;
  text-align: center;
  min-width: 300px;
}

.subtitle {
  font-size: clamp(1rem, 2vw, 1.1rem);
  color: #555;
  max-width: 800px;
  margin: auto;
  line-height: 1.6;
  margin-top: 5px;
  margin-bottom: 30px;
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
    text-align: center;
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

/*service section*/

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
  justify-content: flex-end;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
  margin-top: 50px;
}

.section-header h2 {
  font-size: 2rem;
  color: #19599a;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  margin-bottom: 50px;
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

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
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
