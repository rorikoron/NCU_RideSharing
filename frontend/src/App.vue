<script setup lang="ts">
import { ref } from "vue";
import Toolbar from "./layouts/ToolBar.vue";
import { useQuasar } from "quasar";
import { usePocketbaseStore } from "./stores/pocketbase";
import ProposeForm from "@/components/ProposeForm.vue";
const $q = useQuasar();
const { refreshProposes } = usePocketbaseStore();

const drawer = ref(true);
const miniState = ref(false);
const createProposeForm = () => {
  $q.dialog({ component: ProposeForm }).onOk(() => {
    refreshProposes();
    $q.notify({ message: "成功發起提議", position: "bottom-right" });
  });
};
// <nav :class="$q.dark.isActive ? 'bg-dark' : 'bg-inactive'">
</script>

<template>
  <q-layout class="row">
    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      :width="200"
      :breakpoint="500"
      bordered
    >
      <Toolbar class="col-2" />
    </q-drawer>
    <q-page-container class="col-grow">
      <q-page padding>
        <router-view />

      </q-page>

      <q-page-sticky position="bottom-right">
        <q-btn
          flat
          rounded
          icon="fa-solid fa-plus"
          size="md"
          label="新增共乘提議"
          @click="createProposeForm"
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>
