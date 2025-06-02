<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import Toolbar from "./layouts/ToolBar.vue";
import { useQuasar } from "quasar";
import { useIdentity } from "./stores/identity";
const $q = useQuasar();
const { createUser, getIsLogin, checkLogin, pb, login, fetchAvatarURL } = useIdentity();

const drawer = ref(true);
const email = ref("");
const password = ref("");
const panel = ref("login");
const isDriver = ref(false);

// user register function
const registerUser = async () => {
  if (formValue.value.password !== formValue.value.confirmPassword) {
    $q.notify({ type: "negative", message: "兩次密碼不一致" });
    return;
  }
  console.log(formValue.value);
  const userForm = new FormData();
  userForm.append("name", formValue.value.name);
  userForm.append("email", formValue.value.email);
  userForm.append("password", formValue.value.password);
  userForm.append("passwordConfirm", formValue.value.confirmPassword);
  userForm.append("is_driver", String(isDriver.value));

  try {
    await createUser(userForm);

    //store car data
    if (isDriver.value) {
      const carForm = new FormData();
      carForm.append("owner", formValue.value.name);
      carForm.append("plateNumber", formValue.value.plateNumber);
      carForm.append("vehicleType", formValue.value.vehicleType);

      await pb.collection("Car").create(carForm);
    }

    $q.notify({ type: "positive", message: "註冊成功，請登入" });
    panel.value = "login";
  } catch (error) {
    console.log(error);
    $q.notify({ type: "negative", message: "註冊失敗，請檢查資訊" });
  }
};

// user register form data
const formValue = ref<any>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  is_driver: "",
  plateNumber: "",
  vehicleType: "",
});

onBeforeMount(async () => {
  await checkLogin();
});
</script>

