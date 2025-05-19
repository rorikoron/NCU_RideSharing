<script setup lang="ts">
import { useIdentity } from "@/stores/identity";
import { useNotification} from "@/stores/notification";
import type { RecordModel } from "@/stores/pocketbase";
import { ref, onMounted } from "vue";
import NotificationCard from "@/components/NotificationCard.vue";

const { fetchNotifications } = useNotification();
const { getAuthUser } = useIdentity();
const notifications = ref<RecordModel[]>([]);

onMounted(async () => {
  const { id, created } = getAuthUser()!;
  notifications.value = await fetchNotifications(id, created);
  console.log(await fetchNotifications(id, created));
});

</script>

<template>
  <div class="notification-panel">
    <div class="panel-header">
      <q-icon name="notifications" class="q-mr-sm" />
      <span class="text-h6">通知列表</span>
    </div>

    <div class="notification-scroll-area">
      <NotificationCard
        v-for="n in notifications"
        :key="n.id"
        :notification="n"
      />
    </div>
  </div>
</template>

<style scoped>
.notification-panel {
  max-width: 800px;
  margin: 20px auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 600px; 
}

.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.notification-scroll-area {
  overflow-y: auto;
  padding-right: 8px;
  flex-grow: 1;
}

.notification-scroll-area::-webkit-scrollbar {
  width: 6px;
}
.notification-scroll-area::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
</style>
