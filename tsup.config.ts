import { defineConfig } from "tsup";

export default defineConfig([
  // Configuration for the main entry point
  {
    format: ["cjs","esm"], 
    entry: ["./index.ts"], 
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    splitting: false,
  },

  // Configuration for the test files
  {
    format: ["esm"], 
    entry: ["./test/**/*.ts"],
    outDir: "./dist/test",
    dts: false,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    splitting: false,
  },
]);
