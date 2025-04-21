<script setup lang="ts">
import { onMounted } from "vue";
import { usePocketbaseStore } from "../stores/pocketbase";
import ProposeCard from "../components/ProposeCard.vue";

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
      :proponent="propose"
      :avatarUrl="pb.fetchAvatarURL(propose.expand?.proponent)"
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
