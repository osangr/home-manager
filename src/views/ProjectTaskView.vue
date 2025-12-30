<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "@/stores/taskStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import { useProjectStore } from "@/stores/projectStore";
import TaskCard from "@/components/features/tasks/TaskCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import TaskForm from "@/components/features/tasks/TaskForm.vue";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal.vue";
import type { CreateTask } from "@/types/database";
import { useModal } from "@/composables/useModal";

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const spaceStore = useSpacesStore();
const projectStore = useProjectStore();
const createModal = useModal();
const editModal = useModal();
const deleteModal = useModal();

const projectId = route.params.id as string;

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjectById(projectId),
    spaceStore.fetchSpacesByProject(projectId),
    taskStore.fetchTasksByProject(projectId),
  ]);
});

const project = computed(() => projectStore.currentProject);

// Filtrar tareas del proyecto (a través de sus espacios)
const projectSpaceIds = computed(() =>
  spaceStore.spaces.filter((s) => s.project_id === projectId).map((s) => s.id)
);

const projectTasks = computed(() =>
  taskStore.tasks.filter((t) => projectSpaceIds.value.includes(t.space_id))
);

const pendingTasks = computed(() =>
  projectTasks.value.filter((t) => t.status === "pending")
);

const inProgressTasks = computed(() =>
  projectTasks.value.filter((t) => t.status === "in_progress")
);

const completedTasks = computed(() =>
  projectTasks.value.filter((t) => t.status === "completed")
);

const selectedTask = computed(() =>
  taskStore.tasks.find((t) => t.id === editModal.selectedItemId.value)
);

const selectedTaskToDelete = computed(() =>
  taskStore.tasks.find((t) => t.id === deleteModal.selectedItemId.value)
);

// Para crear tarea, necesitamos un espaceId
// Usamos el primer espacio del proyecto por defecto
const defaultSpaceId = computed(() => projectSpaceIds.value[0] || "");

const handleCreate = async (data: CreateTask) => {
  await taskStore.createTask(data);
  createModal.close();
};

const handleEdit = async (data: CreateTask) => {
  if (!editModal.selectedItemId.value) return;
  await taskStore.updateTask(editModal.selectedItemId.value, data);
  editModal.close();
};

const handleDelete = async () => {
  if (!deleteModal.selectedItemId.value) return;
  await taskStore.deleteTask(deleteModal.selectedItemId.value);
  deleteModal.close();
};
</script>

<template>
  <div class="p-8">
    <!-- Header -->
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
            Todas las tareas de {{ project?.name || "Cargando..." }}
          </h1>
          <p class="text-slate-600 mt-1">
            Vista general de todas las tareas del proyecto
          </p>
        </div>

        <BaseButton
          @click="createModal.open()"
          variant="primary"
          :disabled="!defaultSpaceId"
        >
          + Nueva Tarea
        </BaseButton>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="taskStore.loading" class="text-slate-600">
      Cargando tareas...
    </div>

    <!-- Sin espacios -->
    <div v-else-if="projectSpaceIds.length === 0" class="text-center py-12">
      <p class="text-slate-600 mb-4">
        Este proyecto no tiene espacios todavía.
      </p>
      <p class="text-slate-500 text-sm">
        Crea espacios primero para poder añadir tareas.
      </p>
    </div>

    <!-- Lista vacía (hay espacios pero sin tareas) -->
    <div v-else-if="projectTasks.length === 0" class="text-center py-12">
      <p class="text-slate-600 mb-4">No hay tareas todavía</p>
      <BaseButton @click="createModal.open()" variant="primary">
        Crear primera tarea
      </BaseButton>
    </div>

    <!-- Kanban Board -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Columna Pendientes -->
      <div>
        <h2 class="text-lg font-semibold text-slate-900 mb-4">
          Pendientes ({{ pendingTasks.length }})
        </h2>
        <div class="space-y-3">
          <TaskCard
            v-for="task in pendingTasks"
            :key="task.id"
            :task="task"
            @edit="editModal.open"
            @delete="deleteModal.open"
          />
        </div>
      </div>

      <!-- Columna En Proceso -->
      <div>
        <h2 class="text-lg font-semibold text-slate-900 mb-4">
          En Proceso ({{ inProgressTasks.length }})
        </h2>
        <div class="space-y-3">
          <TaskCard
            v-for="task in inProgressTasks"
            :key="task.id"
            :task="task"
            @edit="editModal.open"
            @delete="deleteModal.open"
          />
        </div>
      </div>

      <!-- Columna Completadas -->
      <div>
        <h2 class="text-lg font-semibold text-slate-900 mb-4">
          Completadas ({{ completedTasks.length }})
        </h2>
        <div class="space-y-3">
          <TaskCard
            v-for="task in completedTasks"
            :key="task.id"
            :task="task"
            @edit="editModal.open"
            @delete="deleteModal.open"
          />
        </div>
      </div>
    </div>

    <!-- Modales -->
    <!-- Modal Crear Tarea -->
    <BaseModal
      :is-open="createModal.isOpen.value"
      title="Nueva Tarea"
      @close="createModal.close()"
    >
      <TaskForm
        v-if="defaultSpaceId"
        :project-id="projectId"
        @submit="handleCreate"
        @cancel="createModal.close()"
      />
      <div v-else class="p-4 text-slate-600">
        No hay espacios disponibles para crear tareas.
      </div>
    </BaseModal>

    <!-- Modal Editar Tarea -->
    <BaseModal
      :is-open="editModal.isOpen.value"
      title="Editar Tarea"
      @close="editModal.close()"
    >
      <TaskForm
        v-if="selectedTask"
        :task="selectedTask"
        :space-id="selectedTask.space_id"
        @submit="handleEdit"
        @cancel="editModal.close()"
      />
    </BaseModal>

    <!-- Modal Eliminar Tarea -->
    <ConfirmDeleteModal
      :is-open="deleteModal.isOpen.value"
      title="Eliminar Tarea"
      :item-name="selectedTaskToDelete?.title"
      @confirm="handleDelete"
      @cancel="deleteModal.close()"
    />
  </div>
</template>
