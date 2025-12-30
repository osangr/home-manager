<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  const result = await authStore.signIn(email.value, password.value);

  if (result.success) {
    router.push("/");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">🏠 Home Manager</h1>
        <p class="text-slate-600">Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput label="Email" v-model="email" type="email" required />

        <BaseInput
          label="Contraseña"
          v-model="password"
          type="password"
          required
        />

        <div
          v-if="authStore.error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ authStore.error }}</p>
        </div>

        <BaseButton
          variant="primary"
          type="submit"
          :disabled="authStore.loading"
          class="w-full"
        >
          {{ authStore.loading ? "Cargando..." : "Iniciar sesión" }}
        </BaseButton>
      </form>

      <p class="text-center text-sm text-slate-600 mt-6">
        ¿No tienes cuenta?
        <a href="#" class="text-primary font-medium">Regístrate</a>
      </p>
    </div>
  </div>
</template>
