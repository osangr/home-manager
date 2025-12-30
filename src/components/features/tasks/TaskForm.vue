<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import type {
  CreateTask,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/database";
import { computed, reactive, watch } from "vue";
import { useSpacesStore } from "@/stores/spaceStorage";

interface TaskFormProps {
  task?: Task;
  spaceId?: string;
  projectId?: string;
}

const spaceStore = useSpacesStore();

const props = defineProps<TaskFormProps>();

const emit = defineEmits<{
  submit: [data: CreateTask];
  cancel: [];
}>();

const form = reactive({
  space_id: props.spaceId || props.task?.space_id || "",
  title: props.task?.title || "",
  description: props.task?.description || "",
  priority: (props.task?.priority || "medium") as TaskPriority,
  status: (props.task?.status || "pending") as TaskStatus,
});

const availableSpaces = computed(() => {
  if (!props.projectId) return [];
  return spaceStore.spaces.filter((s) => s.project_id === props.projectId);
});

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      form.title = newTask.title;
      form.description = newTask.description || "";
      form.priority = newTask.priority;
      form.status = newTask.status;
      form.space_id = newTask.space_id;
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!form.title.trim()) return;
  if (!form.space_id && !props.spaceId) return;

  emit("submit", {
    title: form.title.trim(),
    description: form.description.trim() || null,
    priority: form.priority,
    status: form.status,
    space_id: form.space_id || props.spaceId || "",

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
    <div v-if="!props.spaceId" class="mb-4">
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Espacio *
      </label>
      <select
        v-model="form.space_id"
        class="w-full px-3 py-2 border border-slate-300 rounded-lg"
        required
      >
        <option value="" disabled>Selecciona un espacio</option>
        <option
          v-for="space in availableSpaces"
          :key="space.id"
          :value="space.id"
        >
          {{ space.icon }} {{ space.name }}
        </option>
      </select>
    </div>
    <BaseInput
      label="Título de la tarea"
      v-model="form.title"
      required
      placeholder="Pintar, llamar fontanero..."
    />
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Descripción
      </label>
      <textarea
        v-model="form.description"
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
        v-model="form.priority"
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
        v-model="form.status"
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
