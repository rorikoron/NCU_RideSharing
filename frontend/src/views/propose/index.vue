<script setup lang="ts">
import { onMounted } from "vue";
import { usePocketbaseStore } from "@/stores/pocketbase";
import { useQuasar } from "quasar";
import ProposeCard from "@/components/ProposeCard.vue";
import UserSummary from "@/components/UserSummary.vue";
import OfferForm from "@/components/OfferForm.vue";

const $q = useQuasar();
const pb = usePocketbaseStore();
const { refreshProposes } = pb;

const onAcceptClick = () => {
  $q.dialog({ component: OfferForm }).onOk(() => {
    refreshProposes(); 
    $q.notify({ message: "成功接單", position: "bottom-right" });
  });
};

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
          <q-btn flat label="接單" @click="onAcceptClick" />
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
