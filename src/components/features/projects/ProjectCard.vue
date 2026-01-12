<template>
  <BaseCard
    hoverable
    class="h-full flex flex-col justify-between"
    @click="handleClick"
  >
    <div>
      <h3 class="text-lg font-semibold mb-1">{{ project.name }}</h3>
      <p v-if="project.description" class="text-sm text-slate-600 mb-4">
        {{ project.description }}
      </p>
    </div>
    <div class="mt-auto">
      <div
        class="flex items-center justify-around gap-2 text-sm text-slate-600 mb-4"
      >
        <p class="flex flex-col items-center">
          <span>💰</span> {{ formatCurrency(project.total_budget) }}
        </p>
        <span class="text-slate-300">|</span>
        <p class="flex flex-col items-center">
          <span>📐</span> {{ spacesCount }} espacios
        </p>
        <span class="text-slate-300">|</span>
        <p class="flex flex-col items-center">
          <span>📋</span> {{ tasksCount }} tareas
        </p>
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
      <div
        class="flex lg:justify-between flex-col lg:flex-row gap-2"
        @click.stop
      >
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
import type { Project } from "@/types/database";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { formatCurrency } from "@/utils/formatters";

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

const handleClick = () => {
  emit("view", props.project.id);
};
</script>

<style scoped></style>
