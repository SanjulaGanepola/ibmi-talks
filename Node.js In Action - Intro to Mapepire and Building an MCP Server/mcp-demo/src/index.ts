import { SQLJob } from "@ibm/mapepire-js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ------------------------------
// Create MCP Server
// ------------------------------
const server = new McpServer({
    name: "connectme-mcp-server",
    version: "1.0.0",
});

// ------------------------------
// Utility: Create SQL Job
// ------------------------------
async function createSQLJob() {
    const job = new SQLJob();
    await job.connect({
        host: process.env.IBMI_HOST,
        port: Number(process.env.IBMI_PORT),
        user: process.env.IBMI_USER,
        password: process.env.IBMI_PASSWORD,
        rejectUnauthorized: false,
    });
    return job;
}

// ------------------------------
// TOOL 1: List Tables
// ------------------------------
server.registerTool(
    "list_tables",
    {
        title: "List Tables",
        description: "List all tables in the ConnectMe schema.",
        inputSchema: {},
    },
    async () => {
        let job: SQLJob | undefined;
        try {
            job = await createSQLJob();
            const query = `
                SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE
                FROM QSYS2.SYSTABLES
                WHERE TABLE_SCHEMA = 'CONNECTME' AND TABLE_TYPE = 'T'
                ORDER BY TABLE_NAME
            `;
            const result = await job.execute<any>(query);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result.data, null, 2),
                    },
                ],
            };
        } finally {
            if (job) {
                await job.close();
            }
        }
    }
);

// ------------------------------
// TOOL 2: Get Table Info
// ------------------------------
server.registerTool(
    "get_table_info",
    {
        title: "Get Table Info",
        description: "Get the column information of one or more tables in the ConnectMe schema.",
        inputSchema: {
            tables: z.array(z.string()).describe("Name(s) of the table(s) to inspect."),
        },
    },
    async ({ tables }) => {
        let job: SQLJob | undefined;
        try {
            job = await createSQLJob();

            // normalize to array
            const results: Record<string, any[]> = {};

            for (const table of tables) {
                const query = `
                    SELECT COLUMN_NAME, COLUMN_TEXT, DATA_TYPE, LENGTH
                    FROM QSYS2.SYSCOLUMNS
                    WHERE TABLE_SCHEMA = 'CONNECTME' AND TABLE_NAME = ?
                    ORDER BY COLUMN_NAME
                `;
                const result = await job.execute<any>(query, { parameters: [table.toUpperCase()] });

                if (!result.success) {
                    results[table] = [{ error: `Failed to get info for table ${table}` }];
                } else {
                    results[table] = result.data;
                }
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        } finally {
            if (job) {
                await job.close();
            }
        }
    }
);

// ------------------------------
// TOOL 3: Get Table Data
// ------------------------------
server.registerTool(
    "get_table_data",
    {
        title: "Get Table Data",
        description: "Retrieve all data from one or more tables in the ConnectMe schema.",
        inputSchema: {
            tables: z.array(z.string()).describe("Name(s) of the table(s) to retrieve data from."),
        },
    },
    async ({ tables }) => {
        let job: SQLJob | undefined;
        try {
            job = await createSQLJob();

            const results: Record<string, any[]> = {};

            for (const table of tables) {
                const query = `SELECT * FROM CONNECTME.${table.toUpperCase()}`;
                const result = await job.execute<any>(query);

                if (!result.success) {
                    results[table] = [{ error: `Failed to get data for table ${table}` }];
                } else {
                    results[table] = result.data;
                }
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        } finally {
            if (job) {
                await job.close();
            }
        }
    }
);

// ------------------------------
// PROMPT 1: Suggest Plan Upgrade
// ------------------------------
server.registerPrompt(
    "suggest_plan_upgrade",
    {
        title: "Suggest Plan Upgrades",
        description: "Suggest which customers should upgrade their plans based on usage.",
        argsSchema: {
            filter: z.string().optional().describe("Optionally filter customers by a general description, e.g., 'Basic plan', 'high data usage'")
        }
    },
    ({ filter }) => ({
        messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Suggest which customers should upgrade their plans.

Consider:
- Plan purchase details for each customer
- Customers whose usage exceeds or is close to plan limits
- Compare customers with similar usage patterns

Constraints:
${filter ? `- Only include customers matching: ${filter}` : "- Include all customers"}`
            }
        }]
    })
);

// ------------------------------
// PROMPT 2: Suggest Phone Upgrade
// ------------------------------
server.registerPrompt(
    "suggest_phone_upgrade",
    {
        title: "Suggest Phone Upgrades",
        description: "Suggest which customers should upgrade their phones based on plan and device age.",
        argsSchema: {
            filter: z.string().optional().describe("Optionally filter customers by a general description, e.g., 'older phones', 'high-tier plans'")
        }
    },
    ({ filter }) => ({
        messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Suggest which customers should upgrade their phones.

Consider:
- Phone purchase details for each customer
- Customers on higher-tier plans who might afford newer phones
- Compare customers with similar plans and suggest phone upgrades

Constraints:
${filter ? `- Only include customers matching: ${filter}` : "- Include all customers"}`
            }
        }]
    })
);

// ------------------------------
// Run MCP Server
// ------------------------------
async function runServer() {
    if (!process.env.IBMI_HOST || !process.env.IBMI_PORT || !process.env.IBMI_USER || !process.env.IBMI_PASSWORD) {
        throw new Error("Missing required environment variables: IBMI_HOST, IBMI_PORT, IBMI_USER, IBMI_PASSWORD");
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("ConnectMe MCP Server running on STDIO");
}

runServer().catch((error) => {
    console.error("Fatal error running server: ", error);
    process.exit(1);
});