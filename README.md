# Slack Notification MCP Server

A Model Context Protocol (MCP) server that provides tools for sending notifications to Slack channels via webhooks. Perfect for getting notified when Claude tasks complete or for any other notification needs in your workflow.

## Features

- 🚀 Dynamic tool creation based on your configured Slack channels
- 📱 Support for rich message formatting (titles, colors)
- ⚡ Fast and lightweight Node.js implementation
- 🔧 Easy configuration via JSON file
- 🎯 Separate tools for each channel for precise control

## Setup

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

## License

MIT License - feel free to use and modify as needed!
