<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { RouterLink, useRouter } from "vue-router";
import BaseButton from "../ui/BaseButton.vue";

const authStore = useAuthStore();
const router = useRouter();
const handleLogout = async () => {
  await authStore.signOut();
  router.push("/login");
};
</script>

<template>
  <header
    class="bg-white border-b border-slate-200 h-16 flex sticky top-0 z-10 items-center"
  >
    <div
      class="container mx-auto h-full flex items-center justify-between px-6"
    >
      <RouterLink
        to="/"
        class="text-lg font-bold text-slate-900 hover:text-primary transition-colors flex flex-col items-center"
      >
        <span>🏠</span> Home Manager</RouterLink
      >
      <nav class="flex items-center gap-10">
        <ul>
          <BaseButton variant="secondary" @click="handleLogout">
            Cerrar sesión
          </BaseButton>
        </ul>
      </nav>
    </div>
  </header>
</template>
