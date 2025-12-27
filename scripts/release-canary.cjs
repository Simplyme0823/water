const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const workspaceDirs = ["packages", "apps"].map((name) => path.join(root, name));

const rootPackagePath = path.join(root, "package.json");
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, "utf8"));
const baseVersion = rootPackage.version || "0.1.0";

const now = new Date();
const stamp = now
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);
const rand = Math.random().toString(36).slice(2, 8);
const canaryVersion = `${baseVersion}-canary.${stamp}.${rand}`;

for (const workspaceDir of workspaceDirs) {
  if (!fs.existsSync(workspaceDir)) continue;
  for (const entry of fs.readdirSync(workspaceDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = path.join(workspaceDir, entry.name, "package.json");
    if (!fs.existsSync(pkgPath)) continue;
    const data = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    data.version = canaryVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(data, null, 2) + "\n");
  }
}

console.log(`Set canary version to ${canaryVersion}`);
