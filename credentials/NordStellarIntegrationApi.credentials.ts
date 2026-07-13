import {
	Icon,
	IAuthenticate,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

const ALLOWED_DOMAIN = 'nordstellar.com';

const ALLOWED_DOMAINS = `${ALLOWED_DOMAIN}, *.${ALLOWED_DOMAIN}`;

function assertUrlIsAllowed(requestOptions: IHttpRequestOptions): void {
	let targetUrl: URL;
	try {
		targetUrl = new URL(requestOptions.url ?? '', requestOptions.baseURL);
	} catch {
		throw new Error(
			`Invalid request URL "${requestOptions.baseURL ?? ''}${requestOptions.url ?? ''}".`,
		);
	}

	if (targetUrl.protocol !== 'https:') {
		throw new Error(
			`Domain not allowed: the NordStellar credential can only be used over HTTPS, got "${targetUrl.protocol}//".`,
		);
	}

	const hostname = targetUrl.hostname.toLowerCase();
	const isAllowed = hostname === ALLOWED_DOMAIN || hostname.endsWith(`.${ALLOWED_DOMAIN}`);
	if (!isAllowed) {
		throw new Error(
			`Domain not allowed: the NordStellar credential can only be used with ${ALLOWED_DOMAIN} domains, got "${hostname}".`,
		);
	}
}

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
			description:
				'Base URL of the NordStellar Integration API (without trailing slash). Must be an HTTPS URL on a nordstellar.com domain.',
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
		// Declared explicitly (instead of letting n8n auto-inject them with an "All"
		// default) so the credential is locked to nordstellar.com even when used in a
		// generic HTTP Request node, not just this node.
		{
			displayName: 'Allowed HTTP Request Domains',
			name: 'allowedHttpRequestDomains',
			type: 'options',
			options: [
				{
					name: 'All',
					value: 'all',
					description: 'Allow all requests when used in the HTTP Request node',
				},
				{
					name: 'Specific Domains',
					value: 'domains',
					description: 'Restrict requests to specific domains',
				},
				{
					name: 'None',
					value: 'none',
					description: 'Block all requests when used in the HTTP Request node',
				},
			],
			default: 'domains',
			description: 'Control which domains this credential can be used with in HTTP Request nodes',
		},
		{
			displayName: 'Allowed Domains',
			name: 'allowedDomains',
			type: 'string',
			default: ALLOWED_DOMAINS,
			placeholder: 'example.com, *.subdomain.com',
			description: 'Comma-separated list of allowed domains (supports wildcards with *)',
			displayOptions: {
				show: {
					allowedHttpRequestDomains: ['domains'],
				},
			},
		},
	];

	// Function form instead of the declarative IAuthenticateGeneric block: the target
	// URL is validated against the nordstellar.com domain whitelist BEFORE the Bearer
	// token is attached, so a manipulated base URL (SSRF) can never leak the token.
	// Runs for every request that uses this credential, including the credential test
	// and pagination follow-up requests.
	authenticate: IAuthenticate = async (
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> => {
		assertUrlIsAllowed(requestOptions);

		// Defense in depth on newer n8n runtimes: core re-checks the domain on the
		// request and on every redirect hop, and the token never survives a
		// cross-origin redirect. Older runtimes ignore these fields.
		requestOptions.allowedDomains = ALLOWED_DOMAINS;
		requestOptions.sendCredentialsOnCrossOriginRedirect = false;

		requestOptions.headers = {
			...requestOptions.headers,
			Authorization: `Bearer ${credentials.accessToken as string}`,
		};

		return requestOptions;
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
