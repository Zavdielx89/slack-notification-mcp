# 🚀 Slack Notification MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io/)
[![GitHub stars](https://img.shields.io/github/stars/Zavdielx89/slack-notification-mcp)](https://github.com/Zavdielx89/slack-notification-mcp/stargazers)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Development-orange?logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/zavdielx)

> **Transform your Claude AI workflows with instant Slack notifications!** 

A powerful Model Context Protocol (MCP) server that seamlessly connects Claude AI with Slack, enabling real-time notifications for task completions, alerts, and workflow automation. Never miss important updates from your AI assistant again!

## ✨ Why This MCP Server?

- **🤖 Claude Integration**: Built specifically for Claude AI via the Model Context Protocol
- **⚡ Instant Notifications**: Get real-time updates when Claude completes tasks
- **🎯 Multi-Channel Support**: Send targeted messages to different Slack channels  
- **🎨 Rich Formatting**: Support for titles, colors, and message styling
- **🔧 Zero Config Hassle**: Simple JSON configuration gets you running in minutes
- **🚀 Lightweight**: Fast Node.js implementation with minimal dependencies

## 🛠️ Features

- 🚀 Dynamic tool creation based on your configured Slack channels
- 📱 Support for rich message formatting (titles, colors)
- ⚡ Fast and lightweight Node.js implementation
- 🔧 Easy configuration via JSON file
- 🎯 Separate tools for each channel for precise control

## 🎯 Perfect For

- **AI Workflow Automation**: Get notified when Claude finishes long-running tasks
- **Development Teams**: Automate deployment notifications and error alerts  
- **Data Analysis**: Receive updates when data processing completes
- **Content Creation**: Get alerts when Claude finishes writing or research tasks
- **System Monitoring**: Send formatted alerts for system status updates
- **Project Management**: Automate status updates to project channels

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/Zavdielx89/slack-notification-mcp.git
cd slack-notification-mcp
npm install

# 2. Configure your Slack webhooks
cp config.example.json config.json
# Edit config.json with your webhook URLs

# 3. Add to your Claude Desktop config
# See detailed setup instructions below
```

## 📋 Setup

### 1. Install Dependencies

```bash
cd ~/code/workflows/Slack-Notification-MCP
npm install
```

### 2. Create Slack Webhooks

For each Slack channel you want to send notifications to:

1. Go to your Slack workspace
2. Navigate to **Apps** > **Manage** > **Custom Integrations** > **Incoming Webhooks**
3. Or visit: `https://[your-workspace].slack.com/apps/manage/custom-integrations`
4. Click **Add to Slack**
5. Choose the channel you want to send notifications to
6. Copy the **Webhook URL**

### 3. Configure Channels

Create a `config.json` file in the project directory:

```bash
cp config.example.json config.json
```

Edit `config.json` with your actual Slack webhook URLs:

```json
{
  "channels": {
    "general": {
      "name": "General",
      "webhook_url": "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    },
    "notifications": {
      "name": "Task Notifications",
      "webhook_url": "https://hooks.slack.com/services/T11111111/B11111111/YYYYYYYYYYYYYYYYYYYYYYYY"
    },
    "alerts": {
      "name": "System Alerts",
      "webhook_url": "https://hooks.slack.com/services/T22222222/B22222222/ZZZZZZZZZZZZZZZZZZZZZZZZ"
    }
  }
}
```

### 4. Add to MCP Settings

Add this server to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "slack-notifications": {
      "command": "node",
      "args": ["/Users/zavdielx/code/workflows/Slack-Notification-MCP/index.js"]
    }
  }
}
```

### 5. Restart Claude Desktop

Restart your Claude Desktop application to load the new MCP server.

## Usage

Once configured, you'll have access to tools for each channel you configured. For example, if you configured channels named "general", "notifications", and "alerts", you'll see these tools:

- `slack_notify_general`
- `slack_notify_notifications` 
- `slack_notify_alerts`

### Basic Message

```
Use the slack_notify_notifications tool to send a message "Task completed successfully!"
```

### Message with Title

```
Send a notification to the general channel with title "Build Complete" and message "The deployment finished without errors"
```

### Colored Message

```
Send an alert to the alerts channel with title "Error Detected", message "API endpoint is returning 500 errors", and color "danger"
```

## Tool Parameters

Each `slack_notify_*` tool accepts these parameters:

- **message** (required): The main message content
- **title** (optional): A bold title that appears before the message
- **color** (optional): Color for the message sidebar
  - `"good"` - Green (success)
  - `"warning"` - Yellow (warning)  
  - `"danger"` - Red (error)

## Example Workflows

### Task Completion Notifications

```
After completing a long analysis, send a message to notifications channel: "Data analysis complete. Found 15 anomalies in the dataset. Report ready for review."
```

### Error Alerts

```
If an error occurs, send a danger-colored alert to the alerts channel with title "Processing Error" and message "Failed to process user upload: invalid file format"
```

### Status Updates

```
Send a good-colored message to general channel with title "System Update" and message "All services are running normally after the maintenance window"
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with file watching for automatic restarts.

### Adding New Channels

1. Create a new Slack webhook for the channel
2. Add the channel configuration to `config.json`
3. Restart the MCP server
4. The new `slack_notify_[channel_id]` tool will be automatically available

### Testing

You can test the server directly:

```bash
npm start
```

The server will run and wait for MCP protocol messages on stdin/stdout.

## Troubleshooting

### "Config file not found" Error

Make sure you've created `config.json` in the project directory with valid Slack webhook URLs.

### "Failed to send Slack message" Error

- Verify your webhook URLs are correct
- Check that the Slack webhooks are still active
- Ensure the channels still exist in your Slack workspace

### Tools Not Appearing in Claude

- Verify the MCP server path in your Claude configuration
- Restart Claude Desktop after making configuration changes
- Check that Node.js is installed and accessible

## Security Notes

- Keep your `config.json` file secure and don't commit webhook URLs to version control
- Webhook URLs provide direct access to post in your Slack channels
- Consider using environment variables for webhook URLs in production environments

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs or request features via [GitHub Issues](https://github.com/Zavdielx89/slack-notification-mcp/issues)
- 🔀 Submit pull requests for improvements
- ⭐ Star the repository if you find it useful
- 📢 Share it with others who might benefit

## ☕ Support This Project

If this MCP server saves you time or enhances your Claude AI workflows, consider supporting its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Development-orange?logo=buy-me-a-coffee&logoColor=white&style=for-the-badge)](https://buymeacoffee.com/zavdielx)

Your support helps me:
- 🚀 Add new features and improvements
- 🐛 Fix bugs and provide support
- 📚 Create better documentation
- 🎯 Build more useful MCP servers for the community

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - Learn more about MCP
- [Claude Desktop](https://claude.ai/desktop) - Official Claude desktop application
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Collection of official MCP servers

## 📈 Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Zavdielx89/slack-notification-mcp)
![GitHub last commit](https://img.shields.io/github/last-commit/Zavdielx89/slack-notification-mcp)
![GitHub issues](https://img.shields.io/github/issues/Zavdielx89/slack-notification-mcp)

---

**Made with ❤️ for the Claude AI community**

If this project helps you stay connected with your AI workflows, consider giving it a ⭐!

## License

MIT License - feel free to use and modify as needed!
