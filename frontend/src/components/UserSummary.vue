<script setup lang="ts">
import { useIdentity } from "@/stores/identity";
import { type User } from "@/stores/pocketbase";

const { fetchAvatarURL } = useIdentity();
defineProps<{
  user: User;
}>();
</script>

<template>
  <q-item>
    <q-item-section avatar>
      <q-avatar size="md">
        <q-img
          :src="fetchAvatarURL(user.id, user.avatar)"
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
