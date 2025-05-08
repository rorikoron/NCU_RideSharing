<script setup lang="ts">
import {
  usePocketbaseStore,
  type ImmutableParticipant,
  type ImmutablePropose,
} from "../stores/pocketbase";
import LocationsPath from "../components/LocationsPath.vue";
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import OfferForm from "@/components/OfferForm.vue";
import { useIdentity } from "@/stores/identity";
import UserSummary from "@/components/UserSummary.vue";
const { fetchParticipant } = usePocketbaseStore();

const $q = useQuasar();
const pb = usePocketbaseStore();
const { getAuthUser, getIsDriver } = useIdentity();
const { refreshProposes } = pb;

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
const onJoinClick = async (proposeId: string) => {
  let participant = new FormData();
  participant.append("propose", proposeId);
  participant.append("participant", getAuthUser()!.id);
  participant.append("headcount", "1");

  try {
    await pb.createParticipant(participant);
    await refreshProposes();
  } catch (e) {
    console.error(e);
    $q.notify({ message: "加入共乘失敗", position: "bottom-right" });
  }
};

const totalHeadCount = ref(0);
onMounted(async () => {
  const participants = await fetchParticipant(props.propose.id);
  console.log(participants);
  participants.forEach((participant: ImmutableParticipant) => {
    totalHeadCount.value += participant.headcount;
  });
});
const props = withDefaults(
  defineProps<{
    propose: ImmutablePropose;
    participant?: number;
    bordered?: boolean;
  }>(),
  {
    bordered: true,
  }
);
</script>

<template>
  <q-card class="fit q-pa-xs col" flat :bordered="bordered">
    <!-- make as new component (ProposeDetail?)-->

    <UserSummary :user="propose.expand!.proponent" />
    <q-separator />

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
        :label="`${totalHeadCount} / ${propose.headcount_limit}`"
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

    <!-- Actions -->

    <div v-if="true">
      <q-separator />

      <q-card-actions v-if="getIsDriver()" vertical>
        <q-btn flat label="接單" @click="onAcceptClick(propose.id)" />
      </q-card-actions>

      <q-card-actions
        v-if="!getIsDriver() && propose.headcount_limit > totalHeadCount"
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
  </q-card>
</template>
