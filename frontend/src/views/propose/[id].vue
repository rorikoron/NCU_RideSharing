<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();
</script>
<template>
  <h1>{{ id }}</h1>
</template>
