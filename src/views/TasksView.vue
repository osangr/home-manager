<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "@/stores/taskStore";
import { useSpacesStore } from "@/stores/spaceStorage";
import TaskCard from "@/components/features/tasks/TaskCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import TaskForm from "@/components/features/tasks/TaskForm.vue";
import type { CreateTask } from "@/types/database";

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const spaceStore = useSpacesStore();

const projectId = route.params.id as string;
const spaceId = route.params.spaceId as string;

const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedTaskId = ref<string | null>(null);

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
  taskStore.tasks.filter((t) => t.status === "pending")
);

const inProgressTasks = computed(() =>
  taskStore.tasks.filter((t) => t.status === "in_progress")
);

const completedTasks = computed(() =>
  taskStore.tasks.filter((t) => t.status === "completed")
);

const selectedTask = computed(() =>
  taskStore.tasks.find((t) => t.id === selectedTaskId.value)
);

// Handlers
const handleCreate = async (data: CreateTask) => {
  await taskStore.createTask(data);
  isCreateModalOpen.value = false;
};

const handleEdit = async (data: CreateTask) => {
  if (!selectedTaskId.value) return;
  await taskStore.updateTask(selectedTaskId.value, data);
  isEditModalOpen.value = false;
  selectedTaskId.value = null;
};

const handleDelete = async () => {
  if (!selectedTaskId.value) return;
  await taskStore.deleteTask(selectedTaskId.value);
  isDeleteModalOpen.value = false;
  selectedTaskId.value = null;
};

const openEditModal = (id: string) => {
  selectedTaskId.value = id;
  isEditModalOpen.value = true;
};

const openDeleteModal = (id: string) => {
  selectedTaskId.value = id;
  isDeleteModalOpen.value = true;
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

        <BaseButton @click="isCreateModalOpen = true" variant="primary">
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
      <BaseButton @click="isCreateModalOpen = true" variant="primary">
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
            @edit="openEditModal"
            @delete="openDeleteModal"
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
            @edit="openEditModal"
            @delete="openDeleteModal"
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
            @edit="openEditModal"
            @delete="openDeleteModal"
          />
        </div>
      </div>
    </div>

    <!-- 3. Modales -->
    <!-- Modal Crear Tarea -->
    <BaseModal
      :is-open="isCreateModalOpen"
      title="Nueva Tarea"
      @close="isCreateModalOpen = false"
    >
      <TaskForm
        :space-id="spaceId"
        @submit="handleCreate"
        @cancel="isCreateModalOpen = false"
      />
    </BaseModal>

    <!-- Modal Editar Tarea -->
    <BaseModal
      :is-open="isEditModalOpen"
      title="Editar Tarea"
      @close="isEditModalOpen = false"
    >
      <TaskForm
        v-if="selectedTask"
        :task="selectedTask"
        :space-id="spaceId"
        @submit="handleEdit"
        @cancel="isEditModalOpen = false"
      />
    </BaseModal>

    <!-- Modal Eliminar Tarea -->
    <BaseModal
      :is-open="isDeleteModalOpen"
      title="Eliminar Tarea"
      size="small"
      @close="isDeleteModalOpen = false"
    >
      <div class="p-4">
        <p class="mb-4 text-slate-600">
          ¿Estás seguro de que deseas eliminar
          <strong>{{ selectedTask?.title }}</strong
          >? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-2">
          <BaseButton variant="secondary" @click="isDeleteModalOpen = false">
            Cancelar
          </BaseButton>
          <BaseButton variant="danger" @click="handleDelete">
            Eliminar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
