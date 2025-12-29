<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import type {
  CreateTask,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/database";
import { ref, watch } from "vue";

interface TaskFormProps {
  task?: Task;
  spaceId: string;
}

const title = ref("");
const description = ref("");
const priority = ref<TaskPriority>("medium");
const status = ref<TaskStatus>("pending");

const props = defineProps<TaskFormProps>();

const emit = defineEmits<{
  submit: [data: CreateTask];
  cancel: [];
}>();

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title;
      description.value = newTask.description || "";
      priority.value = newTask.priority;
      status.value = newTask.status;
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!title.value.trim()) return;

  emit("submit", {
    title: title.value.trim(),
    description: description.value.trim() || null,
    priority: priority.value,
    status: status.value,
    space_id: props.spaceId,

    // no pedimos por ahora
    category: null,
    professional_id: null,
    estimated_cost: null,
    actual_cost: null,
    estimated_date: null,
    completed_date: null,
  });
};
</script>
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      label="Título de la tarea"
      v-model="title"
      required
      placeholder="Pintar, llamar fontanero..."
    />
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Descripción
      </label>
      <textarea
        v-model="description"
        placeholder="Detalles de la tarea..."
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
        rows="3"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Prioridad
      </label>
      <select
        v-model="priority"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      >
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
        <option value="urgent">Urgente</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Estado
      </label>
      <select
        v-model="status"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      >
        <option value="pending">Pendiente</option>
        <option value="in_progress">En Proceso</option>
        <option value="completed">Completada</option>
      </select>
    </div>

    <div class="flex justify-end gap-2">
      <BaseButton type="button" @click="emit('cancel')" variant="secondary">
        Cancelar
      </BaseButton>
      <BaseButton type="submit" variant="primary"> Guardar </BaseButton>
    </div>
  </form>
</template>
