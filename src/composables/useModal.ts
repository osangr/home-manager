import { ref } from "vue";

export function useModal() {
  const isOpen = ref(false);
  const selectedItemId = ref<string | null>(null);

  const open = (id?: string) => {
    if (id) selectedItemId.value = id;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    selectedItemId.value = null;
  };

  return {
    isOpen,
    selectedItemId,
    open,
    close,
  };
}
