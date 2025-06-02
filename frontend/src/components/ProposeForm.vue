<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { usePocketbaseStore, type MutablePropose } from "../stores/pocketbase";
import { ref } from "vue";
import DateTimePicker from "./DateTimePicker.vue";
import LocationSelector from "./LocationSelector.vue";
import { useIdentity } from "@/stores/identity";
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { getAuthUser } = useIdentity();
const formPropose = (proposeValue: MutablePropose) => {
  const propose = new FormData();
  Object.entries(proposeValue).forEach(([key, value]) => {
    if (key == "departure") {
      propose.append(key, value + ":00");
    } else {
      propose.append(key, String(value));
    }
  });
  return propose;
};

const formPariticipant = (
  proposeId: string,
  proponent: string,
  headcount: string
) => {
  const participant = new FormData();
  participant.append("propose", proposeId);
  participant.append("participant", proponent);
  participant.append("headcount", headcount);
  participant.append("is_proponent", "true");
  return participant;
};

const createPropose = async () => {
  const { createPropose, createParticipant } = usePocketbaseStore();

  try {
    await createPropose(formPropose(proposeValue.value)).then((res) => {
      createParticipant(
        formPariticipant(res.id, res!.proponent, String(totalHeadcount.value))
      );
    });
    onDialogOK();
  } catch (error) {
    console.log(error);
  }
};

const date = new Date();
const date_timezone_taiwan = new Date(date.getTime() + 8 * 60 * 60 * 1000);
const todayStr = date_timezone_taiwan
  .toISOString()
  .replace(/T/, " ")
  .substring(0, 16);

const proposeValue = ref<MutablePropose>({
  // ATTENTION: here should implement the ID of user
  proponent: getAuthUser()?.id ?? "",
  origin: "",
  arrival: "",
  headcount_limit: 0,
  status: "pending",
  is_commission: false,
  departure: todayStr,
  appendix: "",
});
const totalHeadcount = ref(1);
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="z-top">
    <q-card class="q-px-lg q-py-md">
      <div class="text-h5 text-bold q-py-md">新增共乘提議</div>
      <q-form class="q-gutter-y-md q-py-md form">
        <LocationSelector
          :originModelValue="proposeValue.origin"
          :arrivalModelValue="proposeValue.arrival"
          @update:originModelValue="proposeValue.origin = $event"
          @update:arrivalModelValue="proposeValue.arrival = $event"
        />
        <DateTimePicker v-model="proposeValue.departure" label="出發時間" />
        <div class="row justify-between q-col-gutter-x-sm">
          <q-input
            v-model="totalHeadcount"
            label="人數*"
            class="col"
            type="number"
            :rules="[(val) => !!val || '請填人數']"
            outlined
          />
          <q-input
            v-model="proposeValue.headcount_limit"
            label="上限人數*"
            class="col"
            type="number"
            :rules="[(val) => !!val || '請填上限人數']"
            outlined
          />
        </div>
        <q-toggle
          v-model="proposeValue.is_commission"
          label="是否在本平台找司機"
          color="primary"
          class="q-mt-md"
        />
        <q-input
          v-model="proposeValue.appendix"
          placeholder="打備註..."
          type="textarea"
          outlined
        />

        <div class="row justify-end q-gutter-x-sm">
          <q-btn
            type="submit"
            icon="send"
            color="primary"
            label="送出"
            @click.prevent="createPropose()"
          />
          <q-btn icon="delete" label="取消" @click="onDialogCancel" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
