import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const demoLoginSchema = z.object({
  email: z.string().email(),
  product: z.enum(["OIS", "PITS"]).default("OIS")
});

const serviceIdentity = {
  service: "ois-nextgen-core-api",
  status: "ok",
  version: "0.1.0",
  health: "/health",
  docs: "/docs"
} as const;

function registryMetadata() {
  return {
    source: "default-db",
    mode: "read-only",
    environment: "staging",
    generatedAt: new Date().toISOString()
  };
}

export type CoreApiPrismaClient = Pick<
  PrismaClient,
  | "$disconnect"
  | "auditRecord"
  | "industry"
  | "moduleDefinition"
  | "organization"
  | "productDefinition"
  | "productInstallation"
  | "project"
  | "userAccount"
  | "workspace"
>;

export interface BuildCoreApiOptions {
  prisma?: CoreApiPrismaClient;
}

export function buildCoreApi(options: BuildCoreApiOptions = {}) {
  const app = Fastify({ logger: { name: "ois-nextgen-core-api" } });
  const prisma = options.prisma ?? new PrismaClient();

  const productSummary = (product: { id: string; code: string; name: string; lifecycle: string; version: number }) => ({
    id: product.id,
    code: product.code,
    name: product.name,
    lifecycle: product.lifecycle,
    version: product.version
  });

  const organizationSummary = (organization: { id: string; code: string; name: string; lifecycle: string; version: number }) => ({
    id: organization.id,
    code: organization.code,
    name: organization.name,
    lifecycle: organization.lifecycle,
    version: organization.version
  });

  const workspaceSummary = (workspace: {
    id: string;
    code: string;
    name: string;
    organizationId: string;
    lifecycle: string;
    version: number;
  }) => ({
    id: workspace.id,
    code: workspace.code,
    name: workspace.name,
    organizationId: workspace.organizationId,
    lifecycle: workspace.lifecycle,
    version: workspace.version
  });

  const projectSummary = (project: {
    id: string;
    code: string;
    name: string;
    workspaceId: string;
    lifecycle: string;
    version: number;
  }) => ({
    id: project.id,
    code: project.code,
    name: project.name,
    workspaceId: project.workspaceId,
    lifecycle: project.lifecycle,
    version: project.version
  });

  const moduleSummary = (module: {
    id: string;
    code: string;
    productCode: string;
    layerCode: string;
    scope: string;
    realmCode: string;
    moduleType: string;
    lifecycle: string;
    version: number;
  }) => ({
    id: module.id,
    code: module.code,
    productCode: module.productCode,
    layerCode: module.layerCode,
    scope: module.scope,
    realmCode: module.realmCode,
    moduleType: module.moduleType,
    lifecycle: module.lifecycle,
    version: module.version
  });

  const installationSummary = (installation: {
    id: string;
    productCode: string;
    productId: string;
    organizationId: string;
    workspaceId: string;
    projectId: string;
    lifecycle: string;
    version: number;
    product?: { code: string; name: string } | null;
    organization?: { code: string; name: string } | null;
    workspace?: { code: string; name: string } | null;
    project?: { code: string; name: string } | null;
  }) => ({
    id: installation.id,
    productCode: installation.productCode,
    productId: installation.productId,
    organizationId: installation.organizationId,
    workspaceId: installation.workspaceId,
    projectId: installation.projectId,
    lifecycle: installation.lifecycle,
    version: installation.version,
    product: installation.product
      ? {
          code: installation.product.code,
          name: installation.product.name
        }
      : null,
    organization: installation.organization
      ? {
          code: installation.organization.code,
          name: installation.organization.name
        }
      : null,
    workspace: installation.workspace
      ? {
          code: installation.workspace.code,
          name: installation.workspace.name
        }
      : null,
    project: installation.project
      ? {
          code: installation.project.code,
          name: installation.project.name
        }
      : null
  });

  const byCode = <T extends { code: string }>(left: T, right: T) => left.code.localeCompare(right.code);

  async function readProducts() {
    const products = await prisma.productDefinition.findMany({
      include: {
        modules: true,
        installations: {
          include: {
            organization: true,
            workspace: true,
            project: true
          }
        }
      },
      orderBy: { code: "asc" }
    });

    return products.map((product) => ({
      ...productSummary(product),
      modules: product.modules.slice().sort(byCode).map(moduleSummary),
      installations: product.installations
        .slice()
        .sort((left, right) => `${left.projectId}:${left.productCode}`.localeCompare(`${right.projectId}:${right.productCode}`))
        .map(installationSummary)
    }));
  }

  async function readWorkspaces() {
    const [organizations, workspaces] = await Promise.all([
      prisma.organization.findMany({
        include: { industry: true },
        orderBy: { code: "asc" }
      }),
      prisma.workspace.findMany({
        include: {
          organization: true,
          projects: true,
          installations: true
        },
        orderBy: { code: "asc" }
      })
    ]);

    return {
      organizations: organizations.map((organization) => ({
        ...organizationSummary(organization),
        industry: {
          id: organization.industry.id,
          code: organization.industry.code,
          name: organization.industry.name
        }
      })),
      workspaces: workspaces.map((workspace) => ({
        ...workspaceSummary(workspace),
        organization: {
          id: workspace.organization.id,
          code: workspace.organization.code,
          name: workspace.organization.name
        },
        projects: workspace.projects.slice().sort(byCode).map(projectSummary),
        installations: workspace.installations
          .slice()
          .sort((left, right) => `${left.projectId}:${left.productCode}`.localeCompare(`${right.projectId}:${right.productCode}`))
          .map((installation) => ({
            id: installation.id,
            productCode: installation.productCode,
            projectId: installation.projectId,
            lifecycle: installation.lifecycle
          }))
      }))
    };
  }

  async function readProjects() {
    const projects = await prisma.project.findMany({
      include: {
        workspace: { include: { organization: true } },
        installations: { include: { product: true } }
      },
      orderBy: { code: "asc" }
    });

    return projects.map((project) => ({
      ...projectSummary(project),
      workspace: {
        id: project.workspace.id,
        code: project.workspace.code,
        name: project.workspace.name
      },
      organization: {
        id: project.workspace.organization.id,
        code: project.workspace.organization.code,
        name: project.workspace.organization.name
      },
      installations: project.installations
        .slice()
        .sort((left, right) => `${left.productCode}:${left.id}`.localeCompare(`${right.productCode}:${right.id}`))
        .map((installation) => ({
          id: installation.id,
          productCode: installation.productCode,
          productName: installation.product.name,
          lifecycle: installation.lifecycle,
          version: installation.version
        }))
    }));
  }

  async function readModules() {
    const modules = await prisma.moduleDefinition.findMany({
      include: { product: true },
      orderBy: { code: "asc" }
    });

    return modules.map((module) => ({
      ...moduleSummary(module),
      product: {
        id: module.product.id,
        code: module.product.code,
        name: module.product.name
      }
    }));
  }

  async function readInstallations() {
    const installations = await prisma.productInstallation.findMany({
      include: {
        product: true,
        organization: true,
        workspace: true,
        project: true
      },
      orderBy: { id: "asc" }
    });

    return installations.map(installationSummary);
  }

  async function readRegistry() {
    const [products, workspaceRegistry, projects, modules, installations] = await Promise.all([
      readProducts(),
      readWorkspaces(),
      readProjects(),
      readModules(),
      readInstallations()
    ]);

    return {
      metadata: registryMetadata(),
      products,
      organizations: workspaceRegistry.organizations,
      workspaces: workspaceRegistry.workspaces,
      projects,
      modules,
      installations
    };
  }

  app.register(swagger, {
    openapi: {
      info: {
        title: "OIS NextGen Core API",
        version: "0.1.0"
      },
      paths: {
        "/": {
          get: {
            tags: ["runtime"],
            responses: {
              "200": {
                description: "Core API service identity response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["service", "status", "version", "health", "docs"],
                      properties: {
                        service: { type: "string" },
                        status: { type: "string" },
                        version: { type: "string" },
                        health: { type: "string" },
                        docs: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/health": {
          get: {
            tags: ["runtime"],
            responses: {
              "200": {
                description: "Core API health response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["status", "service", "stage"],
                      properties: {
                        status: { type: "string" },
                        service: { type: "string" },
                        stage: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  app.get(
    "/",
    {
      schema: {
        tags: ["runtime"],
        response: {
          200: {
            type: "object",
            required: ["service", "status", "version", "health", "docs"],
            properties: {
              service: { type: "string" },
              status: { type: "string" },
              version: { type: "string" },
              health: { type: "string" },
              docs: { type: "string" }
            }
          }
        }
      }
    },
    async () => serviceIdentity
  );

  app.get(
    "/health",
    {
      schema: {
        tags: ["runtime"],
        response: {
          200: {
            type: "object",
            required: ["status", "service", "stage"],
            properties: {
              status: { type: "string" },
              service: { type: "string" },
              stage: { type: "string" }
            }
          }
        }
      }
    },
    async () => ({
      status: "ok",
      service: "core-api",
      stage: "bootstrap-stage-a"
    })
  );

  app.post("/auth/demo-login", async (request, reply) => {
    const parsed = demoLoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid demo login payload" });
    }

    const user = await prisma.userAccount.findUnique({
      where: { email: parsed.data.email },
      include: { memberships: true }
    });

    if (!user || !user.demoOnly) {
      return reply.code(401).send({ error: "Demo user not found" });
    }

    return {
      demo: true,
      message: "DEMO DATA - NOT PRODUCTION",
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        realmCode: user.realmCode,
        memberships: user.memberships.map((membership) => ({
          workspaceId: membership.workspaceId,
          roleCode: membership.roleCode
        }))
      },
      product: parsed.data.product
    };
  });

  app.get("/platform/overview", async () => {
    const [
      industries,
      organizations,
      workspaces,
      projects,
      products,
      installations,
      modules,
      auditRecords
    ] = await Promise.all([
      prisma.industry.count(),
      prisma.organization.count(),
      prisma.workspace.count(),
      prisma.project.count(),
      prisma.productDefinition.count(),
      prisma.productInstallation.count(),
      prisma.moduleDefinition.count(),
      prisma.auditRecord.count()
    ]);

    return {
      banner: "DEMO DATA - NOT PRODUCTION",
      kernel: {
        industries,
        organizations,
        workspaces,
        projects,
        products,
        installations,
        modules,
        auditRecords
      },
      phaseGates: {
        PLATFORM_KERNEL: "IN_PROGRESS",
        PITS_BUSINESS_LOGIC: "BLOCKED_BY_PHASE2",
        KNOWLEDGE_PORTING: "BLOCKED_BY_PHASE2",
        FULL_STARTER_DATA: "BLOCKED_BY_PHASE3",
        REGRESSION_CERTIFICATION: "BLOCKED_BY_PHASE3"
      }
    };
  });

  app.get("/platform/products", async () => ({
    metadata: registryMetadata(),
    products: await readProducts()
  }));

  app.get("/platform/workspaces", async () => ({
    metadata: registryMetadata(),
    ...(await readWorkspaces())
  }));

  app.get("/platform/projects", async () => ({
    metadata: registryMetadata(),
    projects: await readProjects()
  }));

  app.get("/platform/modules", async () => ({
    metadata: registryMetadata(),
    modules: await readModules()
  }));

  app.get("/platform/installations", async () => ({
    metadata: registryMetadata(),
    installations: await readInstallations()
  }));

  app.get("/platform/registry", async () => readRegistry());

  app.get("/projects/:projectId/product-installations/:productCode", async (request, reply) => {
    const params = request.params as { projectId: string; productCode: string };
    const installation = await prisma.productInstallation.findUnique({
      where: {
        projectId_productCode: {
          projectId: params.projectId,
          productCode: params.productCode as "OIS" | "PITS" | "CS_AGENT" | "KEIHB" | "ICR"
        }
      },
      include: { grants: true, product: true }
    });

    if (!installation) return reply.code(404).send({ error: "Product installation not found" });
    return installation;
  });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  app.register(swaggerUi, { routePrefix: "/docs" });

  return app;
}
