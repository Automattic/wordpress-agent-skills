import { formatCliFailure, runStudioCli } from '../lib/studio-cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerSiteTools( server: McpServer ) {
	server.registerTool(
		'studio_site_list',
		{
			description: 'List all local WordPress Studio sites (wraps `studio site list`).',
		},
		async () => {
			const res = await runStudioCli( [ 'site', 'list', '--format=json' ] );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio site list', res ),
						},
					],
				};
			}

			let sites;
			try {
				sites = JSON.parse( res.stdout.trim() );
			} catch {
				return {
					content: [
						{
							type: 'text',
							text: 'Failed to parse site list output from Studio CLI. The response was not valid JSON.',
						},
					],
				};
			}

			const structuredContent = { sites };

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify( structuredContent, null, 2 ),
					},
				],
				structuredContent,
			};
		}
	);

	server.registerTool(
		'studio_site_status',
		{
			description:
				'Get detailed status of a Studio site including PHP version, WP version, and Xdebug status (wraps `studio site status`).',
			inputSchema: {
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
			},
		},
		async ( { path } ) => {
			const res = await runStudioCli( [ 'site', 'status', '--path', path, '--format=json' ] );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio site status', res ),
						},
					],
				};
			}

			let status;
			try {
				status = JSON.parse( res.stdout.trim() );
			} catch {
				return {
					content: [
						{
							type: 'text',
							text: 'Failed to parse site status output from Studio CLI. The response was not valid JSON.',
						},
					],
				};
			}

			delete status[ 'Admin password' ];

			const structuredContent = { status };

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify( structuredContent, null, 2 ),
					},
				],
				structuredContent,
			};
		}
	);

	server.registerTool(
		'studio_site_start',
		{
			description:
				'Start a Studio site (wraps `studio site start`). Returns site URL and admin username.',
			inputSchema: {
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
			},
		},
		async ( { path } ) => {
			const res = await runStudioCli( [
				'site',
				'start',
				'--path',
				path,
				'--skip-browser', // don't open browser (not useful for MCP)
			] );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio site start', res ),
						},
					],
				};
			}

			// Sanitize password from output
			const sanitizedOutput = res.stdout.replace( /Password:\s*.+/gi, 'Password: [REDACTED]' );

			return {
				content: [
					{
						type: 'text',
						text: sanitizedOutput.trim(),
					},
				],
			};
		}
	);

	server.registerTool(
		'studio_site_stop',
		{
			description: 'Stop a Studio site or all sites (wraps `studio site stop`).',
			inputSchema: {
				path: z.string().optional().describe( 'Path to the root directory of a Studio site.' ),
				all: z.boolean().optional().describe( 'Stop all sites (default: false).' ),
			},
		},
		async ( { path, all } ) => {
			if ( ! path && ! all ) {
				return {
					content: [
						{
							type: 'text',
							text: 'Must provide either path or all=true',
						},
					],
				};
			}

			const args = [ 'site', 'stop' ];
			if ( path ) args.push( '--path', path );
			if ( all ) args.push( '--all' );

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio site stop', res ),
						},
					],
				};
			}

			return {
				content: [
					{
						type: 'text',
						text: res.stdout.trim() || ( all ? 'All sites stopped' : `Site at ${ path } stopped` ),
					},
				],
			};
		}
	);

	server.registerTool(
		'studio_site_delete',
		{
			description:
				'Delete a Studio site. Destructive: requires confirm=true. Optionally move site files to trash.',
			inputSchema: {
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
				files: z
					.boolean()
					.optional()
					.describe(
						'Also move site files to trash (default: false). If false, only removes from Studio but folder remains.'
					),
				confirm: z.boolean().describe( 'Must be true to actually delete.' ),
			},
		},
		async ( { path, files, confirm } ) => {
			if ( ! confirm ) {
				return {
					content: [
						{
							type: 'text',
							text:
								`Refusing to delete site at "${ path }" because confirm=false.\n` +
								`Re-run with confirm=true if you're sure.`,
						},
					],
				};
			}

			const args = [ 'site', 'delete', '--path', path ];
			if ( files ) args.push( '--files' );

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio site delete', res ),
						},
					],
				};
			}

			return {
				content: [
					{
						type: 'text',
						text: `Site deleted${ files ? ' (files moved to trash)' : '' }`,
					},
				],
			};
		}
	);

	server.registerTool(
		'studio_site_create',
		{
			description: 'Create a new Studio site (wraps `studio site create`).',
			inputSchema: {
				path: z
					.string()
					.describe(
						'Path to where the new site should be located (preferably default location as /Users/<USERNAME>/Studio/...) or which existing site should be used as a base.'
					),
				name: z.string().optional().describe( 'Site name.' ),
				wp: z
					.string()
					.optional()
					.describe( 'WordPress version (e.g., "latest", "6.4", "6.4.1"). Default: "latest".' ),
				php: z
					.enum( [ '8.4', '8.3', '8.2', '8.1', '8.0', '7.4', '7.3', '7.2' ] )
					.optional()
					.describe( 'PHP version. Default: "8.3".' ),
				blueprint: z.string().optional().describe( 'Path or URL to Blueprint JSON file.' ),
			},
		},
		async ( { path, name, wp, php, blueprint } ) => {
			// Validate blueprint parameter
			if ( blueprint ) {
				const lower = blueprint.toLowerCase();
				if ( lower.startsWith( 'file://' ) ) {
					return {
						content: [
							{
								type: 'text',
								text: 'Blueprint URLs with the file:// scheme are not allowed.',
							},
						],
					};
				}
				if ( lower.startsWith( 'http://' ) || lower.startsWith( 'https://' ) ) {
					try {
						new URL( blueprint );
					} catch {
						return {
							content: [
								{
									type: 'text',
									text: `Blueprint URL is not valid: ${ blueprint }`,
								},
							],
						};
					}
				}
			}

			const args = [ 'site', 'create', '--path', path, '--skip-browser' ];

			if ( name ) args.push( '--name', name );
			if ( wp ) args.push( '--wp', wp );
			if ( php ) args.push( '--php', php );
			if ( blueprint ) args.push( '--blueprint', blueprint );

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio site create', res ),
						},
					],
				};
			}

			// Sanitize password from output
			const sanitizedOutput = res.stdout.replace( /Password:\s*.+/gi, 'Password: [REDACTED]' );

			return {
				content: [
					{
						type: 'text',
						text: sanitizedOutput.trim() || 'Site created',
					},
				],
			};
		}
	);

	server.registerTool(
		'studio_site_set',
		{
			description: 'Configure site settings (wraps `studio site set`).',
			inputSchema: {
				path: z.string().describe( 'Path to the root directory of a Studio site.' ),
				name: z.string().optional().describe( 'Site name.' ),
				domain: z
					.string()
					.regex( /^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.local$/ )
					.optional()
					.describe(
						'Custom domain (must end with .local, lowercase alphanumeric and hyphens only). May require system password to modify /etc/hosts.'
					),
				https: z.boolean().optional().describe( 'Enable HTTPS (requires custom domain).' ),
				php: z
					.enum( [ '8.4', '8.3', '8.2', '8.1', '8.0', '7.4', '7.3', '7.2' ] )
					.optional()
					.describe( 'PHP version.' ),
				wp: z.string().optional().describe( 'WordPress version.' ),
				xdebug: z.boolean().optional().describe( 'Enable Xdebug (beta feature).' ),
			},
		},
		async ( { path, name, domain, https, php, wp, xdebug } ) => {
			const args = [ 'site', 'set', '--path', path ];

			if ( name ) args.push( '--name', name );
			if ( domain ) args.push( '--domain', domain );
			if ( https ) args.push( '--https' );
			if ( php ) args.push( '--php', php );
			if ( wp ) args.push( '--wp', wp );
			if ( xdebug !== undefined ) args.push( '--xdebug', String( xdebug ) );

			const res = await runStudioCli( args );

			if ( res.exitCode !== 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: formatCliFailure( 'studio site set', res ),
						},
					],
				};
			}

			return {
				content: [
					{
						type: 'text',
						text: res.stdout.trim() || 'Site settings updated',
					},
				],
			};
		}
	);
}
