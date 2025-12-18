<script setup lang="ts">
import { computed } from "vue";

interface Props {
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit" | "reset";
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: "primary",
  type: "button",
  size: "medium",
});

const buttonClasses = computed(() => {
  const baseClasses =
    "font-semibold rounded-[3px] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  const variantClasses: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-primary",
    secondary:
      "bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
  };

  const sizeClasses: Record<string, string> = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-5 py-3 text-lg",
  };

  return [
    baseClasses,
    variantClasses[props.variant || "primary"],
    sizeClasses[props.size || "medium"],
    props.disabled ? "opacity-50 cursor-not-allowed" : "",
  ].join(" ");
});
</script>

<template>
  <button :disabled="disabled" :type="type" :class="buttonClasses">
    <slot />
  </button>
</template>

<style scoped></style>
