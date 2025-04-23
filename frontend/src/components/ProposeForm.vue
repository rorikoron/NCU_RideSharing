<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { usePocketbaseStore, type Propose } from "../stores/pocketbase";
import { ref } from "vue";
import DateTimePicker from "./DateTimePicker.vue";
import LocationSelector from "./LocationSelector.vue";
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const createPropose = async () => {
  const formData = new FormData();
  const { createPropose } = usePocketbaseStore();

  Object.entries(formValue.value).forEach(([key, value]) => {
    if (key == "departure") {
      formData.append(key, value + ":00");
    } else {
      formData.append(key, String(value));
    }
  });

  try {
    await createPropose(formData);
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

const formValue = ref<Propose>({
  // ATTENTION: here should implement the ID of user
  proponent: "748lod0038buwzd",
  origin: "",
  arrival: "",
  status: "pending",
  headcount: 1,
  departure: todayStr,
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="z-top">
    <q-card class="q-px-lg q-py-md">
      <div class="text-h5 text-bold q-py-md">新增共乘提議</div>
      <q-form class="q-gutter-y-md q-py-md form">
        <LocationSelector
          :originModelValue="formValue.origin"
          :arrivalModelValue="formValue.arrival"
          @update:originModelValue="formValue.origin = $event"
          @update:arrivalModelValue="formValue.arrival = $event"
        />
        <DateTimePicker v-model="formValue.departure" label="出發時間" />
        <q-input
          v-model="formValue.headcount"
          label="人數*"
          type="number"
          :rules="[(val) => !!val || '請填人數']"
          outlined
        />
        <q-input
          v-model="formValue.appendix"
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
