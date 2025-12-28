<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

interface BaseModalProps {
  isOpen: boolean;
  title?: string;
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<BaseModalProps>(), {
  size: "medium",
});

const sizeClasses = {
  small: "max-w-md",
  medium: "max-w-lg",
  large: "max-w-2xl",
};

const emit = defineEmits<{
  close: [];
}>();

const closeModal = () => {
  emit("close");
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.isOpen) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto"
          :class="sizeClasses[size]"
          @click.stop
        >
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-slate-200"
          >
            <h3 v-if="title" class="text-lg font-semibold text-slate-800">
              {{ title }}
            </h3>
            <button
              @click="closeModal"
              class="text-slate-400 hover:text-slate-600 text-2xl"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <div class="p-6">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-200">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
