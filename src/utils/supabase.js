import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, // Accesible en el cliente
  import.meta.env.VITE_SUPABASE_ANON_KEY // Accesible en el cliente
);
