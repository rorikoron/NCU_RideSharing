<script setup lang="ts">
const props = defineProps<{
  score: number;
}>();

const ceildScore = Math.round(props.score);
</script>

<template>
  <div class="row items-center q-gutter-sm">
    <q-rating
      :model-value="ceildScore"
      max="5"
      color="yellow"
      icon="star_border"
      size="md"
      icon-selected="star"
      readonly
    />
    <span>{{ score }}</span>
  </div>
</template>
