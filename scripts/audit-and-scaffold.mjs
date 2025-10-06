import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const spec = JSON.parse(fs.readFileSync("docs/route-spec.json","utf8"));
const appRoots = ["app","src/app"].filter(p=>fs.existsSync(p));
if(!appRoots.length) { console.error("No app/ or src/app/ found"); process.exit(1); }
const appRoot = appRoots[0];

const toFs = r => r
  .replace(/^\/$/,"")
  .replace(/^\//,"")
  .replace(/\[([^\]]+)\]/g, "[$1]"); // keep dynamic segments

function hasPage(route){
  const fsPath = toFs(route);
  // Check normal path
  const normalPage = path.join(appRoot, fsPath, "page.tsx");
  if (fs.existsSync(normalPage)) return true;
  
  // Check in route groups - scan for any (group) folders
  try {
    const dirs = fs.readdirSync(appRoot, { withFileTypes: true });
    for (const dir of dirs) {
      if (dir.isDirectory() && dir.name.startsWith("(") && dir.name.endsWith(")")) {
        const groupPage = path.join(appRoot, dir.name, fsPath, "page.tsx");
        if (fs.existsSync(groupPage)) return true;
      }
    }
  } catch {
    // ignore read errors
  }
  
  return false;
}

const missing = spec.filter(r => !hasPage(r));

// scaffold minimal glassy stub
for (const r of missing){
  const dir = path.join(appRoot, toFs(r));
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "page.tsx");
  const name = r === "/" ? "Home" : r.split("/").filter(Boolean).map(s=>s.replace(/\[|\]/g,"")).map(s=>s[0].toUpperCase()+s.slice(1)).join(" • ");
  fs.writeFileSync(file, `export default function Page(){return (
  <div className="min-h-[60vh] p-6">
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <h1 className="text-2xl font-semibold mb-2">${name}</h1>
      <p className="text-white/70">Scaffolded placeholder for <code>${r}</code>. Replace with the real component.</p>
    </div>
  </div>
);}\n`);
  console.log("➕ scaffolded", r);
}

// generate Playwright smoke tests
const testContent = `import { test, expect } from "@playwright/test";

const routes = ${JSON.stringify(spec, null, 2)};

for (const route of routes) {
  test(\`smoke: \${route}\`, async ({ page }) => {
    await page.goto(route);
    // Basic smoke test - page loads and has an h1
    await expect(page.locator('h1')).toBeVisible();
  });
}
`;

fs.writeFileSync("tests/smoke.generated.spec.ts", testContent);

console.log("\nSummary:");
console.log("  Existing pages:", spec.length - missing.length);
console.log("  Missing created:", missing.length);

// optional: quick type/lint/build to catch breakages
try { execSync("npm run build:full", { stdio: "inherit" }); } catch {}