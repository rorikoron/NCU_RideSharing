<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: {
    origin: string
    arrival: string
    date: string
    time: string
  }
}>()

const emit = defineEmits(['update:modelValue', 'filter'])

// replicate props value to local
const localFilter = ref({ ...props.modelValue })

watch(localFilter, (val) => {
  emit('update:modelValue', val)
}, { deep: true })

const onFilter = () => {
  emit('filter', localFilter.value)
}

const onClear = () => {
  localFilter.value = {
    origin: '',
    arrival: '',
    date: '',
    time: ''
  }
  emit('filter', localFilter.value)
}
</script>

<template>
  <q-card class="q-pa-md q-mb-md shadow-2">
    <div class="row q-col-gutter-md items-end">
      <!-- location input -->
      <q-input class="col-3" v-model="localFilter.origin" label="出發地" filled />
      <q-input class="col-3" v-model="localFilter.arrival" label="目的地" filled />

      <!-- date input -->
      <q-input
        class="col-2"
        v-model="localFilter.date"
        label="日期"
        filled
        readonly
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="z-top">
              <q-date v-model="localFilter.date" mask="YYYY-MM-DD">
                <template v-slot:default>
                  <div class="row items-center justify-end q-pa-sm">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </template>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- time input -->
      <q-input
        class="col-2"
        v-model="localFilter.time"
        label="時間"
        filled
        readonly
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="z-top">
              <q-time v-model="localFilter.time" format24h>
                <template v-slot:default>
                  <div class="row items-center justify-end q-pa-sm">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </template>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- buttons -->
      <div class="col-2 row q-gutter-sm">
        <q-btn class="col q-pa-md" label="篩選" color="primary" glossy @click="onFilter" />
        <q-btn class="col q-pa-md" label="清除" color="grey-5" outline @click="onClear" />
      </div>
    </div>
  </q-card>
</template>
