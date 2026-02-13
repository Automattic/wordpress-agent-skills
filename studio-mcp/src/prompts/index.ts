import { registerInspectSitePrompt } from './inspect-site.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPrompts( server: McpServer ) {
	registerInspectSitePrompt( server );
}
