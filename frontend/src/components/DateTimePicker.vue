<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const localModelValue = ref(props.modelValue);

// detect change from parent
watch(
  () => props.modelValue,
  (newValue) => {
    localModelValue.value = newValue;
  }
);

// emits binding
const emit = defineEmits(["update:modelValue"]);
watch(localModelValue, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<template>
  <div class="">
    <q-input outlined v-model="localModelValue">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="z-top">
            <q-date v-model="localModelValue" mask="YYYY-MM-DD HH:mm">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="z-top">
            <q-time v-model="localModelValue" mask="YYYY-MM-DD HH:mm" format24h>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
