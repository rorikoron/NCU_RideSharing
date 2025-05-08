<script setup>
import { ref, reactive, computed } from "vue";

const currentTab = ref("general");

const defaultAvatar =
  "https://imgs.gotrip.hk/wp-content/uploads/2017/11/nhv4dxh3MJN7gxp/blank-profile-picture-973460_960_720_2583405935a02dfab699c6.png";

const avatarPreview = ref(defaultAvatar);

const general = reactive({
  name: "",
  email: "",
  avatar: "",
});

let originalGeneral = JSON.parse(JSON.stringify(general));

const vehicle = reactive({
  model: "",
  plate: "",
  color: "",
  seats: 4,
});

let originalVehicle = JSON.parse(JSON.stringify(vehicle));

const generalChanged = computed(() => {
  return JSON.stringify(general) !== JSON.stringify(originalGeneral);
});

const vehicleChanged = computed(() => {
  return JSON.stringify(vehicle) !== JSON.stringify(originalVehicle);
});

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
      general.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removeAvatar() {
  avatarPreview.value = defaultAvatar;
  general.avatar = "";
}

function saveGeneral() {
  originalGeneral = JSON.parse(JSON.stringify(general));
}

function saveVehicle() {
  originalVehicle = JSON.parse(JSON.stringify(vehicle));
}
</script>

<template>
  <div class="profile-page">
    <div class="sidebar">
      <button
        :class="{ active: currentTab === 'general' }"
        @click="currentTab = 'general'"
      >
        一般設定
      </button>
      <button
        :class="{ active: currentTab === 'vehicle' }"
        @click="currentTab = 'vehicle'"
      >
        車輛設定
      </button>
    </div>

    <div class="content">
      <div v-if="currentTab === 'general'" class="tab-content">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img :src="avatarPreview.value" alt="頭像" />
          </div>
          <input type="file" @change="handleAvatarChange" />
          <button
            v-if="avatarPreview.value !== defaultAvatar"
            class="btn btn-danger btn-sm"
            @click="removeAvatar"
          >
            移除頭像
          </button>
        </div>
        <div class="fields-section">
          <label>
            姓名：
            <input v-model="general.name" type="text" />
          </label>
          <label>
            Email：
            <input v-model="general.email" type="email" />
          </label>
          <button
            v-if="generalChanged.value"
            class="save-btn"
            @click="saveGeneral"
          >
            儲存
          </button>
        </div>
      </div>

      <div v-if="currentTab === 'vehicle'" class="tab-content">
        <div class="fields-section">
          <label>
            車型：
            <input v-model="vehicle.model" type="text" />
          </label>
          <label>
            車號：
            <input v-model="vehicle.plate" type="text" />
          </label>
          <label>
            顏色：
            <input v-model="vehicle.color" type="text" />
          </label>
          <label>
            座位數：
            <input v-model.number="vehicle.seats" type="number" />
          </label>
          <button
            v-if="vehicleChanged.value"
            class="save-btn"
            @click="saveVehicle"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
}

.profile-page {
  display: flex;
  max-width: 900px;
  margin: 40px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 20px;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar button {
  padding: 10px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
}

.sidebar button.active {
  font-weight: bold;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.content {
  flex: 1;
  padding: 20px;
}

.tab-content {
  display: flex;
  gap: 2rem;
}

.avatar-wrapper {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ccc;
  margin-bottom: 10px;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fields-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fields-section label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

button.save-btn {
  margin-top: 10px;
  align-self: flex-start;
}
</style>
