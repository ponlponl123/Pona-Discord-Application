const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

let { baseUrl, paths } = tsConfig.compilerOptions;

// Replacing "src" by "dist" in typescript paths map
for (const path in paths) {
  paths[path] = paths[path].map((path) => path.replace("src", "dist"));
}

tsConfigPaths.register({ baseUrl, paths });