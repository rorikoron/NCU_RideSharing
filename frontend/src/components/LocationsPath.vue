<script setup lang="ts">
const props = defineProps({
  locations: {
    type: Array<string>,
    required: true,
  },
});
</script>

<template>
  <div class="column justify-between relative-position">
    <span
      v-for="(location, i) in locations"
      :key="location"
      class="row items-center location"
    >
      <q-avatar
        v-if="i === 0"
        icon="fa-solid fa-person-walking-luggage"
        class="z-top"
        :color="$q.dark.isActive ? 'active' : 'inactive'"
        size="md"
        style="transform: translateX(-50%)"
      />
      <q-avatar
        v-else-if="i === locations.length - 1"
        icon="fa-solid fa-location-dot"
        class="z-top"
        :color="$q.dark.isActive ? 'active' : 'inactive'"
        size="md"
        style="transform: translateX(-50%)"
      />
      <q-avatar
        v-else
        icon="fa-solid"
        class="z-top"
        :color="$q.dark.isActive ? 'active' : 'inactive'"
        size="md"
        style="transform: translateX(-50%)"
      />
      <span>{{ location }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
$line-width: 2px;

.location:first-child::after {
  content: "";
  height: calc(100% - 1lh);
  border-left: $line-width dotted $active;
  position: absolute;
  left: 0;
  top: 0;

  transform: translate(-50%, 0.5lh);
}
</style>
