import { supabase } from "@/lib/supabase";
import type { CreateSpace, Space } from "@/types/database";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSpacesStore = defineStore("space", () => {
  const spaces = ref<Space[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchSpacesByProject = async (projectId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("spaces")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      spaces.value = spaces.value.filter((s) => s.project_id !== projectId);

      if (data) spaces.value.push(...data);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const createSpace = async (space: CreateSpace): Promise<Space | null> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("spaces")
        .insert(space)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (!data) {
        throw new Error("Error al crear el espacio");
      }

      spaces.value.unshift(data);
      return data || null;
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateSpace = async (
    id: string,
    space: Partial<CreateSpace>
  ): Promise<Space | null> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("spaces")
        .update(space)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const index = spaces.value.findIndex((s) => s.id === id);
      if (index !== -1 && data) {
        spaces.value[index] = data;
      }

      return data || null;
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteSpace = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("spaces")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      spaces.value = spaces.value.filter((s) => s.id !== id);

      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    spaces,
    loading,
    error,

    // Actions
    fetchSpacesByProject,
    createSpace,
    updateSpace,
    deleteSpace,
  };
});
