<script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useIdentity } from "@/stores/identity";
import { toRaw } from "vue";

const $q = useQuasar();
const { getAuthUser, fetchAvatarURL, pb, checkLogin } = useIdentity();

const currentTab = ref("general");
const defaultAvatar = "/assets/default_icon.png"; // 預設頭像圖片路徑

const authUser = getAuthUser();

const avatarPreview = ref(
  fetchAvatarURL(authUser?.id, authUser?.avatar) || defaultAvatar
);

const general = reactive({
  name: authUser?.name || "",
  email: authUser?.email || "",
  avatar: authUser?.avatar || "",
});

const removeAvatarFlag = ref(false);
let originalGeneral = { ...toRaw(general) };

const generalChanged = computed(() => {
  return (
    JSON.stringify(general) !== JSON.stringify(originalGeneral) ||
    removeAvatarFlag.value
  );
});

function changeAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
      general.avatar = e.target.result; // base 64
      removeAvatarFlag.value = false;
    };
    reader.readAsDataURL(file);
  }
}

function removeAvatar() {
  $q.dialog({
    title: "確認",
    message: "確定要移除頭像嗎？",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    avatarPreview.value = defaultAvatar;
    general.avatar = "";
    removeAvatarFlag.value = true;
  });
}

// save user info
async function saveGeneralUserData() {
  try {
    const form = new FormData();
    form.append("name", general.name);
    form.append("email", general.email);

    if (removeAvatarFlag.value) {
      form.append("avatar", "");
    } else if (general.avatar && general.avatar.startsWith("data:")) {
      const blob = await (await fetch(general.avatar)).blob();
      const file = new File([blob], "avatar.png", { type: blob.type });
      form.append("avatar", file);
    }

    const updated = await pb.collection("users").update(authUser?.id, form);
    originalGeneral = { ...toRaw(general) };
    removeAvatarFlag.value = false;
    $q.notify({ type: "positive", message: "一般資料已更新" });
  } catch (err) {
    $q.notify({ type: "negative", message: "儲存失敗：" + err.message });
  }
}

onBeforeMount(async () => {
  await checkLogin();
});
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <q-avatar size="80px">
        <img :src="avatarPreview" alt="icon" />
      </q-avatar>
      <div class="profile-info">
        <div class="profile-name">{{ general.name || "未命名使用者" }}</div>
        <div class="profile-email">{{ general.email }}</div>
      </div>
    </div>

    <div class="form-section">
      <div class="avatar-edit">
        <q-btn
          label="選擇新頭像"
          @click="$refs.fileInput.click()"
          color="primary"
          outline
        />
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="changeAvatar"
        />
        <q-btn
          v-if="avatarPreview !== defaultAvatar"
          label="移除頭像"
          @click="removeAvatar"
          color="negative"
          outline
        />
      </div>

      <q-input v-model="general.name" label="姓名" outlined dense />
      <q-input
        v-model="general.email"
        label="Email"
        outlined
        dense
        type="email"
      />

      <q-btn
        v-if="generalChanged"
        label="儲存變更"
        @click="saveGeneralUserData"
        color="primary"
        class="q-mt-md"
      />
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: bold;
  font-size: 18px;
}

.profile-email {
  color: #888;
  font-size: 14px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.avatar-edit {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.hidden {
  display: none;
}
</style>
