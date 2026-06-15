/* ==========================================================================
   IELTSwithMOURAD — runtime configuration
   --------------------------------------------------------------------------
   This is the ONLY file you edit to point the platform at your cloud.
   The anon key below is a PUBLIC (publishable) key — it is meant to live in
   the client. It is NOT the service_role key; never put service_role here.

   defaultRoom:  every device using the SAME room sees the same Improvement
   Lab. Keep the default for one shared class, or set a per-class code in the
   Improvement Lab (teacher) / Writing Clinic (student) header.
   ========================================================================== */
window.MMWA_CONFIG = {
  supabaseUrl: "https://swaliskcoaesdcrgwesa.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3YWxpc2tjb2Flc2Rjcmd3ZXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MjUyODIsImV4cCI6MjA5NzEwMTI4Mn0.H_fHR1dB75aH7KkfkaNblOw-SyfZfJyFb8Z6FNuVMbU",
  defaultRoom: "mmwa-main"
};
