import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  const initialize = async () => {
    loading.value = true;

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      user.value = currentUser;

      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null;
      });
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      user.value = data.user;
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const signUp = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      user.value = data.user;
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      user.value = null;
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,

    initialize,
    signIn,
    signUp,
    signOut,
  };
});
