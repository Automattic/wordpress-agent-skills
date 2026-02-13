import { formatCliFailure, runStudioCli } from '../lib/studio-cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Parse a command string into arguments, respecting quoted strings.
 * Examples:
 *   'option update blogname "Bloom & Blossom"' → ["option", "update", "blogname", "Bloom & Blossom"]
 *   "post create --post_title='My Post'" → ["post", "create", "--post_title=My Post"]
 */
function parseCommand( command: string ): string[] {
	const args: string[] = [];
	const regex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
	let match;

	while ( ( match = regex.exec( command ) ) !== null ) {
		let arg = match[ 0 ];

		// Remove surrounding quotes if the entire arg is quoted
		if (
			( arg.startsWith( '"' ) && arg.endsWith( '"' ) ) ||
			( arg.startsWith( "'" ) && arg.endsWith( "'" ) )
		) {
			arg = arg.slice( 1, -1 );
		}

		// Handle --key="value" or --key='value' patterns
		const keyValueMatch = arg.match( /^(--?\w[\w-]*)=(['"])(.*)\2$/ );
		if ( keyValueMatch ) {
			arg = `${ keyValueMatch[ 1 ] }=${ keyValueMatch[ 3 ] }`;
		}

		args.push( arg );
	}

	return args;
}

export function registerWpCliTools( server: McpServer ) {
	server.registerTool(
		'studio_wp',
		{
			description:
				'Run WP-CLI commands on a Studio site (wraps `studio wp`). Examples: "plugin list", "theme activate flavor", "user list". Supports quoted strings for values with spaces.',
			inputSchema: {
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
				command: z
					.string()
					.describe(
						'WP-CLI command to run (e.g., "plugin list", "option update blogname \\"My Site\\"").'
					),
			},
		},
		async ( { path, command } ) => {
			// Defense-in-depth: reject shell metacharacters before passing to CLI
			if ( /[;|&`$()<>\n\r]/.test( command ) ) {
				return {
					content: [
						{
							type: 'text',
							text:
								'Command contains disallowed shell metacharacters: ; | & ` $ ( ) < > or newlines. ' +
								'Please remove them and try again.',
						},
					],
				};
			}

			const args = [ 'wp', '--path', path, ...parseCommand( command ) ];

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio wp', res ),
						},
					],
				};
			}

			return {
				content: [
					{
						type: 'text',
						text: res.stdout.trim() || '(no output)',
					},
				],
			};
		}
	);
}
