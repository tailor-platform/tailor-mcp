# LLM Assisted Installation Guide

This file provides AI agents with instructions for automatically installing and configuring this MCP server.

## Prerequisites

Before installation, users must create a Tailor Platform account at [console.tailor.tech](https://console.tailor.tech).

## Installation Steps

### 1. Install tailor-platform/tailor-mcp

```bash
npm install @tailor-platform/tailor-mcp
```

### 2. Obtain a Personal Access Token (PAT)

The user must manually execute the following commands to obtain a PAT:

> **Note:** LLM assistants cannot run these authentication commands. Users must manually execute them in their terminal.

#### 2.1. Log in to Tailor Platform

```bash
npx @tailor-platform/tailor-mcp auth login
```

#### 2.2. Create a Personal Access Token

```bash
npx @tailor-platform/tailor-mcp auth pat create --name mcp --scopes write --scopes read
Successfully created Personal Access Token: tpp_xxxxxxxxxxxxxxxxx
```

The token with prefix `tpp_*` should be used for the `TAILOR_TOKEN` value.

If the user already has a PAT, they can provide this token directly.

### 3. Configure MCP Server

Configure MCP servers using a JSON configuration format to connect with LLM clients:

```json
{
  "mcpServers": {
    "tailor": {
      "command": "npx",
      "args": [
        "-y",
        "@tailor-platform/tailor-mcp",
        "mcp"
      ],
      "env": {
        "TAILOR_TOKEN": "TAILOR_TOKEN"
      }
    }
  }
}
```

### 4. Available Tools

Once configured, the following tools are available:

- **create_resource**: Creates resources of various types
- **update_resource**: Updates resources of various types 
- **destroy_resource**: Destroys resources of various types
- **fetch_resource_by_trn**: Fetches resources by TRN
- **search_resource**: Searches resources by workspace ID and resource type
- **query_graphql**: GraphQL Query tool
- **graphql_sdl**: Fetch SDL for GraphQL

### 5. Testing Tools

To verify the installation is working:

1. Restart your LLM application (Cline, Claude Desktop, etc.)
2. Test the connection by running a simple command like:
   "Please list my workspaces using search_resource tool"

## Troubleshooting

**ERROR: internal: failed to issue personal access token**
- This may occur if you are not logged in or if you're trying to create a PAT with a name that's already in use
- Solution: Log in first or try creating a PAT with a different name

**ERROR unauthenticated: missing token**
- This indicates that you are not logged in or your session has expired
- Solution: Log in again using the command:
  ```bash
  npx @tailor-platform/tailor-mcp auth login
  ```

**No resources found when using search_resource**
- This is normal for newly created accounts that don't have any resources yet
- Solution: This is expected behavior for new accounts. Create resources first before attempting to search for them. eg: create_workspace