// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // });

// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 5173,
//     // Proxy para que tu API de Vercel funcione en dev
//     proxy: {
//       "/api": "http://localhost:3000"
//     }
//   }
// });
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },

    base: isDev ? "/" : "./", // rutas relativas en build
    build: { outDir: "dist" },

    server: isDev
      ? {
          port: 5173,
          proxy: { "/api": "http://localhost:3000" },
        }
      : undefined,
  };
});
