import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export interface SwaggerSetup {
  title: string;
  version?: string;
  description?: string;
  /** Absolute paths to .yaml/.yml files or directories that contain them. */
  apis: string[];
  serverUrl?: string;
}

interface OpenApiFragment {
  paths?: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown>; [k: string]: unknown };
  tags?: unknown[];
}

function collectYamlFiles(targets: string[]): string[] {
  const files: string[] = [];
  for (const target of targets) {
    if (!fs.existsSync(target)) continue;
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(target)) {
        if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
          files.push(path.join(target, entry));
        }
      }
    } else if (target.endsWith('.yaml') || target.endsWith('.yml')) {
      files.push(target);
    }
  }
  return files;
}

/**
 * Mounts Swagger UI at `/docs` and the raw spec at `/docs.json`.
 * Each service points `apis` at one or more `docs/` folders (or .yaml files)
 * that contain OpenAPI 3 fragments with `paths` / `components`.
 */
export function setupSwagger(app: Express, opts: SwaggerSetup): void {
  const baseSpec: Record<string, unknown> = {
    openapi: '3.0.3',
    info: {
      title: opts.title,
      version: opts.version ?? '1.0.0',
      description: opts.description,
    },
    servers: opts.serverUrl ? [{ url: opts.serverUrl }] : [],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {},
    },
    paths: {},
    tags: [],
  };

  const components = baseSpec.components as {
    securitySchemes: Record<string, unknown>;
    schemas: Record<string, unknown>;
    [k: string]: unknown;
  };
  const paths = baseSpec.paths as Record<string, unknown>;
  const tags = baseSpec.tags as unknown[];

  for (const file of collectYamlFiles(opts.apis)) {
    const raw = fs.readFileSync(file, 'utf8');
    const fragment = (yaml.load(raw) ?? {}) as OpenApiFragment;
    if (fragment.paths) Object.assign(paths, fragment.paths);
    if (fragment.components?.schemas) {
      Object.assign(components.schemas, fragment.components.schemas);
    }
    if (fragment.components) {
      for (const [key, value] of Object.entries(fragment.components)) {
        if (key === 'schemas') continue;
        if (components[key] && typeof components[key] === 'object') {
          Object.assign(components[key] as object, value as object);
        } else {
          components[key] = value;
        }
      }
    }
    if (Array.isArray(fragment.tags)) tags.push(...fragment.tags);
  }

  app.get('/docs.json', (_req, res) => {
    res.json(baseSpec);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(baseSpec));
}
