<script setup lang="ts">
import { onMounted } from "vue";
import { usePocketbaseStore } from "@/stores/pocketbase";
import { useQuasar } from "quasar";
import ProposeCard from "@/components/ProposeCard.vue";
import UserSummary from "@/components/UserSummary.vue";
import OfferForm from "@/components/OfferForm.vue";
import { useIdentity } from "@/stores/identity";

const $q = useQuasar();
const pb = usePocketbaseStore();
const { refreshProposes } = pb;
const { getIsDriver } = useIdentity();

const onAcceptClick = (proposeId: string) => {
  $q.dialog({
    component: OfferForm,
    componentProps: {
      propose: proposeId,
    },
  }).onOk(() => {
    refreshProposes();
    $q.notify({ message: "成功接單", position: "bottom-right" });
  });
};
const onJoinClick = (proposeId: string) => {};
onMounted(async () => {
  console.log(getIsDriver());
  await pb.refreshProposes(getIsDriver());
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

        <q-card-actions v-if="getIsDriver()" vertical>
          <q-btn flat label="接單" @click="onAcceptClick(propose.id)" />
        </q-card-actions>

        <q-card-actions
          v-if="!getIsDriver() && propose.headcount_limit > propose.headcount"
          vertical
        >
          <q-btn
            flat
            icon="group_add"
            label="加入共乘"
            @click="onJoinClick(propose.id)"
          />
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
