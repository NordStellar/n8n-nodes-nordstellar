import {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodePropertyOptions,
	NodeOperationError,
	PreSendAction,
} from 'n8n-workflow';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const EVENT_TYPE_OPTIONS: INodePropertyOptions[] = [
	{
		name: 'Attack Surface DNS Vulnerability',
		value: 'attack-surface-dns-vulnerabilities',
	},
	{
		name: 'Attack Surface Network Service Vulnerability',
		value: 'attack-surface-network-service-vulnerabilities',
	},
	{
		name: 'Attack Surface Web Application Vulnerability',
		value: 'attack-surface-web-application-vulnerabilities',
	},
	{ name: 'Combo List', value: 'combo-lists' },
	{ name: 'Consumer Credential', value: 'consumer-credentials' },
	{ name: 'Dark Web Forum Post', value: 'dark-web-forum-posts' },
	{ name: 'Dark Web Marketplace Post', value: 'dark-web-marketplace-posts' },
	{ name: 'Dark Web Ransomware Post', value: 'dark-web-ransomware-posts' },
	{ name: 'Dark Web Telegram Post', value: 'dark-web-telegram-posts' },
	{ name: 'Data Breach', value: 'data-breaches' },
	{ name: 'Domain Permutation', value: 'domain-permutations' },
	{ name: 'Malware Infection', value: 'malware-infections' },
];

/**
 * Returns a preSend action that validates that each named node parameter is a
 * GUID before the request is sent. Prevents path manipulation via values like
 * "../../../" being interpolated into the request URL.
 */
export function validateUuidParameters(...parameterNames: string[]): PreSendAction {
	return async function (
		this: IExecuteSingleFunctions,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		for (const parameterName of parameterNames) {
			const value = String(this.getNodeParameter(parameterName, ''));
			if (!UUID_PATTERN.test(value)) {
				throw new NodeOperationError(
					this.getNode(),
					`Parameter "${parameterName}" must be a valid GUID, e.g. "123e4567-e89b-12d3-a456-426614174000".`,
				);
			}
		}
		return requestOptions;
	};
}

/**
 * preSend action that validates the eventType parameter against the known
 * event type slugs. The field is a dropdown in the UI, but expression mode
 * would otherwise allow arbitrary strings into the request path.
 */
export const validateEventType: PreSendAction = async function (
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const value = String(this.getNodeParameter('eventType', ''));
	const isKnownEventType = EVENT_TYPE_OPTIONS.some((option) => option.value === value);
	if (!isKnownEventType) {
		throw new NodeOperationError(this.getNode(), `"${value}" is not a supported event type.`);
	}
	return requestOptions;
};
