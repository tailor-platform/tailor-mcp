# @tailor-platform/tailor-mcp

The npm package `@tailor-platform/tailor-mcp` is a tool for automatically installing the [tailorctl](https://github.com/tailor-platform/tailorctl) command-line utility, with a focus on MCP (Model Context Protocol) server functionality.

## What is Tailor Platform?

Tailor Platform is a headless ERP platform that enables building composable applications:

- **Low-code Development**: Build applications without extensive coding, with automatic GraphQL interface generation
- **LLM-friendly**: Create data models, business logic, and workflows without writing code, leveraging the power of large language models
- **Enterprise-Ready**: Build mission-critical core business applications that can scale with your organization
- **Composable Architecture**: Develop modular applications that can be assembled and reassembled to meet changing business needs

## Getting Started with Tailor Platform

Getting started with Tailor Platform is simple:

1. **Create an account**: The only prerequisite is to create an account at [console.tailor.tech](https://console.tailor.tech)

2. **Configure applications via MCP**: Once you have an account, you can configure your applications through the MCP server

3. **Access via GraphQL**: Your applications are accessible via GraphQL - you can use:
   - The GraphQL Playground for testing queries
   - Any GraphQL client for building applications

4. **Monitor via Console**: All configuration and application details can be viewed through the web UI at [console.tailor.tech](https://console.tailor.tech)

> **Note:** MCP server does not support managing application authentication settings or secrets. Please use the Console, Tailorctl commands, or Terraform to configure these settings.

## Installation

```bash
npm install @tailor-platform/tailor-mcp
```

## Features

- Automatically installs the appropriate `tailorctl` binary for your platform
- Supports all major platforms:
  - macOS (x86_64, arm64)
  - Linux (x86_64, arm64)
  - Windows (x86_64, arm64)
- Provides easy access to MCP server functionality

## Authentication

Before using the MCP server functionality, you need to authenticate:

```bash
npx tailorctl auth login
```

By default, credentials are stored in the `.tailorctl` directory in your HOME directory. If you don't want to use these stored credentials, or when using certain MCP clients like Cline that don't support this authentication method, you'll need to use the `TAILOR_TOKEN` environment variable:

You can obtain a Personal Access Token (PAT) by following the instructions at [https://docs.tailor.tech/tailorctl/auth/pat](https://docs.tailor.tech/tailorctl/auth/pat).


## MCP Server Configuration

### Using with LLM Clients (Claude, Cline, etc.)

Configure MCP servers using a JSON configuration format to connect with LLM clients:

```json
{
  "mcpServers": {
    "tailor": {
      "command": "npx tailorctl",
      "args": [
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
- Authenticates using the TAILOR_TOKEN environment variable

### Starting via HTTP Transport

To start an MCP server with HTTP transport:

```bash
npx tailorctl mcp --transport=http --listen=0.0.0.0:9000
```

This command:
- Starts the MCP server using HTTP protocol
- Listens on all interfaces (0.0.0.0) on port 9000
- Makes the server accessible to other machines on your network

## License

ISC