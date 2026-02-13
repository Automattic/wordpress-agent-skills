import { registerAppDataResources } from './appdata';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources( server: McpServer ) {
	registerAppDataResources( server );
}
