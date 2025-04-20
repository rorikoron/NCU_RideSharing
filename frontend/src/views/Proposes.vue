<script setup lang="ts">
import { onMounted } from "vue";
import { usePocketbaseStore } from "../stores/pocketbase";
import LocationsPath from "../components/LocationsPath.vue";

const pb = usePocketbaseStore();

onMounted(async () => {
  await pb.refreshProposes();
  console.log(pb.proposes[0].expand?.proponent);
});
</script>

<template>
  <div class="proposes">
    <q-card
      v-for="proponent in pb.proposes"
      :key="proponent.id"
      class="fit q-pa-xs"
      flat
      bordered
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar size="md">
            <q-img
              :src="pb.fetchAvatarURL(proponent.expand?.proponent)"
              :ratio="1"
              fit="cover"
              alt="avatar"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ proponent.expand?.proponent.name }}</q-item-label>
          <q-item-label>{{ proponent.expand?.proponent.name }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />

      <q-card-section class="q-col-gutter-y-md">
        <q-card-section
          class="text-subtitle1 text-bold q-px-sm"
          horizontal
          style="height: 100px"
        >
          <LocationsPath :locations="[proponent.origin, proponent.arrival]" />
        </q-card-section>
        <div class="q-col-gutter-x-sm">
          <span class="text-body2">
            {{ proponent.departure.substring(5, 10).replace(/\-/g, " / ") }}
          </span>
          <span class="text-body2">
            {{ proponent.departure.substring(11, 16) }}
          </span>
        </div>
      </q-card-section>

      <q-card-section>
        <q-chip
          icon="person"
          size="md"
          :color="$q.dark.isActive ? 'active' : 'inactive'"
          square
          class="q-mx-none"
          :ripple="false"
          :label="proponent.headcount"
        />

        <q-chip
          v-if="proponent?.appendix"
          size="md"
          class="cursor-pointer"
          :color="$q.dark.isActive ? 'active' : 'inactive'"
          square
          :ripple="false"
          label="#備註"
        >
          <q-tooltip>{{ proponent.appendix }}</q-tooltip>
        </q-chip>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn flat label="接單" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.proposes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
</style>
