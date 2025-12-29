<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseModal from "./BaseModal.vue";

interface ConfirmModalProps {
  isOpen: boolean;
  itemName?: string;
  title?: string;
  message?: string;
}

const props = withDefaults(defineProps<ConfirmModalProps>(), {
  isOpen: false,
  title: "Eliminar",
  itemName: "",
  message: "",
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const handleConfirm = () => {
  emit("confirm");
};
const handleCancel = () => {
  emit("cancel");
};

const displayMessage = computed(() => {
  if (props.message) return props.message;
  return "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.";
});
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="title"
    size="small"
    @close="handleCancel"
  >
    <div class="p-4">
      <p class="mb-4 text-slate-600">
        <span v-if="itemName">
          ¿Estás seguro de que deseas eliminar <strong>{{ itemName }}</strong
          >?
        </span>
        <span v-else>
          {{ displayMessage }}
        </span>
        <br />
        Esta acción no se puede deshacer.
      </p>
      <div class="flex justify-end gap-2">
        <BaseButton variant="secondary" @click="handleCancel">
          Cancelar
        </BaseButton>
        <BaseButton variant="danger" @click="handleConfirm">
          Eliminar
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
