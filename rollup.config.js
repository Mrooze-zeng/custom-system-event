import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import resolve from "rollup-plugin-node-resolve";
export default {
  input: "./app.js",
  output: {
    file: "lib/index.js",
    format: "cjs"
  },
  plugins: [resolve(), minify(), babel()]
};
