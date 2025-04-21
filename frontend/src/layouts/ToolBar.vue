<script setup lang="ts">
import { useQuasar } from "quasar";
import ProposeForm from "../components/ProposeForm.vue";
import { usePocketbaseStore } from "../stores/pocketbase";

const $q = useQuasar();
const { refreshProposes } = usePocketbaseStore();
const links = [
  {
    icon: "fa-solid fa-users",
    text: "提案一覽",
    to: "/propose",
  },
  {
    icon: "fa-solid fa-comments-dollar",
    text: "提案回覆",
    to: "/feedback",
  },
];

const createProposeForm = () => {
  $q.dialog({ component: ProposeForm }).onOk(() => {
    refreshProposes();
    $q.notify({ message: "成功發起提議", position: "bottom-right" });
  });
};

const postProposeForm = () => {
  try {
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <nav :class="$q.dark.isActive ? 'bg-dark' : 'bg-inactive'">
    <q-list class="q-pa-sm">
      <q-item
        v-for="(link, index) in links"
        :key="index"
        :to="link.to"
        clickable
        v-ripple
        class="items-center"
      >
        <q-item-section avatar>
          <q-avatar :icon="link.icon" size="2em" class="q-mr-sm" />
        </q-item-section>
        <q-item-label class="text-h6">{{ link.text }}</q-item-label>
      </q-item>
      <q-btn
        flat
        rounded
        icon="fa-solid fa-plus"
        size="md"
        label="新增共乘提議"
        @click="createProposeForm"
      />
    </q-list>

    <!-- theme changer -->
    <q-list class="q-pa-sm">
      <q-item class="items-center">
        <q-icon name="fa-solid fa-sun" v-if="!$q.dark.isActive" />
        <q-icon name="fa-solid fa-moon" v-else />
        <q-toggle
          :model-value="$q.dark.isActive"
          @update:model-value="$q.dark.toggle"
        />
      </q-item>
    </q-list>
  </nav>
</template>
