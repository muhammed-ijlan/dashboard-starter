import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, "./package.json"), "utf-8")) as {
  version: string;
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (/react-dom|react\//.test(id)) return "vendor-react";
            if (id.includes("react-router")) return "vendor-react";
            if (id.includes("zustand")) return "vendor-react";
            if (id.includes("antd") || id.includes("@ant-design")) return "vendor-antd";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            if (id.includes("recharts")) return "vendor-charts";
            if (id.includes("xlsx")) return "vendor-xlsx";
            if (id.includes("i18next")) return "vendor-i18n";
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      reporter: ["text", "html"],
      exclude: ["src/test/**", "src/**/*.d.ts"],
    },
  },
});
