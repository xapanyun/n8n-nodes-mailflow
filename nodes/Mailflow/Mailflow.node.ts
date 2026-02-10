import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError } from 'n8n-workflow';

export class Mailflow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mailflow',
		name: 'mailflow',
		icon: 'fa:envelope',
		group: ['transform', 'output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Mailflow API',
		defaults: {
			name: 'Mailflow',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'mailflowApi',
				required: true,
				displayOptions: {
					show: {
						resource: ['notification'],
					},
				},
			},
		],
		properties: [
			// ============ Resource Selection ============
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Webhook Mapping',
						value: 'email',
					},
					{
						name: 'Notification',
						value: 'notification',
					},
				],
				default: 'email',
			},

			// ============ Email Operations ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['email'],
					},
				},
				options: [
					{
						name: 'Parse Webhook Data',
						value: 'parseWebhook',
						description: 'Parse email data submitted via webhook',
						action: 'Parse webhook data',
					},
				],
				default: 'parseWebhook',
			},

			// ============ Notification Operations ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['notification'],
					},
				},
				options: [
					{
						name: 'Send Notification',
						value: 'send',
						description: 'Send a notification via Mailflow API',
						action: 'Send a notification',
					},
				],
				default: 'send',
			},

			// ============ Webhook Mapping Parameters ============
			{
				displayName: 'From',
				name: 'mapFrom',
				type: 'string',
				default: '={{ $json.body?.from || $json.from }}',
				description: 'Sender email address',
				placeholder: '{{ $json.from }}',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['parseWebhook'],
					},
				},
			},
			{
				displayName: 'To',
				name: 'mapTo',
				type: 'string',
				default: '={{ $json.body?.to || $json.to }}',
				description: 'Recipient email address',
				placeholder: '{{ $json.to }}',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['parseWebhook'],
					},
				},
			},
			{
				displayName: 'Subject',
				name: 'mapSubject',
				type: 'string',
				default: '={{ $json.body?.subject || $json.subject }}',
				description: 'Email subject line',
				placeholder: '{{ $json.subject }}',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['parseWebhook'],
					},
				},
			},
			{
				displayName: 'Text',
				name: 'mapText',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '={{ $json.body?.text || $json.text }}',
				description: 'Email body content',
				placeholder: '{{ $json.text }}',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['parseWebhook'],
					},
				},
			},
			{
				displayName: 'Received At',
				name: 'mapReceivedAt',
				type: 'string',
				default: '={{ $json.body?.receivedAt || $json.receivedAt }}',
				description: 'Timestamp when the email was received',
				placeholder: '{{ $json.receivedAt }}',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['parseWebhook'],
					},
				},
			},
			{
				displayName: 'Mailbox ID',
				name: 'mapMailboxId',
				type: 'string',
				default: '={{ $json.body?.mailboxId || $json.mailboxId }}',
				description: 'The mailbox identifier',
				placeholder: '{{ $json.mailboxId }}',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['parseWebhook'],
					},
				},
			},

			// ============ Notification Parameters ============
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				default: '={{ $json.body?.workspace_id || $json.workspace_id || $json.body?.mailboxId || $json.mailboxId }}',
				description: 'The workspace identifier',
				placeholder: '{{ $json.workspace_id }}',
				displayOptions: {
					show: {
						resource: ['notification'],
						operation: ['send'],
					},
				},
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '={{ $json.body?.subject || $json.subject }}',
				description: 'Notification subject',
				placeholder: '{{ $json.subject }}',
				displayOptions: {
					show: {
						resource: ['notification'],
						operation: ['send'],
					},
				},
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '={{ $json.body?.text || $json.text || $json.body}}',
				description: 'Notification text',
				placeholder: '{{ $json.body }}',
				displayOptions: {
					show: {
						resource: ['notification'],
						operation: ['send'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				// ============ Email: Parse Webhook ============
				if (resource === 'email' && operation === 'parseWebhook') {
					returnData.push({
						json: {
							from: this.getNodeParameter('mapFrom', i, '') as string,
							to: this.getNodeParameter('mapTo', i, '') as string,
							subject: this.getNodeParameter('mapSubject', i, '') as string,
							text: this.getNodeParameter('mapText', i, '') as string,
							receivedAt: this.getNodeParameter('mapReceivedAt', i, '') as string,
							mailboxId: this.getNodeParameter('mapMailboxId', i, '') as string,
						},
					});
				}

				// ============ Notification: Send ============
				if (resource === 'notification' && operation === 'send') {
					const credentials = await this.getCredentials('mailflowApi');

					const workspaceId = this.getNodeParameter('workspaceId', i) as string;
					const subject = this.getNodeParameter('subject', i) as string;
					const body = this.getNodeParameter('body', i) as string;

					const requestBody = {
						workspace_id: workspaceId,
						subject: subject,
						body: body,
						is_html: false,
					};

					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: 'https://mailflow.cc/api/v1/notifications',
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
						returnFullResponse: true,
					});

					returnData.push({
						json: {
							success: true,
							statusCode: response.statusCode,
							data: response.body,
						},
					});
				}

			} catch (error: any) {
				let errorMessage = error.message || 'Unknown error';
				let errorDetails: any = {};

				if (error.response) {
					errorDetails = {
						statusCode: error.response.status || error.response.statusCode,
						body: error.response.data || error.response.body,
					};
					errorMessage = `API Error ${errorDetails.statusCode}: ${JSON.stringify(errorDetails.body)}`;
				}

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							success: false,
							error: errorMessage,
							details: errorDetails,
						},
					});
					continue;
				}

				throw new NodeApiError(this.getNode(), error, {
					message: errorMessage,
					description: `Request failed. Details: ${JSON.stringify(errorDetails)}`,
				});
			}
		}

		return [returnData];
	}
}
