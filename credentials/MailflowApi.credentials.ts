import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MailflowApi implements ICredentialType {
	name = 'mailflowApi';
	displayName = 'Mailflow API';
	documentationUrl = 'https://mailflow.cc';

	properties: INodeProperties[] = [
		{
			displayName: 'MailFlow API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			placeholder: 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			description: 'Your Mailflow API Key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
