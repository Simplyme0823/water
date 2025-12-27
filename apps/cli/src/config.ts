import fsExtra from "fs-extra";
import { homedir } from "node:os";
import { join } from "node:path";

export type TansuiConfig = {
  llm?: {
    apiKey?: string;
    model?: string;
    baseUrl?: string;
  };
};

export type ResolvedTansuiConfig = {
  llm: {
    apiKey: string;
    model: string;
    baseUrl: string;
  };
};

const CONFIG_DIR_NAME = ".tansui";
const CONFIG_FILE_NAME = "config.json";
const DEFAULT_CONFIG: ResolvedTansuiConfig = {
  llm: {
    apiKey: "",
    model: "GLM-4.7",
    baseUrl: "",
  },
};

function resolveConfigDir(): string {
  return join(homedir(), CONFIG_DIR_NAME);
}

export function resolveConfigPath(dir = resolveConfigDir()): string {
  return join(dir, CONFIG_FILE_NAME);
}

function normalizeConfig(config?: TansuiConfig): ResolvedTansuiConfig {
  const source = config?.llm;
  const apiKey =
    typeof source?.apiKey === "string" ? source.apiKey.trim() : "";
  const modelCandidate =
    typeof source?.model === "string" ? source.model.trim() : "";
  const model = modelCandidate || DEFAULT_CONFIG.llm.model;
  const baseUrlCandidate =
    typeof source?.baseUrl === "string"
      ? source.baseUrl.trim()
      : "";
  return {
    llm: {
      apiKey,
      model,
      baseUrl: baseUrlCandidate,
    },
  };
}

function isNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT"
  );
}

export async function loadConfig(): Promise<ResolvedTansuiConfig> {
  const dir = resolveConfigDir();
  try {
    await fsExtra.ensureDir(dir);
  } catch {
    return DEFAULT_CONFIG;
  }

  const configPath = resolveConfigPath(dir);
  try {
    const parsed = (await fsExtra.readJson(configPath)) as unknown;
    const isObject =
      parsed && typeof parsed === "object" && !Array.isArray(parsed);
    let cleaned = isObject ? (parsed as Record<string, unknown>) : undefined;
    return normalizeConfig(
      cleaned && typeof cleaned === "object"
        ? (cleaned as TansuiConfig)
        : undefined
    );
  } catch (error) {
    if (isNotFound(error)) {
      try {
        await fsExtra.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
      } catch {
        // Ignore write errors; the config is optional.
      }
      return DEFAULT_CONFIG;
    }
    return DEFAULT_CONFIG;
  }
}
