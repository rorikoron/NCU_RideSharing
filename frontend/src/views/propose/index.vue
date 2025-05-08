<script setup lang="ts">
import { onMounted } from "vue";
import { usePocketbaseStore } from "@/stores/pocketbase";
import { useQuasar } from "quasar";
import ProposeCard from "@/components/ProposeCard.vue";
import { useIdentity } from "@/stores/identity";

const pb = usePocketbaseStore();
const { getIsDriver } = useIdentity();

onMounted(async () => {
  await pb.refreshProposes(getIsDriver());
});
</script>

<template>
  <div class="proposes">
    <ProposeCard
      v-for="propose in pb.proposes"
      :key="propose.id"
      :propose="propose"
    />
  </div>
</template>

<style lang="scss" scoped>
.proposes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
</style>
