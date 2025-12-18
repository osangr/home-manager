<template>
  <div class="space-y-8">
    <!-- Prueba de Buttons -->
    <BaseCard>
      <h2 class="text-xl font-semibold mb-4">Botones</h2>

      <div class="flex flex-wrap gap-4">
        <BaseButton variant="primary">Primary</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="danger">Danger</BaseButton>
        <BaseButton variant="ghost">Ghost</BaseButton>
      </div>
    </BaseCard>

    <!-- Prueba de Inputs -->
    <BaseCard>
      <h2 class="text-xl font-semibold mb-4">Inputs</h2>

      <div class="space-y-4">
        <BaseInput
          v-model="name"
          label="Nombre"
          placeholder="Tu nombre"
          required
        />

        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="tu@email.com"
          required
          :error="emailError"
          @update:modelValue="validateEmail"
        />

        <BaseInput v-model="age" label="Edad" type="number" placeholder="0" />

        <BaseInput
          modelValue="Campo deshabilitado"
          label="Campo deshabilitado"
          disabled
        />
      </div>
    </BaseCard>

    <!-- Prueba de Cards -->
    <BaseCard>
      <h2 class="text-xl font-semibold mb-4">Cards</h2>

      <div class="space-y-4">
        <BaseCard padding="small">
          <p>Contenido de la card</p>
        </BaseCard>

        <BaseCard padding="medium">
          <p>Contenido de la card</p>
        </BaseCard>
        <BaseCard padding="large">
          <p>Contenido de la card</p>
        </BaseCard>

        <BaseCard padding="large" hoverable>
          <p>Contenido de la card con hover</p>
        </BaseCard>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../components/ui/BaseInput.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import { ref } from "vue";

const name = ref("");
const email = ref("");
const age = ref(0);
const emailError = ref("Email inválido.");

const validateEmail = () => {
  if (email.value && !email.value.includes("@")) {
    emailError.value = "Email inválido";
  } else {
    emailError.value = "";
  }
};
</script>

<style lang="scss" scoped></style>
