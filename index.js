#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SlackNotificationServer {
  constructor() {
    this.server = new Server(
      {
        name: "slack-notification-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.channels = this.loadConfig();
    this.setupHandlers();
  }

  loadConfig() {
    const configPath = join(__dirname, "config.json");
    
    if (!existsSync(configPath)) {
      console.error("Config file not found. Please create config.json with your Slack webhook configurations.");
      console.error("Example config.json:");
      console.error(JSON.stringify({
        channels: {
          "general": {
            name: "General",
            webhook_url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
          },
          "notifications": {
            name: "Notifications", 
            webhook_url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
          }
        }
      }, null, 2));
      process.exit(1);
    }

    try {
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      return config.channels || {};
    } catch (error) {
      console.error("Failed to parse config.json:", error.message);
      process.exit(1);
    }
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Object.entries(this.channels).map(([channelId, channel]) => ({
        name: `slack_notify_${channelId}`,
        description: `Send a notification message to Slack channel: ${channel.name}`,
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to send to the Slack channel",
            },
            title: {
              type: "string",
              description: "Optional title for the message (will be bolded)",
            },
            color: {
              type: "string",
              description: "Optional color for the message sidebar (good, warning, danger, or hex color)",
              enum: ["good", "warning", "danger"],
            },
          },
          required: ["message"],
        },
      }));

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Extract channel ID from tool name
      const match = name.match(/^slack_notify_(.+)$/);
      if (!match) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Unknown tool: ${name}`
        );
      }

      const channelId = match[1];
      const channel = this.channels[channelId];

      if (!channel) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Channel not found: ${channelId}`
        );
      }

      try {
        const result = await this.sendSlackMessage(channel, args);
        return {
          content: [
            {
              type: "text",
              text: `Successfully sent message to ${channel.name} channel`,
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to send Slack message: ${error.message}`
        );
      }
    });
  }

  async sendSlackMessage(channel, { message, title, color }) {
    const payload = {
      text: title ? `*${title}*\n${message}` : message,
    };

    // Add color if specified
    if (color) {
      payload.attachments = [{
        color: color,
        text: message,
        ...(title && { pretext: `*${title}*` })
      }];
      // Remove the main text since it's in the attachment
      payload.text = title || "";
    }

    const response = await fetch(channel.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack API error: ${response.status} - ${errorText}`);
    }

    return response;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Slack Notification MCP server running on stdio");
  }
}

const server = new SlackNotificationServer();
server.run().catch(console.error);
