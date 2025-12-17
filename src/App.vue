<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "./lib/supabase";
import { RouterView } from "vue-router";

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  console.log("✅ Usuario:", data.session?.user?.email);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <h1 class="text-4xl font-bold text-primary mb-2">Home Manager</h1>
    <RouterView />
  </div>
</template>

<style scoped></style>
