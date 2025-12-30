<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "@/stores/taskStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import TaskCard from "@/components/features/tasks/TaskCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import TaskForm from "@/components/features/tasks/TaskForm.vue";
import type { CreateTask } from "@/types/database";
import { useModal } from "@/composables/useModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal.vue";

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const spaceStore = useSpacesStore();
const createModal = useModal();
const editModal = useModal();
const deleteModal = useModal();

const projectId = route.params.id as string;
const spaceId = route.params.spaceId as string;

onMounted(async () => {
  await Promise.all([
    spaceStore.fetchSpacesByProject(projectId),
    taskStore.fetchTaskBySpace(spaceId),
  ]);
});

// Computed para obtener el espacio actual
const currentSpace = computed(() =>
  spaceStore.spaces.find((s) => s.id === spaceId)
);

// Computed para filtrar tareas por status
const pendingTasks = computed(() =>
  taskStore.tasks.filter(
    (t) => t.space_id === spaceId && t.status === "pending"
  )
);

const inProgressTasks = computed(() =>
  taskStore.tasks.filter(
    (t) => t.space_id === spaceId && t.status === "in_progress"
  )
);

const completedTasks = computed(() =>
  taskStore.tasks.filter(
    (t) => t.space_id === spaceId && t.status === "completed"
  )
);

const selectedTask = computed(() =>
  taskStore.tasks.find((t) => t.id === editModal.selectedItemId.value)
);

const selectedTaskToDelete = computed(() =>
  taskStore.tasks.find((t) => t.id === deleteModal.selectedItemId.value)
);

// Handlers
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
            Tareas de {{ currentSpace?.name || "Cargando..." }}
          </h1>
          <p class="text-slate-600 mt-1">
            {{ currentSpace?.icon || "📦" }} Organiza tus tareas
          </p>
        </div>

        <BaseButton @click="createModal.open()" variant="primary">
          + Nueva Tarea
        </BaseButton>
      </div>
    </div>

    <!-- 2. Estados (Loading / Vacío / Kanban) -->
    <!-- Loading -->
    <div v-if="taskStore.loading" class="text-slate-600">
      Cargando tareas...
    </div>

    <!-- Lista vacía -->
    <div v-else-if="taskStore.tasks.length === 0" class="text-center py-12">
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

    <!-- 3. Modales -->
    <!-- Modal Crear Tarea -->
    <BaseModal
      :is-open="createModal.isOpen.value"
      title="Nueva Tarea"
      @close="createModal.close()"
    >
      <TaskForm
        :space-id="spaceId"
        @submit="handleCreate"
        @cancel="createModal.close()"
      />
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
        :space-id="spaceId"
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
