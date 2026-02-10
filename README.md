# n8n-nodes-mailflow

This is an n8n community node. It lets you use [Mailflow](https://mailflow.cc) in your n8n workflows.

Mailflow is an email notification service that provides API-based email webhook parsing and notification delivery.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Install

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-mailflow` and click **Install**

### Manual Install

```bash
npm install n8n-nodes-mailflow
```

## Operations

### Webhook Mapping

| Operation | Description |
|-----------|-------------|
| **Parse Webhook Data** | Parse email data submitted via webhook, extracting fields: `from`, `to`, `subject`, `text`, `receivedAt`, `mailboxId` |

### Notification

| Operation | Description |
|-----------|-------------|
| **Send Notification** | Send a notification via Mailflow API with `workspace_id`, `subject`, and `body` |

## Credentials

To use the **Notification** resource, you need to configure Mailflow API credentials:

1. Sign up at [mailflow.cc](https://mailflow.cc) and obtain your API Key
2. In n8n, go to **Credentials > New Credential**
3. Search for **Mailflow API**
4. Enter your API Key (format: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
5. Save the credential

> **Note:** The Webhook Mapping resource does not require API credentials — it only parses incoming webhook data.

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested on:** n8n latest (Docker)

## Usage

### Example 1: Parse Incoming Email Webhooks

1. Add a **Webhook** trigger node
2. Connect a **Mailflow** node
3. Select Resource: **Webhook Mapping**
4. Select Operation: **Parse Webhook Data**
5. The node will automatically map incoming webhook fields (`from`, `to`, `subject`, `text`, etc.)

This is useful when you receive email events from an external service via webhook and want to extract structured email data for downstream processing.

### Example 2: Send Notifications

1. Add any trigger node (e.g., Webhook, Schedule, etc.)
2. Connect a **Mailflow** node
3. Select Resource: **Notification**
4. Select Operation: **Send Notification**
5. Configure your **Workspace ID**, **Subject**, and **Body**
6. Make sure you have configured the **Mailflow API** credential

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Mailflow Official Website](https://mailflow.cc)
- [GitHub Repository](https://github.com/shwanShare/n8n-nodes-mailflow)

## Version History

### 0.1.0 (Initial Release)

- Webhook Mapping: Parse webhook email data
- Notification: Send notifications via Mailflow API
- Mailflow API credential support (Bearer Token)
