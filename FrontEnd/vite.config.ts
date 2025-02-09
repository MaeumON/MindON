import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react(), tsconfigPaths()],
  // resolve: {
  //   alias: {
  //     /* 기존 설정=======================
  //     "@": "/src",
  //     "@components": "/src/components",
  //     "@pages": "/src/pages",
  //     "@assets": "/src/assets",
  //     "@apis": "/src/apis",
  //     "@stores": "/src/stores",
  //     "@hooks": "/src/hooks",
  //     "@utils": "/src/utils",
  //     =================================*/
  //     "@": path.resolve(__dirname, "src"),
  //     "@components": path.resolve(__dirname, "src/components"),
  //     "@pages": path.resolve(__dirname, "src/pages"),
  //     "@assets": path.resolve(__dirname, "src/assets"),
  //     "@apis": path.resolve(__dirname, "src/apis"),
  //     "@stores": path.resolve(__dirname, "src/stores"),
  //     "@hooks": path.resolve(__dirname, "src/hooks"),
  //     "@utils": path.resolve(__dirname, "src/utils"),
  //   },
  // },
});
