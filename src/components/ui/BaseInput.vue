<script setup lang="ts">
import { computed } from "vue";

interface BaseInputProps {
  modelValue: string | number;
  type?: "text" | "password" | "email" | "number" | "tel";
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: "text",
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  const value = props.type === "number" ? Number(target.value) : target.value;

  emit("update:modelValue", value);
};

const inputClasses = computed(() => {
  const baseClasses =
    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors";

  const errorClasses = props.error
    ? "border-red-500 focus:ring-red-500"
    : "border-slate-300 focus:ring-primary";

  const disabledClasses = props.disabled
    ? "bg-slate-100 cursor-not-allowed"
    : "bg-white";

  return [baseClasses, errorClasses, disabledClasses].join(" ");
});
</script>
<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-slate-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="handleInput"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<style scoped></style>
