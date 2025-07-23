<template>
  <div class="nurse-profile-container">
    <div class="nurse-profile-page">
      <div class="nurse-profile-card">
        <div class="header-section">
          <div class="avatar-info-wrapper">
            <img :src="require('@/assets/sophia.jpg')" class="avatar" />
            <div class="info">
              <h2>{{ nurseData.name }}</h2>
              <p class="title">{{ nurseData.title }}</p>
              <p class="location">{{ nurseData.location }}</p>
            </div>
          </div>

          <div class="price-section">
            <p>
              Price per visit: <span>{{ nurseData.pricePerVisit }} LE</span>
            </p>
            <button @click="handleBookNow" class="btn-book-now">
              BOOK NOW
            </button>
          </div>
        </div>

        <div class="description-section">
          <p>{{ nurseData.description }}</p>
        </div>

        <div class="services-section">
          <h3>Services</h3>
          <div class="service-tags">
            <span
              v-for="service in nurseData.services"
              :key="service"
              class="tag"
              >{{ service }}</span
            >
          </div>
        </div>
      </div>

      <div class="review-section">
        <h3>Reviews</h3>
        <div class="average-rating">
          Average rating: <span>{{ averageRating }}</span> ({{
            reviews.length
          }}
          review<span v-if="reviews.length !== 1">s</span>)
        </div>

        <div class="reviews-list">
          <div class="review-item" v-for="review in reviews" :key="review.id">
            <div class="review-header">
              <div class="reviewer-info">
                <img
                  :src="review.authorImage || defaultUserImage"
                  class="reviewer-avatar"
                />
                <div class="reviewer-details">
                  <span class="author">{{ review.author }}</span>
                  <span class="time">{{ review.time }}</span>
                </div>
              </div>
              <div class="rating">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= review.rating }"
                  >★</span
                >
              </div>
            </div>
            <p class="review-text">{{ review.text }}</p>
          </div>
        </div>

        <div class="add-review-form">
          <h4>Add Your Review</h4>
          <form @submit.prevent="submitReview" class="review-form">
            <div class="form-group">
              <label>Your Rating:</label>
              <div class="star-rating-input">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= newRating }"
                  @click="newRating = star"
                  >★</span
                >
              </div>
            </div>

            <div class="form-group">
              <label>Your Review:</label>
              <textarea
                v-model="newReviewText"
                rows="5"
                placeholder="Share your experience here..."
                required
              ></textarea>
            </div>

            <button type="submit" :disabled="!newReviewText || newRating === 0">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nurseData: {
        name: "Layla Hassan",
        title: "Experienced Registered Nurse",
        location: "Cairo, Egypt",
        pricePerVisit: 150,
        description:
          "Layla Hassan is a compassionate and experienced registered nurse with a passion for providing personalized care at home. With over 10 years of experience in the healthcare industry, she has developed a deep understanding of patient needs and a commitment to delivering high-quality care.",
        services: ["Elderly Care", "Post Surgery"],
      },
      reviews: [
        {
          id: 1,
          author: "Fatima Mahmoud",
          authorImage: require("@/assets/sophia.jpg"),
          time: "3 weeks ago",
          text: "Miss Layla provided exceptional care for my grandmother.",
          rating: 5,
        },
        {
          id: 2,
          author: "Omar Ali",
          authorImage: require("@/assets/sophia.jpg"),
          time: "1 month ago",
          text: "Layla was professional and helpful during my recovery.",
          rating: 4,
        },
      ],
      newReviewText: "",
      newRating: 0,
    };
  },
  computed: {
    averageRating() {
      if (this.reviews.length === 0) return "N/A";
      const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
      return (total / this.reviews.length).toFixed(1);
    },
  },
  methods: {
    handleBookNow() {
      alert("Booking functionality would go here!");
    },
    submitReview() {
      if (this.newReviewText.trim() && this.newRating > 0) {
        const newReview = {
          id: this.reviews.length + 1,
          text: this.newReviewText.trim(),
          rating: this.newRating,
          author: "You",
          authorImage: this.defaultUserImage,
          time: "Just now",
        };
        this.reviews.unshift(newReview);
        this.newReviewText = "";
        this.newRating = 0;
      }
    },
  },
};
</script>

<style scoped>
.nurse-profile-container {
  font-family: "Segoe UI", sans-serif;
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.nurse-profile-page {
  padding: 40px 120px;
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.nurse-profile-card,
.review-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.avatar-info-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.info h2 {
  margin: 10px 0 5px;
  font-size: 1.5em;
}

.title {
  font-weight: 600;
  color: #555;
}

.location {
  color: #777;
  font-size: 0.9em;
}

.price-section {
  margin-left: 50%;
  text-align: right;
}

.price-section p {
  font-size: 1.2em;
}

.price-section span {
  color: #19599a;
  font-weight: bold;
}

.btn-book-now {
  background: #19599a;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  margin-top: 10px;
  font-weight: 600;
}

.description-section p {
  margin: 0;
  line-height: 1.6;
  text-align: left;
}

.services-section .tag {
  background: #e0e6ed;
  border-radius: 15px;
  padding: 6px 12px;
  margin: 4px;
  display: inline-block;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
}

.star {
  color: #ccc;
  cursor: pointer;
}

.star.filled {
  color: #ffc107;
}

textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #dd;
}
.review-form button {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  margin-top: 10px;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .nurse-profile-page {
    padding: 20px;
  }

  .header-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .price-section {
    margin-left: 0;
    text-align: center;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .rating {
    margin-top: 8px;
  }
}
</style>
