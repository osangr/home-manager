import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import type { Project, CreateProject } from "@/types/database";

export const useProjectStore = defineStore("project", () => {
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProjects = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      projects.value = data || [];
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const fetchProjectById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      currentProject.value = data || null;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (
    project: CreateProject
  ): Promise<Project | null> => {
    loading.value = true;
    error.value = null;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      error.value = "Usuario no encontrado";
      loading.value = false;
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("projects")
        .insert({
          ...project,
          user_id: userId,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }
      if (!data) {
        throw new Error("Error al crear el proyecto");
      }
      projects.value.unshift(data as Project);
      return data as Project | null;
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project | null> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }
      if (!data) {
        throw new Error("Error al actualizar el proyecto");
      }

      const index = projects.value.findIndex((proj) => proj.id === id);
      if (index !== -1) {
        projects.value[index] = data;
      }
      if (currentProject.value?.id === id) {
        currentProject.value = data;
      }
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
    return null;
  };

  return {
    // State
    projects,
    currentProject,
    loading,
    error,

    // Actions
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
  };
});
