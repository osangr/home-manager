<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";

interface ProjectStatCardProps {
  icon: string;
  label: string;
  subtitle?: string;
  to?: string;
  value: number | string;
}

const props = defineProps<ProjectStatCardProps>();
</script>

<template>
  <!-- Si tiene 'to', envuelve en RouterLink -->
  <RouterLink v-if="to" :to="to" class="block">
    <BaseCard hoverable>
      <div class="text-center">
        <p class="text-4xl mb-2">{{ icon }}</p>
        <p class="text-sm text-slate-600 mb-1">{{ label }}</p>
        <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-slate-500 mt-1">
          {{ subtitle }}
        </p>
      </div>
    </BaseCard>
  </RouterLink>

  <!-- Si NO tiene 'to', solo muestra la card -->
  <BaseCard v-else>
    <div class="text-center">
      <p class="text-4xl mb-2">{{ icon }}</p>
      <p class="text-sm text-slate-600 mb-1">{{ label }}</p>
      <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
      <p v-if="subtitle" class="text-xs text-slate-500 mt-1">
        {{ subtitle }}
      </p>
    </div>
  </BaseCard>
</template>
