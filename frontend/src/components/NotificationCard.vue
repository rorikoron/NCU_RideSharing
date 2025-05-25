<script setup lang="ts">
  import { type RecordModel } from 'pocketbase';
  import { computed } from 'vue'

  const props = defineProps<{
    notification:RecordModel;
  }>()

  const bannerClass = computed(() => {
    switch (props.notification.type) {
      case 'positive':
        return 'bg-green-1 text-positive'
      case 'negative':
        return 'bg-red-1 text-negative'
      case 'neutral':
      default:
        return 'bg-grey-2 text-dark'
    }
  })

  const icon = computed(() => {
    switch (props.notification.type) {
      case 'positive':
        return 'fa-solid fa-check'
      case 'negative':
        return 'fa-solid fa-close'
      case 'neutral':
      default:
        return 'fa fa-rss'
    }
  })

  const formatTime = (iso: string) => {
  const dateObj = new Date(iso);
    return `${dateObj.getUTCFullYear()}-${pad(dateObj.getUTCMonth() + 1)}-${pad(dateObj.getUTCDate())} ${pad(dateObj.getUTCHours())}:${pad(dateObj.getUTCMinutes())}`;
  }

  const pad = (num: number) => String(num).padStart(2, '0');
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner
      rounded
      dense
      class="q-mb-sm"
      :class="bannerClass">
      
      <div class="row justify-between items-center">
        <div class="row items-center">
          <q-icon :name="icon" class="q-mr-sm" />
          <span class="text-subtitle2">{{ notification.message }}</span>
        </div>

        <div class="text-caption text-grey-6">
          {{ formatTime(notification.created) }}
        </div>
      </div>

    </q-banner>
  </div>
</template>


<style scoped>
  .q-banner {
    max-width: 600px;
    margin: auto;
  }
</style>