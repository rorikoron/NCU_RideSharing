<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import Toolbar from "./layouts/ToolBar.vue";
import { useQuasar } from "quasar";
import { usePocketbaseStore } from "./stores/pocketbase";
import ProposeForm from "@/components/ProposeForm.vue";
import { useIdentity } from "./stores/identity";
const $q = useQuasar();
const { refreshProposes } = usePocketbaseStore();
const { getIsLogin, checkLogin, pb, login, fetchAvatarURL } = useIdentity();

const drawer = ref(true);
const createProposeForm = () => {
  $q.dialog({ component: ProposeForm }).onOk(() => {
    refreshProposes();
    $q.notify({ message: "成功發起提議", position: "bottom-right" });
  });
};
const email = ref("");
const password = ref("");

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
        <div class="absolute-bottom bg-transparent">
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
          <div class="text-weight-bold">
            {{ pb.authStore.record?.name }}
          </div>
          <div>{{ pb.authStore.record?.email }}</div>
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
          class = "shadow-10"
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
    <q-form @submit.prevent="() => login(email, password)" class="q-gutter-md">
      <q-input v-model="email" label="Email" type="email" outlined />
      <q-input v-model="password" label="Password" type="password" outlined />

      <q-btn label="登入" color="primary" type="submit" />
    </q-form>
  </div>
</template>
