import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';

export class NordStellar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NordStellar',
		name: 'nordStellar',
		icon: 'file:nordStellar.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the NordStellar Integration API (v3)',
		defaults: {
			name: 'NordStellar',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'nordStellarIntegrationApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}/v3',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// ----------------------------------
			//             Resource
			// ----------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'event',
			},

			// ----------------------------------
			//          Project: Operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many projects',
						description: 'Retrieve the projects available to the organization',
						routing: {
							request: {
								method: 'GET',
								url: '/projects',
							},
							operations: {
								pagination: {
									type: 'generic',
									properties: {
										continue: '={{ $parameter["returnAll"] && !!$response.body?.next }}',
										request: {
											url: '={{ $response.body.next }}',
										},
									},
								},
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'items',
										},
									},
								],
							},
						},
					},
				],
				default: 'getAll',
			},

			// ----------------------------------
			//           Event: Operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a single event by type',
						description: 'Retrieve full details of an event by its type and ID',
						routing: {
							request: {
								method: 'GET',
								url: '=/events/{{$parameter["eventType"]}}/{{$parameter["eventId"]}}',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many events for a project',
						description: 'List events for a project within a date range',
						routing: {
							request: {
								method: 'GET',
								url: '=/projects/{{$parameter["projectId"]}}/events',
							},
							operations: {
								pagination: {
									type: 'generic',
									properties: {
										continue: '={{ $parameter["returnAll"] && !!$response.body?.next }}',
										request: {
											url: '={{ $response.body.next }}',
										},
									},
								},
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'items',
										},
									},
								],
							},
						},
					},
					{
						name: 'Resolve',
						value: 'resolve',
						action: 'Resolve or reopen an event',
						description: 'Mark an event as resolved or reopened',
						routing: {
							request: {
								method: 'PATCH',
								url: '=/events/{{$parameter["eventId"]}}/is_resolved',
								body: {
									isResolved: '={{$parameter["isResolved"]}}',
								},
							},
						},
					},
				],
				default: 'getAll',
			},

			// ----------------------------------
			//          Shared parameters
			// ----------------------------------
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getAll'],
					},
				},
				description: 'Unique identifier of the project',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				default: 'data-breaches',
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get'],
					},
				},
				options: [
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
				],
				description: 'Type of event to retrieve',
			},
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get', 'resolve'],
					},
				},
				description: 'Unique identifier of the event',
			},
			{
				displayName: 'Resolved',
				name: 'isResolved',
				type: 'boolean',
				default: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['resolve'],
					},
				},
				description: 'Whether the event should be marked as resolved (true) or reopened (false)',
			},

			// ----------------------------------
			//      Event: Get Many filters
			// ----------------------------------
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Date Added From',
						name: 'dateAddedFrom',
						type: 'dateTime',
						default: '',
						description: 'Start datetime for filtering events (ISO 8601)',
						routing: {
							request: {
								qs: {
									'date-added-from': '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Date Added To',
						name: 'dateAddedTo',
						type: 'dateTime',
						default: '',
						description: 'End datetime for filtering events (ISO 8601)',
						routing: {
							request: {
								qs: {
									'date-added-to': '={{$value}}',
								},
							},
						},
					},
				],
			},

			// ----------------------------------
			//   Pagination (Project + Event list)
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['project', 'event'],
						operation: ['getAll'],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['project', 'event'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				description: 'Max number of results to return',
				routing: {
					request: {
						qs: {
							limit: '={{$value}}',
						},
					},
				},
			},
		],
	};
}
