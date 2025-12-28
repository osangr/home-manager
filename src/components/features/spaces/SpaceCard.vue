<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import type { Space } from "@/types/database";
import { computed } from "vue";

interface SpaceCardProps {
  space: Space;
  tasksCount: number;
  completedTasks: number;
}

const props = defineProps<SpaceCardProps>();

const emit = defineEmits<{
  view: [id: string];
  edit: [id: string];
  delete: [id: string];
}>();

const progressPercentage = computed(() => {
  if (props.tasksCount === 0) return 0;
  return Math.round((props.completedTasks / props.tasksCount) * 100);
});
</script>
<template>
  <BaseCard hoverable class="h-full flex flex-col justify-between">
    <div class="mt-auto">
      <div class="text-center mb-4">
        <p class="text-5xl mb-2">{{ space.icon || "📦" }}</p>
        <h3 class="text-lg font-semibold text-slate-900">{{ space.name }}</h3>
      </div>
      <div class="text-sm text-slate-600 mb-4 text-center">
        <p>{{ tasksCount }} tareas</p>
        <p>{{ completedTasks }} completadas</p>
      </div>
      <div class="space-y-1 mb-4">
        <div class="w-full bg-slate-200 rounded-full h-2">
          <div
            class="bg-primary h-2 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p class="text-xs text-slate-600 text-right">
          {{ progressPercentage }}% completado
        </p>
      </div>
      <div class="flex flex-col gap-2 mt-auto">
        <BaseButton
          size="small"
          @click="emit('view', space.id)"
          variant="primary"
        >
          Ver tareas
        </BaseButton>

        <div class="flex gap-2">
          <BaseButton
            size="small"
            variant="secondary"
            @click="emit('edit', space.id)"
            class="flex-1"
          >
            Editar
          </BaseButton>
          <BaseButton
            size="small"
            variant="danger"
            @click="emit('delete', space.id)"
            class="flex-1"
          >
            Eliminar
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped></style>
