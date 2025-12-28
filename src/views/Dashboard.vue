<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import ProjectCard from "@/components/features/projects/ProjectCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import ProjectForm from "@/components/features/projects/ProjectForm.vue";
import type { CreateProject } from "@/types/database";

const isModalOpen = ref(false);

const projectStore = useProjectStore();
const router = useRouter();

onMounted(async () => {
  await projectStore.fetchProjects();
});

const handleView = (id: string) => {
  router.push(`/project/${id}`);
};

const handleSpaces = (id: string) => {
  router.push(`/project/${id}/spaces`);
};

const handleTasks = (id: string) => {
  router.push(`/project/${id}/tasks`);
};

const handleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const handleProjectCreated = async (data: CreateProject) => {
  console.log("Proyecto creado", data);

  await projectStore.createProject(data);
  handleModal();
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-semibold mb-3">Dashboard</h1>
    <div v-if="projectStore.loading">Cargando proyectos...</div>
    <div v-else-if="projectStore.projects.length === 0">
      No tienes proyectos todavía.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard
        v-for="project in projectStore.projects"
        :key="project.id"
        :project="project"
        :spaces-count="5"
        :tasks-count="15"
        :completed-tasks="9"
        @view="handleView"
        @spaces="handleSpaces"
        @tasks="handleTasks"
      />
    </div>
  </div>
  <BaseButton class="mt-6" @click="handleModal" variant="primary">
    Crear Nuevo Proyecto
  </BaseButton>
  <BaseModal
    :is-open="isModalOpen"
    title="Crear Nuevo Proyecto"
    size="medium"
    @close="handleModal"
  >
    <ProjectForm @submit="handleProjectCreated" @cancel="handleModal" />
  </BaseModal>
</template>
