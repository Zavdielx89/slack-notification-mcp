#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs";
import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log("🚀 Slack Notification MCP Setup");
  console.log("================================\n");

  if (existsSync("config.json")) {
    console.log("⚠️  config.json already exists!");
    const overwrite = await question("Do you want to overwrite it? (y/N): ");
    if (!overwrite.toLowerCase().startsWith('y')) {
      console.log("Setup cancelled.");
      rl.close();
      return;
    }
  }

  console.log("Let's configure your Slack channels for notifications.\n");
  console.log("For each channel, you'll need a Slack webhook URL.");
  console.log("Get webhook URLs at: https://[workspace].slack.com/apps/manage/custom-integrations\n");

  const channels = {};
  let addMore = true;

  while (addMore) {
    console.log(`\n📱 Channel ${Object.keys(channels).length + 1} Configuration:`);
    console.log("─".repeat(30));

    const channelId = await question("Channel ID (e.g., 'general', 'notifications'): ");
    if (!channelId) {
      console.log("Channel ID cannot be empty.");
      continue;
    }

    const channelName = await question("Display Name (e.g., 'General', 'Task Notifications'): ");
    const webhookUrl = await question("Slack Webhook URL: ");

    if (!webhookUrl.startsWith("https://hooks.slack.com/")) {
      console.log("⚠️  Warning: This doesn't look like a valid Slack webhook URL");
    }

    channels[channelId] = {
      name: channelName || channelId,
      webhook_url: webhookUrl
    };

    console.log(`✅ Added channel: ${channelName || channelId}`);

    const more = await question("\nAdd another channel? (y/N): ");
    addMore = more.toLowerCase().startsWith('y');
  }

  const config = { channels };

  try {
    writeFileSync("config.json", JSON.stringify(config, null, 2));
    console.log("\n🎉 Configuration saved to config.json!");
    
    console.log("\n📋 Summary:");
    console.log("═".repeat(40));
    Object.entries(channels).forEach(([id, channel]) => {
      console.log(`• ${channel.name} (slack_notify_${id})`);
    });

    console.log("\n🔧 Next steps:");
    console.log("1. Run 'npm install' to install dependencies");
    console.log("2. Add this server to your Claude Desktop MCP configuration");
    console.log("3. Restart Claude Desktop");
    console.log("\nSee README.md for detailed instructions!");

  } catch (error) {
    console.error("❌ Failed to save config:", error.message);
  }

  rl.close();
}

setup().catch(console.error);
