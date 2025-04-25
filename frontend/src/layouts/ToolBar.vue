<script setup lang="ts">
import { useIdentity } from "@/stores/identity";
import { useQuasar } from "quasar";

const $q = useQuasar();
const { login } = useIdentity();
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
</script>

<template>
  <q-list padding>
    <q-item
      v-for="(link, index) in links"
      :key="index"
      :to="link.to"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-avatar :icon="link.icon" size="2em" />
      </q-item-section>
      <q-item-section class="text-h6">{{ link.text }}</q-item-section>
    </q-item>
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
</template>
