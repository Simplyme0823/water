const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const expoRoot = path.dirname(
  require.resolve("expo/package.json", { paths: [projectRoot] })
);
const metroRuntimeRoot = path.dirname(
  require.resolve("@expo/metro-runtime/package.json", { paths: [expoRoot] })
);

const config = getDefaultConfig(projectRoot);


module.exports = withNativeWind(config, {
  input: path.join(projectRoot, "global.css")
});
