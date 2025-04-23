<script setup lang="ts">
import { type Propose } from "../stores/pocketbase";
import LocationsPath from "../components/LocationsPath.vue";
const props = withDefaults(
  defineProps<{
    propose: Propose;
    bordered?: boolean;
  }>(),
  {
    bordered: true,
  }
);
</script>

<template>
  <q-card class="fit q-pa-xs col" flat :bordered="bordered">
    <slot name="header" />

    <q-card-section class="q-col-gutter-y-md">
      <q-card-section
        class="text-subtitle1 text-bold q-px-sm"
        horizontal
        style="height: 100px"
      >
        <LocationsPath :locations="[propose.origin, propose.arrival]" />
      </q-card-section>
      <div class="q-col-gutter-x-sm">
        <span class="text-body2">
          {{ propose.departure.substring(5, 10).replace(/\-/g, " / ") }}
        </span>
        <span class="text-body2">
          {{ propose.departure.substring(11, 16) }}
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
        :label="propose.headcount"
      />

      <q-chip
        v-if="propose?.appendix"
        size="md"
        class="cursor-pointer"
        :color="$q.dark.isActive ? 'active' : 'inactive'"
        square
        :ripple="false"
        label="#備註"
      >
        <q-tooltip>{{ propose.appendix }}</q-tooltip>
      </q-chip>
    </q-card-section>
    <slot />
  </q-card>
</template>
