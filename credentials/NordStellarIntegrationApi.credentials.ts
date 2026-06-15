import {
	Icon,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NordStellarIntegrationApi implements ICredentialType {
	name = 'nordStellarIntegrationApi';

	displayName = 'NordStellar Integration API';

	documentationUrl = 'https://docs.nordstellar.com';

	icon: Icon = 'file:nordStellar.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://platform-integration-api.nordstellar.com',
			required: true,
			placeholder: 'https://platform-integration-api.nordstellar.com',
			description: 'Base URL of the NordStellar Integration API (without trailing slash)',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Machine-to-machine JWT generated via the IAM API. Sent as a Bearer token in the Authorization header.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}/v3',
			url: '/projects',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}
