<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import type { CreateProject, Project } from "@/types/database";
import { ref, watch } from "vue";

interface ProjectFormProps {
  project?: Project;
}

const name = ref<string>("");
const description = ref<string>("");
const totalBudget = ref<number>(0);

const props = defineProps<ProjectFormProps>();

const emit = defineEmits<{
  submit: [data: CreateProject];
  cancel: [];
}>();

watch(
  () => props.project,
  (newProject) => {
    if (newProject) {
      name.value = newProject.name;
      description.value = newProject.description || "";
      totalBudget.value = newProject.total_budget || 0;
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!name.value.trim() || totalBudget.value <= 0) {
    return;
  }
  emit("submit", {
    name: name.value.trim(),
    description: description.value.trim(),
    total_budget: totalBudget.value,
  });
};
</script>
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput label="Nombre del Proyecto" v-model="name" required />
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Descripción
      </label>
      <textarea
        v-model="description"
        placeholder="Descripción del Proyecto"
        class="w-full px-2 py-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        rows="4"
      ></textarea>
    </div>
    <BaseInput
      label="Presupuesto Total"
      v-model.number="totalBudget"
      type="number"
      min="0"
    />
    <div class="flex justify-end gap-4">
      <BaseButton type="button" @click="emit('cancel')" variant="secondary">
        Cancelar
      </BaseButton>
      <BaseButton type="submit" variant="primary"> Guardar </BaseButton>
    </div>
  </form>
</template>
