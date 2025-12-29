import { supabase } from "@/lib/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Task, CreateTask, TaskStatus } from "@/types/database";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTaskBySpace = async (spaceId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("space_id", spaceId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      tasks.value = data || [];
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const fetchTasksByProject = async (projectId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const { data: spacesData, error: spacesError } = await supabase
        .from("spaces")
        .select("id")
        .eq("project_id", projectId);

      if (spacesError) throw spacesError;

      const spaceIds = spacesData?.map((s) => s.id) || [];

      if (spaceIds.length === 0) {
        tasks.value = [];
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .in("space_id", spaceIds)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      tasks.value = data || [];
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (task: CreateTask): Promise<Task | null> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert(task)
        .select()
        .single();

      if (insertError) throw insertError;

      if (!data) throw new Error("Error al crear tarea");

      tasks.value.unshift(data);
      return data || null;
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (
    id: string,
    updates: Partial<CreateTask>
  ): Promise<Task | null> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const index = tasks.value.findIndex((s) => s.id === id);
      if (index !== -1 && data) {
        tasks.value[index] = data;
      }

      return data || null;
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      tasks.value = tasks.value.filter((s) => s.id !== id);

      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateTaskStatus = async (
    id: string,
    status: TaskStatus
  ): Promise<Task | null> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1 && data) {
        tasks.value[index] = data;
      }

      return data;
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    //State
    tasks,
    loading,
    error,

    //Actions
    fetchTaskBySpace,
    fetchTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
});
