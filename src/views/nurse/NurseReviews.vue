<template>
  <div class="reviews-page">
    <NurseSidebar />
    <div class="content">
      <h2 class="title">Patient reviews</h2>
      <p class="subtitle">
        Average rating: {{ averageRating.toFixed(1) }} ({{ reviews.length }}
        reviews)
      </p>
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <img :src="review.photo" class="avatar" />
          <div class="review-info">
            <p class="name">{{ review.name }}</p>
            <p class="time">{{ review.timeAgo }}</p>
            <div class="stars">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ filled: n <= review.rating }"
                >★</span
              >
            </div>
          </div>
        </div>
        <p class="comment">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import NurseSidebar from "../../components/NurseSidebar.vue";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default {
  components: { NurseSidebar },
  data() {
    return {
      reviews: [],
      averageRating: 0,
    };
  },
  async mounted() {
    await this.loadReviews();
  },
  methods: {
    async loadReviews() {
      const snapshot = await getDocs(collection(db, "reviews"));
      let totalRating = 0;

      const reviewPromises = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        totalRating += data.rating;

        const userDoc = await getDoc(doc(db, "users", data.uid));
        const user = userDoc.exists()
          ? userDoc.data()
          : { name: "Unknown", photo: "" };

        const date = new Date(data.date);
        const now = new Date();
        const diffMins = Math.floor((now - date) / (1000 * 60));
        let timeAgo =
          diffMins < 60
            ? `${diffMins} minutes ago`
            : diffMins < 1440
            ? `${Math.floor(diffMins / 60)} hours ago`
            : `${Math.floor(diffMins / 1440)} days ago`;

        return {
          id: docSnap.id,
          name: user.name,
          photo: user.photo || "/default-avatar.png",
          rating: data.rating,
          comment: data.comment,
          timeAgo: timeAgo,
        };
      });

      this.reviews = await Promise.all(reviewPromises);
      this.averageRating =
        this.reviews.length > 0 ? totalRating / this.reviews.length : 0;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&display=swap");

.reviews-page {
  display: flex;
  font-family: "Cairo", sans-serif;
  background: #ffffff;
}

.content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #fff;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #222;
}

.subtitle {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
}

.review-card {
  background: #f8fcfe;
  border: 1px solid #dbe7f0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.review-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 4px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.review-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.3;
}

.name {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: #222;
}

.time {
  font-size: 12px;
  color: #888;
  margin: 2px 0;
}

.stars {
  margin-top: 1px;
}

.stars .star {
  font-size: 14px;
  color: #ccc;
}

.stars .filled {
  color: #fcb103;
}

.comment {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  text-align: left;
  margin-left: 56px;
  margin-top: 0;
}
</style>
