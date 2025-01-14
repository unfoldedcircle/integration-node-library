import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "index.ts",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs"
    },
    {
      file: "dist/index.mjs",
      format: "esm"
    }
  ],
  plugins: [resolve(), commonjs(), typescript({ exclude: ["test/**/*"] })]
};
