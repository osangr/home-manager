import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEV_MODE = true;

if (DEV_MODE) {
  supabase.auth
    .signInWithPassword({
      email: "dev.user@email.com",
      password: "!Dev123",
    })
    .then(({ error }) => {
      if (error) {
        console.error("Error auto-login:", error);
      } else {
        console.log("✅ Auto-login exitoso (modo desarrollo)");
      }
    });
}
