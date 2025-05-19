<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string; // 接收當前人數 (字串)
  min?: number;
  max?: number;
  step?: number;
  headcountLimit: number; // 接收最大人數限制
  currentHeadCount: number; // 接收目前參與人數
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void; // 更新顯示用
  (e: "headcount-changed", value: string): void; // 通知父組件人數變更
}>();

const min = props.min ?? 1; // 假設加入人數最少是 1
const max = props.max ?? Infinity;
const step = props.step ?? 1;
const value = computed(() => props.modelValue);

const isIncreaseDisabled = computed(() => {
  const currentValue = Number(props.modelValue);
  return currentValue + step > props.headcountLimit - props.currentHeadCount;
});

function increase() {
  const currentValue = Number(props.modelValue);
  const next = currentValue + step;
  if (next <= max) {
    emit("update:modelValue", String(next));
    emit("headcount-changed", String(next)); // 發出人數變更事件
  }
}

function decrease() {
  const currentValue = Number(props.modelValue);
  const next = currentValue - step;
  if (next >= min) {
    emit("update:modelValue", String(next));
    emit("headcount-changed", String(next)); // 發出人數變更事件
  }
}

function updateValue(newVal: string) {
  const n = Number(newVal);
  if (!isNaN(n) && n >= min && n <= max) {
    emit("update:modelValue", newVal);
    emit("headcount-changed", newVal); // 發出人數變更事件
  }
}
</script>

<template>
  <div class="stepper">
    <button id="minus" @click="decrease" :disabled="Number(value) <= min">
      -
    </button>
    <input
      type="number"
      :value="value"
      @input="updateValue($event.target.value)"
      :min="min"
      :max="max"
    />
    <button id="plus" @click="increase" :disabled="isIncreaseDisabled">
      +
    </button>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border: none;
  border-radius: 0.3rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

button {
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border: none; /* 移除按鈕自身的邊框 */
  background-color: #f0f0f0;
  color: #333;
  transition: background-color 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center; /* 垂直置中 */
  justify-content: center; /* 水平置中 */
}
#minus {
  border: 1px solid #ccc; /* 為左邊按鈕添加邊框 */
  border-radius: 50% 0 0 50%;
}
#plus {
  border: 1px solid #ccc; /* 為右邊按鈕添加邊框 */
  border-radius: 0 50% 50% 0;
}
button:hover {
  background-color: #ddd;
}

button:active {
  background-color: #ccc;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 0.15rem rgba(0, 123, 255, 0.25);
}

button:disabled {
  background-color: #eee;
  color: #999;
  cursor: not-allowed;
}

input {
  width: 3rem;
  height: 2.2rem;
  padding: 0.25rem;
  text-align: center;
  border-top: 1px solid #ccc; /* 上邊框 */
  border-bottom: 1px solid #ccc; /* 下邊框 */
  border-left: none; /* 移除左邊框，與左邊按鈕連接 */
  border-right: none; /* 移除右邊框，與右邊按鈕連接 */
  font-size: 0.85rem;
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.15rem rgba(0, 123, 255, 0.25);
}
</style>
