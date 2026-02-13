import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readAppData } from '../lib/appdata';

export function registerAppDataResources( server: McpServer ) {
	server.registerResource(
		'studio_appdata',
		'studio://appdata',
		{
			description:
				'Read-only Studio app data from appdata-v1.json. Use as fallback when CLI output lacks fields (e.g., wp-theme which is used for specific site).',
			mimeType: 'application/json',
		},
		async ( uri ) => {
			const appdata = await readAppData();

			const response: Record< string, any > = {
				locale: appdata.locale,
				betaFeatures: appdata.betaFeatures,
				currentStudioVersion: appdata.lastSeenVersion,
			};

			response.sites = appdata.sites.map( ( site: any ) => {
				const { adminPassword, ...rest } = site;

				return rest;
			} );

			response.previews = appdata.snapshots.map( ( snapshot: any ) => {
				const { adminPassword, ...rest } = snapshot;

				return rest;
			} );

			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify( response, null, 2 ),
					},
				],
			};
		}
	);
}
