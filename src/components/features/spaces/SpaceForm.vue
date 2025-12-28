<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import type { CreateSpace, Space } from "@/types/database";
import { ref, watch } from "vue";

interface SpaceFormProps {
  space?: Space;
  projectId: string;
}

const name = ref<string>("");
const icon = ref<string>("");

const props = defineProps<SpaceFormProps>();

const emit = defineEmits<{
  submit: [data: CreateSpace];
  cancel: [];
}>();

watch(
  () => props.space,
  (newSpace) => {
    if (newSpace) {
      name.value = newSpace.name;
      icon.value = newSpace.icon || "";
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!name.value.trim()) {
    return;
  }
  emit("submit", {
    name: name.value.trim(),
    icon: icon.value.trim() || null,
    project_id: props.projectId,
  });
};
</script>
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      label="Nombre del Espacio"
      v-model="name"
      required
      placeholder="Salón, baño, despacho..."
    />
    <BaseInput label="Icono" v-model="icon" />
    <div class="flex justify-end gap-4">
      <BaseButton type="button" @click="emit('cancel')" variant="secondary">
        Cancelar
      </BaseButton>
      <BaseButton type="submit" variant="primary" placeholder="🍳">
        Guardar
      </BaseButton>
    </div>
  </form>
</template>
