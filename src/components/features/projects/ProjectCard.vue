<template>
  <BaseCard hoverable class="h-full flex flex-col justify-between">
    <div>
      <h3 class="text-lg font-semibold mb-2">{{ project.name }}</h3>
      <p v-if="project.description" class="text-sm text-slate-600 mb-4">
        {{ project.description }}
      </p>
    </div>
    <div class="mt-auto">
      <div class="flex items-center gap-4 text-sm text-slate-600 mb-4">
        <span>💰 {{ formatCurrency(project.total_budget) }}</span>
        <span class="text-slate-300">|</span>
        <span>📐 {{ spacesCount }} espacios</span>
        <span class="text-slate-300">|</span>
        <span>📋 {{ tasksCount }} tareas</span>
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
      <div class="flex justify-between">
        <BaseButton
          size="small"
          @click="emit('view', project.id)"
          variant="primary"
        >
          Ver Proyecto
        </BaseButton>
        <BaseButton
          size="small"
          variant="secondary"
          @click="emit('spaces', project.id)"
        >
          Ver Espacios
        </BaseButton>
        <BaseButton
          size="small"
          variant="secondary"
          @click="emit('tasks', project.id)"
        >
          Ver Tareas
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "../../../types/database";
import BaseCard from "../../ui/BaseCard.vue";
import BaseButton from "../../ui/BaseButton.vue";
import { formatCurrency } from "../../../utils/formatters";

interface ProjectCardProps {
  project: Project;
  tasksCount: number;
  spacesCount: number;
  completedTasks: number;
}

const props = defineProps<ProjectCardProps>();

const emit = defineEmits<{
  view: [id: string];
  spaces: [id: string];
  tasks: [id: string];
}>();

const progressPercentage = computed(() => {
  if (props.tasksCount === 0) return 0;
  return Math.round((props.completedTasks / props.tasksCount) * 100);
});
</script>

<style scoped></style>
