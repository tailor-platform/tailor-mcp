# @tailor-platform/tailor-mcp

[![npm version](https://img.shields.io/npm/v/@tailor-platform/tailor-mcp.svg)](https://www.npmjs.com/package/@tailor-platform/tailor-mcp)

The npm package `@tailor-platform/tailor-mcp` is a tool for automatically installing the [tailorctl](https://github.com/tailor-platform/tailorctl) command-line utility, with a focus on MCP (Model Context Protocol) server functionality.

## What is Tailor Platform?


<img src="./assets/tailor-logo.png" alt="Tailor Platform Logo" width="300" style="background: #FFFFFF"/>

Tailor Platform is a headless ERP platform that enables building composable applications:

- **Low-code Development**: Build applications without extensive coding, with automatic GraphQL interface generation
- **LLM-friendly**: Create data models, business logic, and workflows without writing code, leveraging the power of large language models
- **Enterprise-Ready**: Build mission-critical core business applications that scale with your organization
- **Composable Architecture**: Develop modular applications that can be assembled and reassembled to meet changing business needs

## Getting Started with Tailor Platform

Getting started with Tailor Platform is simple:

1. **Create an account**: The only prerequisite is creating an account at [console.tailor.tech](https://console.tailor.tech)

2. **Configure applications via MCP**: Once you have an account, configure your applications through the MCP server

3. **Access via GraphQL**: Your applications are accessible via GraphQL - you can use:
   - The GraphQL Playground for testing queries
   - Any GraphQL client for building applications

4. **Monitor via Console**: All configuration and application details can be viewed through the web UI at [console.tailor.tech](https://console.tailor.tech)

## Features

- Automatically installs the appropriate `tailorctl` binary for your platform
- Supports all major platforms:
  - macOS (x86_64, arm64)
  - Linux (x86_64, arm64)
  - Windows (x86_64, arm64)
- Provides easy access to MCP server functionality
- Available MCP tools:
  - **create_resource**: Creates resources of various types
  - **update_resource**: Updates resources of various types
  - **destroy_resource**: Destroys resources of various types
  - **fetch_resource_by_trn**: Fetches resources by TRN
  - **search_resource**: Searches resources by workspace ID and resource type
  - **query_graphql**: GraphQL Query tool
  - **graphql_sdl**: Fetch SDL for GraphQL

## Authentication

Before using the MCP server functionality, you need to authenticate:

```bash
npx @tailor-platform/tailor-mcp auth login
```

By default, credentials are stored in the `.tailorctl` directory in your HOME directory. If you don't want to use these stored credentials, or when using certain MCP clients like Cline that don't support this authentication method, you'll need to use the `TAILOR_TOKEN` environment variable.

You can obtain a Personal Access Token (PAT).

```bash
npx @tailor-platform/tailor-mcp auth pat create --name mcp --scopes write --scopes read
Successfully created Personal Access Token: tpp_xxxxxxxxxxxxxxxxx
```
The prefix of tpp_* is your token and use for `TAILOR_TOKEN`

## MCP Server Configuration

### Using with LLM Clients (Claude, Cline, etc.)

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
        "TAILOR_TOKEN": "************" // Your Tailor Platform authentication token
      }
    }
  }
}
```

This configuration:
- Defines an MCP server named "tailor"
- Uses the `tailorctl` command with the `mcp` argument
- Authenticates using either `npx @tailor-platform/tailor-mcp auth login` or the `TAILOR_TOKEN` environment variable

### Starting via HTTP Transport

To start an MCP server with HTTP transport:

```bash
npx tailorctl mcp --transport=http --listen=0.0.0.0:9000
```

This command:
- Starts the MCP server using the HTTP protocol
- Listens on all interfaces (0.0.0.0) on port 9000
- Makes the server accessible to other machines on your network

## License

ISC