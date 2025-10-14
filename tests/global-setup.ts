import { request, type FullConfig } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export default async function globalSetup(config: FullConfig) {
  const project = config.projects?.[0];
  const projectBaseURL = project && typeof project.use.baseURL === 'string' ? project.use.baseURL : undefined;
  const baseURL = projectBaseURL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
  const storagePath = resolve(__dirname, '.auth/storageState.json');

  const context = await request.newContext({ baseURL });

  const response = await context.post("/api/test-login");
  if (!response.ok()) {
    throw new Error(`Failed to prime test auth: ${response.status()} ${response.statusText()}`);
  }

  await mkdir(dirname(storagePath), { recursive: true });
  await context.storageState({ path: storagePath });
  await context.dispose();
}
