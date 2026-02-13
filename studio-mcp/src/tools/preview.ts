import { z } from 'zod';
import { formatCliFailure, runStudioCli, extractFirstWpBuildUrl } from '../lib/studio-cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPreviewTools( server: McpServer ) {
	server.registerTool(
		'studio_preview_list',
		{
			description: 'List Studio preview sites for a given path of the original Studio site.',
			inputSchema: {
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
			},
		},
		async ( { path } ) => {
			const args = [ 'preview', 'list', '--format=json' ];
			args.push( '--path', path );

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [ { type: 'text', text: formatCliFailure( 'studio preview list', res ) } ],
				};
			}

			let previews;
			try {
				previews = JSON.parse( res.stdout.trim() );
			} catch {
				return {
					content: [
						{
							type: 'text',
							text: 'Failed to parse preview list output from Studio CLI. The response was not valid JSON.',
						},
					],
				};
			}

			const structuredContent = { previews };

			return {
				content: [ { type: 'text', text: JSON.stringify( structuredContent, null, 2 ) } ],
				structuredContent,
			};
		}
	);

	server.registerTool(
		'studio_preview_create',
		{
			description: 'Create a Studio preview site for a given path of the original Studio site.',
			inputSchema: {
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
			},
		},
		async ( { path } ) => {
			const args = [ 'preview', 'create' ];
			args.push( '--path', path );

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [ { type: 'text', text: formatCliFailure( 'studio preview create', res ) } ],
				};
			}

			// Studio CLI prints the URL to the preview site in the stderr output.
			// TODO: I think we can keep it there, but additionally CLI should print to stdout, with extra information as site name, etc.
			const url = extractFirstWpBuildUrl( res.stderr );

			return {
				content: [
					{
						type: 'text',
						text: url ? `Created preview: ${ url }` : res.stdout.trim() || '(no output)',
					},
				],
			};
		}
	);

	server.registerTool(
		'studio_preview_update',
		{
			description:
				'Update a Studio preview site for a given original site path (wraps `studio preview update <host>`).',
			inputSchema: {
				host: z
					.string()
					.min( 1 )
					.describe( 'Hostname of the preview site to update (the <host> argument).' ),
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
				overwrite: z
					.boolean()
					.optional()
					.describe(
						'Allow updating a preview site from a different folder (maps to --overwrite). Note, the preview site will be deleted for the old site path and created for the new one, but es expected - the host will be preserved.'
					),
			},
		},
		async ( { host, path, overwrite } ) => {
			const args = [ 'preview', 'update', host, '--path', path ];
			if ( overwrite ) args.push( '--overwrite' );

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [ { type: 'text', text: formatCliFailure( 'studio preview update', res ) } ],
				};
			}

			return {
				// stdout doesn't have any information, and it's better to print teh host directly, instead of printing the whole stderr output
				content: [ { type: 'text', text: `Updated preview: ${ host }` || '(no output)' } ],
			};
		}
	);

	server.registerTool(
		'studio_preview_delete',
		{
			description:
				'Delete a Studio preview site by its hostname (e.g. "my-preview-site.wp.build"). Destructive: requires confirm=true.',
			inputSchema: {
				host: z
					.string()
					.min( 1 )
					.describe( 'Preview host to delete (e.g. "my-preview-site.wp.build").' ),
				confirm: z.boolean().describe( 'Must be true to actually delete.' ),
			},
		},
		async ( { host, confirm } ) => {
			if ( ! confirm ) {
				return {
					content: [
						{
							type: 'text',
							text:
								`Refusing to delete preview site "${ host }" because confirm=false.\n` +
								`Re-run with confirm=true if you're sure.`,
						},
					],
				};
			}

			const args = [ 'preview', 'delete', host ];

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [ { type: 'text', text: formatCliFailure( 'studio preview delete', res ) } ],
				};
			}

			return { content: [ { type: 'text', text: `Deleted ${ host } successfully` } ] };
		}
	);
}
