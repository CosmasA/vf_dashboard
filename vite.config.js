import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/vf_dashboard/",
  server: {
    proxy: {
      // This will proxy requests to your backend server during development
      "/api": {
        target: "http://161.97.81.168:8080",
        changeOrigin: true,
        secure: false, // Allow self-signed certificates if needed
        rewrite: (path) => path.replace(/^\/api/, ""), // Rewrite the URL path
      },
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/vf_dashboard/",
// });
