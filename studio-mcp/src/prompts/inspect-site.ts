import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerInspectSitePrompt( server: McpServer ) {
	server.registerPrompt(
		'studio_inspect_site',
		{
			title: 'Studio: Inspect site',
			description:
				'Inspect a local Studio WordPress site: list files, detect theme and plugins, and summarize configuration.',
			argsSchema: {
				sitePath: z.string().describe( 'Absolute path to the Studio site root folder to inspect.' ),
			},
		},
		async ( { sitePath } ) => {
			return {
				messages: [
					{
						role: 'user',
						content: {
							type: 'text',
							text:
								`You are inspecting a local WordPress site managed by Studio.\n\n` +
								`Site path:\n` +
								`${ sitePath }\n\n` +
								`Follow this workflow strictly:\n` +
								`1) Call tool "studio_fs_list_dir" with { sitePath }.\n` +
								`2) Identify wp-content/themes and wp-content/plugins.\n` +
								`3) List installed plugins (folder names).\n` +
								`4) If useful, read wp-config.php (do NOT expose secrets).\n` +
								`5) Try to retrieve useful and only important information.\n` +
								`6) Summarize findings clearly for the user.\n\n` +
								`Rules:\n` +
								`- Do not modify files.\n` +
								`- Do not expose secrets (DB passwords, salts).\n` +
								`- Prefer reading small files only.\n`,
						},
					},
				],
			};
		}
	);
}
