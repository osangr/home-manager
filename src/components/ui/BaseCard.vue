<script setup lang="ts">
import { computed } from "vue";

interface BaseCardProps {
  padding?: "small" | "medium" | "large";
  hoverable?: boolean;
}

const props = withDefaults(defineProps<BaseCardProps>(), {
  padding: "medium",
  hoverable: false,
});

const cardClasses = computed(() => {
  const baseClasses = "bg-white rounded-lg shadow-sm border border-slate-200";

  const paddingClasses: Record<string, string> = {
    small: "p-3",
    medium: "p-4",
    large: "p-6",
  };

  return [
    baseClasses,
    paddingClasses[props.padding],
    props.hoverable
      ? "hover:shadow-md transition-shadow duration-200 cursor-pointer"
      : "",
  ].join(" ");
});
</script>
<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<style scoped></style>
