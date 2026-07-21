# n8n-nodes-nordstellar

This is an [n8n](https://n8n.io) community node. It lets you use the **NordStellar Integration API** in your n8n workflows.

NordStellar is a threat exposure management platform. This node lets you pull projects and security events (data breaches, malware infections, dark web posts, attack surface vulnerabilities, and more) and resolve events directly from n8n.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

In n8n: **Settings → Community Nodes → Install**, then enter `n8n-nodes-nordstellar`.

## Credentials

Create a credential of type **NordStellar Integration API** and provide:

- **Base URL** – base URL of the Integration API (default `https://platform-integration-api.nordstellar.com`). Must be an HTTPS URL on a `nordstellar.com` domain.
- **Access Token** – access token generated in the NordStellar platform. See the [Integration API docs](https://docs.nordstellar.com/platform/integrations-api) for how to set it up.

## Operations

### Project

- **Get Many** – list the projects available to your organization

### Event

- **Get Many** – list events for a project, with optional date-range filters and pagination
- **Get** – retrieve full details of a single event by its type and ID
- **Resolve** – mark an event as resolved, or reopen it

Supported event types for **Get**: data breach, malware infection, combo list, consumer credential, domain permutation, dark web forum/telegram/ransomware/marketplace posts, and attack surface DNS / network service / web application vulnerabilities.

See the [Integration API docs](https://docs.nordstellar.com/platform/integrations-api) for the full API reference, including response fields.

## Resources

- [NordStellar Integration API docs](https://docs.nordstellar.com/platform/integrations-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