<template>
  <q-layout v-if="getIsLogin()" class="row" view="lHh Lpr lFf">
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="240"
      :breakpoint="500"
      bordered
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <Toolbar />
      </q-scroll-area>

      <q-img class="absolute-top bg-primary" style="height: 150px">
        <div
          class="absolute-bottom bg-transparent row items-center q-gutter-sm"
        >
          <q-avatar size="56px" class="q-mb-sm">
            <img
              :src="
                fetchAvatarURL(
                  pb.authStore.record!.id,
                  pb.authStore.record!.avatar
                )
              "
              alt="avatar"
            />
          </q-avatar>
          <div class="column">
            <div class="text-weight-bold">
              {{ pb.authStore.record?.name }}
            </div>
            <div>{{ pb.authStore.record?.email }}</div>
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container class="col-grow">
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>

  <div v-else>
    <!-- Introduction before entering the website -->
    <div class="q-pa-xl bg-orange text-center text-white" style="max-width: 100%; border-radius: 0 0 24px 24px">
      <h1 class="text-h3 text-weight-bold">中大共乘平台</h1>
      <p class="text-subtitle1 q-mt-sm">
        專為中央大學打造的共乘媒合系統，讓搭車更方便、更安全、更即時。
      </p>
      <div class="row justify-center q-gutter-sm q-mt-md">
        <q-btn color="white" text-color="orange" label="立即註冊" unelevated rounded href="#login-and-register" />
        <q-btn outline color="white" label="已有帳號？登入" to="/login" rounded href="#login-and-register" />
      </div>
    </div>

    <!-- Introduction -- motivation -->
    <section class="q-pa-xl bg-grey-1">
      <div class="q-mx-auto" style="max-width: 850px;">
        <div class="row items-center q-mb-md">
          <q-icon name="help_outline" color="orange" size="md" class="q-mr-sm" />
          <h2 class="text-h5 text-weight-medium text-orange">為什麼我們需要共乘平台？</h2>
        </div>
        <div class="q-my-sm">
          <q-icon name="place" color="negative" class="q-mr-sm" />
          中央大學地處偏遠，前往桃園高鐵交通不便。
        </div>
        <div class="q-my-sm">
          <q-icon name="chat_bubble_outline" color="warning" class="q-mr-sm" />
          Line 群組訊息過多，難以快速找到適合的共乘資訊。
        </div>
        <div class="q-my-sm">
          <q-icon name="update" color="info" class="q-mr-sm" />
          共乘資訊無法即時更新，容易錯失搭乘機會。
        </div>
        <div class="q-my-sm">
          <q-icon name="report_problem" color="deep-orange" class="q-mr-sm" />
          缺乏評價機制，使用者難以判斷駕駛或乘客可靠度。
        </div>
      </div>
    </section>

    <!-- Introduction -- function -->
    <section class="q-pa-xl bg-orange-2 text-dark" style="background: linear-gradient(to right, #ffe8d0, #fff0e0)">
      <div class="q-mx-auto" style="max-width: 850px;">
        <div class="row items-center q-mb-md">
          <q-icon name="apps" color="orange-9" size="md" class="q-mr-sm" />
          <h2 class="text-h5 text-orange-10 text-weight-medium">我們提供的功能</h2>
        </div>
        <p class="text-body1">
          乘客可發布搭車需求，包括起點、終點、時間與人數，並可即時查詢所有可共乘的行程...
        </p>
      </div>
    </section>

    <!-- Introduction -- innovation -->
    <div class="q-my-xl q-pa-md bg-white q-mx-auto shadow-1 rounded-borders" style="max-width: 850px">
      <div class="row items-center q-mb-md">
        <q-icon name="star_outline" color="amber-7" size="md" class="q-mr-sm" />
        <h2 class="text-h5 text-amber-9 text-weight-medium">我們的創新特色</h2>
      </div>
      <q-timeline color="amber-9" layout="comfortable">
        <q-timeline-entry title="多元評價系統" subtitle="乘客與駕駛、乘客間皆可互評" icon="thumb_up" />
        <q-timeline-entry title="雙向媒合機制" subtitle="駕駛報價後由乘客決定是否接受" icon="swap_horiz" />
        <q-timeline-entry title="共乘夥伴模式" subtitle="可只找同路乘客，共享計程車費用" icon="group" />
      </q-timeline>
    </div>


    <!-- login and register -->
    <section class="q-my-xl bg-grey-2 q-pa-xl">
  <div class="q-mx-auto" style="max-width: 700px;">
    <q-tabs
      v-model="panel"
      class="text-orange-10 bg-white rounded-borders"
      active-color="orange"
      indicator-color="orange"
      align="justify"
    >
      <q-tab name="login" label="登入" />
      <q-tab name="register" label="註冊" />
    </q-tabs>

    <q-tab-panels v-model="panel" animated class="bg-white q-pa-xl rounded-borders shadow-1 q-mt-sm" id="login-and-register">
      <!-- login -->
      <q-tab-panel name="login">
        <h3 class="text-h6 text-primary q-mb-md">登入帳號</h3>
        <q-form @submit.prevent="() => login(email, password)" class="q-gutter-md">
          <q-input v-model="email" label="Email" type="email" outlined dense />
          <q-input v-model="password" label="密碼" type="password" outlined dense />
          <q-btn label="登入" color="primary" class="full-width q-mt-md" type="submit" unelevated rounded />
        </q-form>
      </q-tab-panel>

      <!-- register -->
      <q-tab-panel name="register">
        <h3 class="text-h6 text-primary q-mb-md">註冊帳號</h3>
        <q-form @submit.prevent="registerUser" class="q-gutter-md">
          <q-toggle
            v-model="isDriver"
            label="我是司機"
            left-label
            color="orange"
          />
          <q-input v-model="formValue.name" label="名稱" outlined dense />
          <q-input v-model="formValue.email" label="Email" type="email" outlined dense />
          <q-input v-model="formValue.password" label="密碼" type="password" outlined dense />
          <q-input v-model="formValue.confirmPassword" label="確認密碼" type="password" outlined dense />
          <q-input v-if="isDriver" v-model="formValue.plateNumber" label="車牌號碼" outlined dense />
          <q-input v-if="isDriver" v-model="formValue.vehicleType" label="車型" outlined dense />
          <q-btn label="註冊" color="secondary" class="full-width q-mt-md" type="submit" unelevated rounded />
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </div>
  </section>
  </div>
</template>
