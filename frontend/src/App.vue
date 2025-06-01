<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import Toolbar from "./layouts/ToolBar.vue";
import { useQuasar } from "quasar";
import { useIdentity } from "./stores/identity";
import { usePocketbaseStore } from "./stores/pocketbase";
const $q = useQuasar();

const { refreshProposes } = usePocketbaseStore();
const { createUser, getIsLogin, checkLogin, pb, login, fetchAvatarURL } =
  useIdentity();

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
      <q-page-sticky position="bottom-right">
        <q-btn
          round
          glossy
          class="shadow-10"
          v-ripple
          icon="fa-solid fa-plus"
          size="md"
          @click="createProposeForm"
        />
        <q-tooltip class="bg-white text-black">新增共乘提議</q-tooltip>
      </q-page-sticky>
    </q-page-container>
  </q-layout>

  <div v-else>
    <q-tabs
      v-model="panel"
      class="text-primary"
      align="justify"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="login" label="登入" />
      <q-tab name="register" label="註冊" />
    </q-tabs>

    <q-tab-panels v-model="panel" animated>
      <q-tab-panel name="login">
        <q-form
          @submit.prevent="() => login(email, password)"
          class="q-gutter-md q-mt-md"
        >
          <q-input v-model="email" label="Email" type="email" outlined />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
          />
          <q-btn label="登入" color="primary" type="submit" />
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="register">
        <q-form @submit.prevent="registerUser" class="q-gutter-md q-mt-md">
          <q-toggle
            v-model="isDriver"
            label="我是司機"
            left-label
            color="primary"
          />
          <q-input v-model="formValue.name" label="名稱" outlined />
          <q-input
            v-model="formValue.email"
            label="Email"
            type="email"
            outlined
          />
          <q-input
            v-model="formValue.password"
            label="密碼"
            type="password"
            outlined
          />
          <q-input
            v-model="formValue.confirmPassword"
            label="確認密碼"
            type="password"
            outlined
          />
          <q-input
            v-if="isDriver"
            v-model="formValue.plateNumber"
            label="車牌號碼"
            outlined
          />
          <q-input
            v-if="isDriver"
            v-model="formValue.vehicleType"
            label="車型"
            outlined
          />
          <q-btn label="註冊" color="secondary" type="submit" />
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
