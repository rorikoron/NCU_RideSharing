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
import UserCounter from "@/components/UserCounter.vue";

const { fetchParticipant, createParticipant } = usePocketbaseStore();

const $q = useQuasar();
const pb = usePocketbaseStore();
const { getAuthUser, getIsDriver } = useIdentity();
const { refreshProposes } = pb;

const joiningHeadcount = ref("1"); // 用於儲存使用者想要加入的人數
const currentHeadCount = ref(0); // 用於顯示當前參與人數

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
  participant.append("headcount", joiningHeadcount.value); // 使用使用者選擇的人數

  try {
    await createParticipant(participant);
    await refreshProposes();
    await refreshCurrentHeadcount(); // 更新當前參與人數
  } catch (e) {
    console.error(e);
    $q.notify({ message: "加入共乘失敗", position: "bottom-right" });
  }
};

const handleHeadcountChanged = (newHeadcount: string) => {
  joiningHeadcount.value = newHeadcount;
};

const refreshCurrentHeadcount = async () => {
  const participants = await fetchParticipant(props.propose.id);
  currentHeadCount.value = 0;
  participants.forEach((participant: ImmutableParticipant) => {
    currentHeadCount.value += participant.headcount;
  });
};

onMounted(async () => {
  await refreshCurrentHeadcount();
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
    <UserSummary :user="propose.expand?.proponent" />
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
      <UserCounter
        v-model="joiningHeadcount"
        :min="1"
        :max="propose.headcount_limit"
        :headcount-limit="propose.headcount_limit"
        :current-head-count="currentHeadCount"
        @headcount-changed="handleHeadcountChanged"
      />
      <q-chip
        icon="person"
        size="md"
        :color="$q.dark.isActive ? 'active' : 'inactive'"
        square
        class="q-mx-none"
        :ripple="false"
        :label="`${currentHeadCount} / ${propose.headcount_limit}`"
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

    <div v-if="true">
      <q-separator />

      <q-card-actions v-if="getIsDriver()" vertical>
        <q-btn flat label="接單" @click="onAcceptClick(propose.id)" />
      </q-card-actions>

      <q-card-actions vertical>
        <q-btn
          flat
          icon="group_add"
          label="加入共乘"
          @click="onJoinClick(propose.id)"
          :disable="
            getIsDriver() || currentHeadCount >= propose.headcount_limit
          "
        >
          <q-tooltip v-if="getIsDriver()"> 你是駕駛，無法加入共乘 </q-tooltip>
          <q-tooltip v-else-if="currentHeadCount >= propose.headcount_limit">
            人數已滿，無法加入共乘
          </q-tooltip>
        </q-btn>
      </q-card-actions>
    </div>
  </q-card>
</template>
