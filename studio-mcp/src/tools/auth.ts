import { formatCliFailure, runStudioCli } from '../lib/studio-cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerAuthTools( server: McpServer ) {
	server.registerTool(
		'studio_auth_status',
		{
			description: 'Check Studio authentication status (wraps `studio auth status`).',
		},
		async () => {
			const res = await runStudioCli( [ 'auth', 'status' ] );

			if ( res.exitCode !== 0 ) {
				return {
					content: [ { type: 'text', text: formatCliFailure( 'studio auth status', res ) } ],
				};
			}

			return { content: [ { type: 'text', text: res.stderr.trim() || '(no output)' } ] };
		}
	);

	server.registerTool(
		'studio_auth_logout',
		{
			description:
				'Log out and clear WordPress.com authentication for Studio (wraps `studio auth logout`).',
		},
		async () => {
			const res = await runStudioCli( [ 'auth', 'logout' ] );

			if ( res.exitCode !== 0 ) {
				return {
					content: [ { type: 'text', text: formatCliFailure( 'studio auth logout', res ) } ],
				};
			}

			return { content: [ { type: 'text', text: res.stderr.trim() || '(no output)' } ] };
		}
	);
}
