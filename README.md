# n8n-nodes-nordstellar

This is an [n8n](https://n8n.io) community node. It lets you use the **NordStellar Integration API** in your n8n workflows.

NordStellar is a threat exposure management platform. This node wraps the public Integration API so you can pull projects and security events (data breaches, malware infections, dark web posts, attack surface vulnerabilities, and more) and resolve events directly from n8n.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

In n8n: **Settings → Community Nodes → Install**, then enter `@nordstellar/n8n-nodes-nordstellar`.

## Credentials

The node authenticates with a machine-to-machine **JWT access token** issued by the NordStellar Platform. Create a credential of type **NordStellar Integration API** and provide:

- **Base URL** – base URL of the Integration API (default `https://platform-integration-api.nordstellar.com`). Must be an HTTPS URL on a `nordstellar.com` domain.
- **Access Token** – the JWT generated via the IAM `POST /iam/v1/organizations/{id}/clients/{client-id}/tokens` endpoint. It is sent as `Authorization: Bearer <token>`.

## Operations

### Project

- **Get Many** – `GET /v3/projects`

### Event

- **Get Many** – `GET /v3/projects/{projectId}/events` (with optional `date-added-from` / `date-added-to` filters and pagination)
- **Get** – `GET /v3/events/{type}/{eventId}` for a specific event type
- **Resolve** – `PATCH /v3/events/{eventId}/is_resolved`

Supported event types for **Get**: data breach, malware infection, combo list, consumer credential, domain permutation, dark web forum/telegram/ransomware/marketplace posts, and attack surface DNS / network service / web application vulnerabilities.

## Development

Requires **Node.js 22** (see `.nvmrc`; this is the version n8n itself requires). With
[nvm](https://github.com/nvm-sh/nvm): `nvm use`.

```sh
npm install
npm run build
npm run lint
```

### Testing locally

```sh
npm run dev
```

`n8n-node dev` starts a local n8n instance with this node loaded and rebuilds on changes. When
it prints the URL, open **http://localhost:5678**, create a *NordStellar Integration API*
credential (base URL is pre-filled; paste your JWT access token), then add a **NordStellar** node
and run e.g. *Project → Get Many*.

### Publishing

Publishing to npm runs automatically via GitHub Actions (`.github/workflows/publish.yml`) when a
GitHub Release is published. It publishes with [provenance](https://docs.npmjs.com/generating-provenance-statements),
as required for verified community nodes. Set the `NPM_TOKEN` repository secret first.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Submit community nodes](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/)
- [Verified community node guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/)

## License

[MIT](LICENSE.md)
