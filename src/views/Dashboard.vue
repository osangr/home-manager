<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import { useTaskStore } from "@/stores/taskStore";
import ProjectCard from "@/components/features/projects/ProjectCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import ProjectForm from "@/components/features/projects/ProjectForm.vue";
import type { CreateProject } from "@/types/database";
import { useProjectStats } from "@/composables/useProjectStats";

const isModalOpen = ref(false);

const projectStore = useProjectStore();
const spaceStore = useSpacesStore();
const taskStore = useTaskStore();
const router = useRouter();
const { getProjectStats } = useProjectStats();

onMounted(async () => {
  await projectStore.fetchProjects();

  const projectIds = projectStore.projects.map((p) => p.id);

  await Promise.all(
    projectIds.map(async (id) => {
      await spaceStore.fetchSpacesByProject(id);
      await taskStore.fetchTasksByProject(id);
    })
  );
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
        v-bind="getProjectStats(project.id)"
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
