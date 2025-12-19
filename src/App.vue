<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "./lib/supabase";
import { RouterView } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  console.log("✅ Usuario:", data.session?.user?.email);
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style scoped></style>
