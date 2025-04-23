<script setup lang="ts">
import { onMounted } from "vue";
import { usePocketbaseStore } from "@/stores/pocketbase";
import ProposeCard from "@/components/ProposeCard.vue";
import UserSummary from "@/components/UserSummary.vue";

const pb = usePocketbaseStore();

onMounted(async () => {
  await pb.refreshProposes();
  console.log(pb.proposes[0].expand?.proponent);
});
</script>

<template>
  <div class="proposes">
    <ProposeCard
      v-for="propose in pb.proposes"
      :key="propose.id"
      :propose="propose"
    >
      <template #header>
        <UserSummary :user="propose.expand!.proponent" />
        <q-separator />
      </template>
      <!-- here should replace with authUser.is_driver -->
      <div v-if="true">
        <q-separator />

        <q-card-actions vertical>
          <q-btn flat label="接單" />
        </q-card-actions>
      </div>
    </ProposeCard>
  </div>
</template>

<style lang="scss" scoped>
.proposes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
</style>
