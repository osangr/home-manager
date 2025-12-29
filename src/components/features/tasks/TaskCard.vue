<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import type { Task } from "@/types/database";
import { computed } from "vue";

interface TaskCardProps {
  task: Task;
}

const props = defineProps<TaskCardProps>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const priorityColor = computed(() => {
  const colors = {
    urgent: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };
  return colors[props.task.priority];
});

const priorityText = computed(() => {
  const texts = {
    urgent: "Urgente",
    high: "Alta",
    medium: "Media",
    low: "Baja",
  };
  return texts[props.task.priority];
});
</script>
<template>
  <BaseCard class="p-4 space-y-3">
    <div class="flex items-center gap-2">
      <span
        :class="[
          priorityColor,
          'text-white text-xs px-2 py-1 rounded inline-block',
        ]"
      >
        {{ priorityText }}
      </span>
    </div>

    <h3 class="font-semibold text-slate-900">
      {{ task.title }}
    </h3>

    <p class="text-sm text-slate-600 line-clamp-2">
      {{ task.description || "Sin descripción" }}
    </p>
    <div class="flex gap-2 pt-2">
      <BaseButton
        size="small"
        variant="secondary"
        @click="emit('edit', task.id)"
      >
        Editar
      </BaseButton>
      <BaseButton
        size="small"
        variant="danger"
        @click="emit('delete', task.id)"
      >
        Eliminar
      </BaseButton>
    </div>
  </BaseCard>
</template>
