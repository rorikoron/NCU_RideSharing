<script setup lang="ts">
import { usePocketbaseStore, type User } from "@/stores/pocketbase";

const { fetchAvatarURL } = usePocketbaseStore();
const props = defineProps<{
  user: User;
}>();
</script>

<template>
  <q-item>
    <q-item-section avatar>
      <q-avatar size="md">
        <q-img
          :src="fetchAvatarURL(user)"
          :ratio="1"
          fit="cover"
          alt="avatar"
        />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ user.name }}</q-item-label>
      <q-item-label>{{ user.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
