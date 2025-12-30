<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "@/stores/projectStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import { useTaskStore } from "@/stores/taskStore";
import SpaceCard from "@/components/features/spaces/SpaceCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import SpaceForm from "@/components/features/spaces/SpaceForm.vue";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal.vue";
import type { CreateSpace } from "@/types/database";
import { useModal } from "@/composables/useModal";
import { useProjectStats } from "@/composables/useProjectStats";

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const spaceStore = useSpacesStore();
const taskStore = useTaskStore();
const createModal = useModal();
const editModal = useModal();
const deleteModal = useModal();

const { getSpaceStats } = useProjectStats();

const projectId = route.params.id as string;

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjectById(projectId),
    spaceStore.fetchSpacesByProject(projectId),
    taskStore.fetchTasksByProject(projectId),
  ]);
});

const project = computed(() => projectStore.currentProject);

const selectedSpace = computed(() =>
  spaceStore.spaces.find((space) => space.id === editModal.selectedItemId.value)
);

const selectedSpaceToDelete = computed(() =>
  spaceStore.spaces.find(
    (space) => space.id === deleteModal.selectedItemId.value
  )
);

const handleCreate = async (data: CreateSpace) => {
  await spaceStore.createSpace(data);
  createModal.close();
};

const handleEdit = async (data: CreateSpace) => {
  if (!editModal.selectedItemId.value) return;
  await spaceStore.updateSpace(editModal.selectedItemId.value, data);
  editModal.close();
};

const handleDelete = async () => {
  if (!deleteModal.selectedItemId.value) return;
  await spaceStore.deleteSpace(deleteModal.selectedItemId.value);
  deleteModal.close();
};

const handleViewTasks = (id: string) => {
  router.push(`/project/${projectId}/spaces/${id}/tasks`);
};
</script>

<template>
  <div class="p-8">
    <!-- 1. Header -->
    <div class="mb-8">
      <BaseButton
        variant="ghost"
        size="small"
        @click="router.back()"
        class="mb-4"
      >
        ← Volver
      </BaseButton>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">
            Espacios de {{ project?.name || "Cargando..." }}
          </h1>
          <p v-if="project?.description" class="text-slate-600 mt-1">
            {{ project.description }}
          </p>
        </div>

        <BaseButton @click="createModal.open()" variant="primary">
          + Nuevo Espacio
        </BaseButton>
      </div>
    </div>
    <!-- 2. Estados (Loading / Vacío / Contenido) -->
    <!-- Loading -->
    <div v-if="spaceStore.loading" class="text-slate-600">
      Cargando espacios...
    </div>

    <!-- Lista vacía -->
    <div v-else-if="spaceStore.spaces.length === 0" class="text-center py-12">
      <p class="text-slate-600 mb-4">No hay espacios todavía</p>
      <BaseButton @click="createModal.open()" variant="primary">
        Crear primer espacio
      </BaseButton>
    </div>

    <!-- Grid de espacios -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SpaceCard
        v-for="space in spaceStore.spaces"
        :key="space.id"
        :space="space"
        v-bind="getSpaceStats(space.id)"
        @view="handleViewTasks"
        @edit="editModal.open"
        @delete="deleteModal.open"
      />
    </div>
    <!-- 3. Modales -->
    <!-- Modal Crear Espacio -->
    <BaseModal
      :is-open="createModal.isOpen.value"
      title="Nuevo Espacio"
      @close="createModal.close()"
    >
      <SpaceForm
        :project-id="projectId"
        @submit="handleCreate"
        @cancel="createModal.close()"
      />
    </BaseModal>

    <!-- Modal Editar Espacio -->
    <BaseModal
      :is-open="editModal.isOpen.value"
      title="Editar Espacio"
      @close="editModal.close()"
    >
      <SpaceForm
        v-if="selectedSpace"
        :space="selectedSpace"
        :project-id="projectId"
        @submit="handleEdit"
        @cancel="editModal.close()"
      />
    </BaseModal>

    <!-- Modal Eliminar Espacio -->
    <ConfirmDeleteModal
      :is-open="deleteModal.isOpen.value"
      title="Eliminar Espacio"
      :item-name="selectedSpaceToDelete?.name"
      @confirm="handleDelete"
      @cancel="deleteModal.close()"
    />
  </div>
</template>
