<script setup lang="ts"> 
import { onMounted, ref } from "vue";
import { usePocketbaseStore } from "@/stores/pocketbase";
import { useQuasar } from "quasar";
import { useIdentity } from "@/stores/identity";
import ProposeFilter from "@/components/ProposeFilter.vue";
import ProposeCard from "@/components/ProposeCard.vue";
import ProposeForm from "@/components/ProposeForm.vue";

const $q = useQuasar();
const pb = usePocketbaseStore();
const { getIsDriver } = useIdentity();
const filter = ref({
  origin: '',
  arrival: '',
  date: '',
  time: ''
})

const handleFilter = (filterValue: typeof filter.value) => {
  console.log('執行篩選：', filterValue)
  pb.filterProposes(getIsDriver(), filterValue)
}

const createProposeForm = () => {
  $q.dialog({ component: ProposeForm }).onOk(() => {
    pb.refreshProposes();
    $q.notify({ message: "成功發起提議", position: "bottom-right" });
  });
};

onMounted(async () => {
  await pb.refreshProposes(getIsDriver());
});
</script>

<template>
  <div class="page-container">
    <div class="content-area">
      <!-- filter bar -->
      <div class="filter-bar">
        <ProposeFilter
          v-model="filter"
          @filter="handleFilter"
        />
      </div>

      <!-- propose card -->
      <transition-group name="fade" tag="div" class="proposes">
        <ProposeCard
          v-for="propose in pb.proposes"
          :key="propose.id"
          :propose="propose"
        />
      </transition-group>
    </div>

    <!-- functional button -->
    <div class="floating-actions">
      <q-btn
        round
        v-ripple
        icon="add"
        size="lg"
        color="primary"
        @click="createProposeForm"
      >
        <q-tooltip class="bg-white text-black">新增共乘提議</q-tooltip>
      </q-btn>

      <q-btn round icon="chat" color="secondary" size="lg">
        <q-tooltip class="bg-white text-black">開啟聊天</q-tooltip>
      </q-btn>

      <q-btn round icon="settings" color="secondary" size="lg">
        <q-tooltip class="bg-white text-black">設定</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.content-area {
  flex-grow: 1;
  padding: 20px;
  margin-right: 80px;
  overflow-y: auto;
}

.filter-bar {
  margin-bottom: 16px;
}

.proposes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.floating-actions {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
}

/* animate  */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
