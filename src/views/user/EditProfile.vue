<template>
  <div class="edit-profile-container">
    <div class="form-card">
      <h2>{{ $t("editProfile.title") }}</h2>

      <div class="form-group">
<<<<<<< HEAD
        <label>Profile Image</label>
=======
        <label>{{ $t("editProfile.profileImageLabel") }}</label>

>>>>>>> 34532b9 (Finally translated all pages in website & nurse dashboard)
        <div v-if="previewUrl" class="preview-img">
          <img :src="previewUrl" alt="Preview" />
        </div>
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          ref="fileInput"
        />
        <p v-if="imageError" class="error-message">{{ imageError }}</p>
      </div>

      <div class="form-group">
        <label>{{ $t("editProfile.fullNameLabel") }}</label>
        <input type="text" v-model="fullName" />
      </div>

      <div class="form-group">
        <label>{{ $t("editProfile.phoneLabel") }}</label>
        <input type="text" v-model="phone" />
      </div>

      <div class="button-group">
        <button class="btn save" @click="saveChanges">
          {{ $t("editProfile.saveButton") }}
        </button>
        <button class="btn back" @click="goBack">
          {{ $t("editProfile.backButton") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const userId = ref(null);
    const fileInput = ref(null);
    const imageError = ref("");

    const fullName = ref("");
    const phone = ref("");
    const profileImage = ref("");
    const previewUrl = ref("");

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          userId.value = user.uid;
          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            fullName.value = data.fullName || "";
            phone.value = data.phone || "";
            profileImage.value = data.profileImage || "";
            previewUrl.value = data.profileImage || "";
          }
        } else {
          router.push("/signin");
        }
      });
    });

    const handleImageUpload = (e) => {
      imageError.value = "";
      const file = e.target.files[0];

      if (!file) return;

      // Check file size (1MB limit)
      if (file.size > 1024 * 1024) {
        imageError.value = "Image size must be less than 1MB";
        fileInput.value.value = ""; // Clear the file input
        return;
      }

      // Check file type
      if (!file.type.match("image.*")) {
        imageError.value = "Please select an image file";
        fileInput.value.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        profileImage.value = reader.result;
        previewUrl.value = reader.result;
      };
      reader.readAsDataURL(file);
    };

    const saveChanges = async () => {
      if (!userId.value) return;
      if (imageError.value) return; // Don't save if there's an image error

      const userDoc = doc(db, "users", userId.value);
      await updateDoc(userDoc, {
        fullName: fullName.value,
        phone: phone.value,
        profileImage: profileImage.value,
      });

      router.push("/userprofile");
    };

    const goBack = () => {
      router.push("/userprofile");
    };

    return {
      fullName,
      phone,
      previewUrl,
      fileInput,
      imageError,
      handleImageUpload,
      saveChanges,
      goBack,
    };
  },
};
</script>

<style scoped>
.edit-profile-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-card {
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.preview-img {
  margin-top: 10px;
  text-align: center;
  margin-bottom: 10px;
}

.preview-img img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4a6fa5;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 10px;
  margin: 0 5px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

.btn.save {
  background-color: #4a6fa5;
  color: white;
}

.btn.back {
  background-color: #ccc;
  color: #333;
}

.btn:hover {
  opacity: 0.9;
}
</style>
