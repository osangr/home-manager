<script setup lang="ts">
import { RouterLink } from "vue-router";
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
        class="text-xl font-bold text-slate-900 hover:text-primary transition-colors"
        >🏠 Home Manager</RouterLink
      >
      <nav>
        <ul class="flex gap-3">
          <RouterLink
            to="/"
            class="text-slate-600 hover:text-slate-900 transition-colors"
            active-class="!text-primary !font-medium"
            >Dashboard</RouterLink
          >
        </ul>
      </nav>
    </div>
  </header>
</template>
