# ConnectMe MCP Server

This simple ConnectMe MCP server has tools to retrieve and updates of accounts in Db2i.

## Usage

1. Run the `connectme.sql` file to create the `CONNECTME` schema and `ACCOUNT` table.

2. Run `npm install` to install the MCP server dependencies.

3. Run `npm run webpack` to build the MCP server.

4. Run `npm run inspector` to test using the [MCP Inspector](https://modelcontextprotocol.io/legacy/tools/inspector).

5. Test in [Claude Desktop](https://claude.ai/download) by adding the below configuration to the `claude_desktop_config.json` file and make sure to set `{PATH_TO_INDEX_JS}`, `{IBMI_HOST}`, `{IBMI_USER}` and `{IBMI_PASSWORD}` accordingly:
    ```json
    {
        "mcpServers": {
            "connectme-mcp-server": {
                "command": "node",
                "args": [
                    "{PATH_TO_INDEX_JS}"
                ],
                "env": {
                    "IBMI_HOST": "{IBMI_HOST}",
                    "IBMI_PORT": "8076",
                    "IBMI_USER": "{IBMI_USER}",
                    "IBMI_PASSWORD": "{IBMI_PASSWORD}"
                }
            }
        }
    }
    ```

    Configuration File Location:
    * **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
    * **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
    * **Linux**: `~/.config/Claude/claude_desktop_config.json`