<script setup lang="ts">
import { useQuasar } from "quasar";
import { ref, watch } from "vue";

const props = defineProps({
  originModelValue: {
    type: String,
    required: true,
  },
  arrivalModelValue: {
    type: String,
    required: true,
  },
});
const $q = useQuasar();

const localOriginModelValue = ref<string>(props.originModelValue);
const localArrivalModelValue = ref<string>(props.arrivalModelValue);

const locationIsHover = ref({
  origin: false,
  arrival: false,
});
const locationIsFocus = ref({
  origin: false,
  arrival: false,
});

const getClassName = (location: "origin" | "arrival") => {
  if (locationIsFocus.value[location]) return "focus";
  else if (locationIsHover.value[location])
    return $q.dark.isActive ? "hover-dark" : "hover";
  else return $q.dark.isActive ? "idle-dark" : "idle";
};

watch(
  () => props.originModelValue,
  (newValue) => {
    localOriginModelValue.value = newValue;
  }
);

watch(
  () => props.arrivalModelValue,
  (newValue) => {
    localArrivalModelValue.value = newValue;
  }
);

// emits binding
const emit = defineEmits([
  "update:originModelValue",
  "update:arrivalModelValue",
]);
watch(localOriginModelValue, (newValue) => {
  emit("update:originModelValue", newValue);
});
watch(localArrivalModelValue, (newValue) => {
  emit("update:arrivalModelValue", newValue);
});
</script>

<template>
  <div class="row locations">
    <span
      class="col"
      @mouseenter="locationIsHover.origin = true"
      @mouseleave="locationIsHover.origin = false"
    >
      <q-input
        v-model="localOriginModelValue"
        @focus="locationIsFocus.origin = true"
        @blur="locationIsFocus.origin = false"
        placeholder="搭乘地點*"
        color="primary"
        input-style="padding: 20px"
        outlined
      />
    </span>
    <div
      class="arrow-container z-top no-pointer-events"
      :style="`background-color: ${
        $q.dark.isActive ? 'var(--q-dark)' : 'white'
      }`"
    >
      <div
        :class="`arrow z-max
            ${'arrow-left-' + getClassName('origin')} 
            ${'arrow-right-' + getClassName('arrival')}`"
      />
      <q-icon
        name="swap_horiz"
        size="sm"
        :class="`arrow-inner q-pa-xs
            ${'arrow-left-inner-' + getClassName('origin')} 
            ${'arrow-right-inner-' + getClassName('arrival')}`"
        :text-color="$q.dark.isActive ? 'white' : 'dark'"
      />
    </div>

    <span
      class="col"
      @mouseenter="locationIsHover.arrival = true"
      @mouseleave="locationIsHover.arrival = false"
    >
      <q-input
        v-model="localArrivalModelValue"
        @focus="locationIsFocus.arrival = true"
        @blur="locationIsFocus.arrival = false"
        placeholder="下車地點*"
        color="primary"
        class="arrival"
        input-style="padding: 20px"
        outlined
      />
    </span>
  </div>
</template>

<style lang="scss" scoped>
// matches the padding used for the icon
// currently set as q-pa-sm, so use 16 * 0.5 = 8px
$input_gap: 4px;
$icon_offset: 8px;
$icon_size: 24px;
$left_limit: calc(($icon_size - $input_gap + 1.5px) * 0.5 / $icon_size * 100%);
$left_inner_limit: calc(
  ($icon_size - $input_gap - 0.5px) * 0.5 / $icon_size * 100%
);
$right_limit: calc(
  100% - ($icon_size - $input_gap + 0.5px) * 0.5 / $icon_size * 100%
);
$right_inner_limit: calc(
  100% - ($icon_size - $input_gap - 0.5px) * 0.5 / $icon_size * 100%
);

.locations {
  position: relative;
  gap: $input_gap;

  .arrow-container {
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 100%;
    width: fit-content;
    aspect-ratio: 1 / 1;
    transform: translate(-50%, -50%);
  }
  .arrow {
    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      border-radius: 100%;
      border-width: 1px;
      border-style: solid;
      transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::before {
      clip-path: polygon(-100% 0, $left_limit 0, $left_limit 200%, -100% 200%);
    }
    &::after {
      clip-path: polygon(
        $right_limit -100%,
        100% -100%,
        100% 200%,
        $right_limit 200%
      );
    }

    &.arrow-left-idle::before {
      border-color: rgba(0, 0, 0, 0.24);
    }
    &.arrow-left-idle-dark::before {
      border-color: rgba(255, 255, 255, 0.6);
    }
    &.arrow-left-hover::before {
      border-color: #000;
    }
    &.arrow-left-hover-dark::before {
      border-color: #fff;
    }
    &.arrow-left-focus::before {
      border-color: transparent;
    }

    &.arrow-right-idle::after {
      border-color: rgba(0, 0, 0, 0.24);
    }
    &.arrow-right-idle-dark::after {
      border-color: rgba(255, 255, 255, 0.6);
    }
    &.arrow-right-hover::after {
      border-color: #000;
    }
    &.arrow-right-hover-dark::after {
      border-color: #fff;
    }
    &.arrow-right-focus::after {
      border-color: transparent;
    }
  }
  .arrow-inner {
    position: relative;
    &::before,
    &::after {
      visibility: hidden;
      opacity: 0;
      content: "";
      position: absolute;
      top: -0.5px;
      left: 0px;
      width: calc(100%);
      height: calc(100% + -1.5px);

      border-radius: 100%;
      border-width: 2px;
      border-style: solid;
      border-color: $primary;
      transition: all 0.36s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::before {
      clip-path: polygon(
        -100% 0,
        $left_inner_limit 0,
        $left_inner_limit 200%,
        -100% 200%
      );
    }
    &::after {
      left: -2.5px;
      clip-path: polygon(
        $right_inner_limit -100%,
        100% -100%,
        100% 200%,
        $right_inner_limit 200%
      );
    }
    &.arrow-left-inner-focus::before {
      visibility: visible;
      opacity: 100%;
    }
    &.arrow-right-inner-focus::after {
      visibility: visible;
      opacity: 100%;
    }
  }
}
</style>
