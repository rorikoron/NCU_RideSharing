<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { usePocketbaseStore, type Offer } from "../stores/pocketbase";
import { ref } from "vue";

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);


const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const createOffer = async () => {
  const formData = new FormData();
  const { createOffer } = usePocketbaseStore();

  Object.entries(formValue.value).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  try {
    await createOffer(formData);
    onDialogOK();
  } catch (error) {
    console.log(error);
  }
}

const formValue = ref<Offer>({
  price: 0,
  appendix: "",
});

</script>

<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent class="z-top">
    <q-card class="q-pa-md">
      <div class="text-h6">提交接單報價</div>

      <q-form class="q-gutter-md q-pt-md">
        <q-input
          v-model.number="formValue.price"
          label="價格 (NT$)"
          type="number"
          :rules="[(val) => val > 0 || '請輸入價格']"
          outlined
        />

        <q-input
          v-model="formValue.appendix"
          label="司機備註"
          type="textarea"
          outlined
        />

        <div class="row justify-end q-pt-sm">
          <q-btn
            label="確認"
            icon="send"
            color="primary"
            @click.prevent="createOffer()"
          />
          <q-btn
            label="取消"
            icon="delete"
            flat
            @click="onDialogCancel"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
