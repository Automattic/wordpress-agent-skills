import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { isStudioSitePath } from '../lib/appdata';
import { resolveInsideRoot, isDirectory } from '../lib/fs-utils';
import { fixBlocksInTemplate } from '../lib/block-fixer';

export function registerBlockFixTools( server: McpServer ) {
	server.registerTool(
		'studio_block_fix',
		{
			description:
				'Fix invalid WordPress block markup in theme template and part files. ' +
				'Reads all .html files in templates/ and parts/ directories, validates block markup, ' +
				'and fixes any invalid blocks in-place. Returns a summary of files processed and fixed.',
			inputSchema: {
				sitePath: z.string().describe( 'Absolute path to the Studio site root folder.' ),
				themeSlug: z
					.string()
					.describe( 'Theme directory name (e.g., "flavor").' ),
			},
		},
		async ( { sitePath, themeSlug } ) => {
			if ( ! ( await isDirectory( sitePath ) ) ) {
				return {
					content: [
						{
							type: 'text',
							text: `sitePath is not a directory or does not exist: ${ sitePath }`,
						},
					],
				};
			}

			if ( ! ( await isStudioSitePath( sitePath ) ) ) {
				return {
					content: [
						{
							type: 'text',
							text: `sitePath is not a known Studio site: ${ sitePath }. Tip: open Studio and ensure the site exists there.`,
						},
					],
				};
			}

			const themeRel = path.join( 'wp-content', 'themes', themeSlug );
			let themeRoot: string;
			try {
				themeRoot = await resolveInsideRoot( sitePath, themeRel );
			} catch ( e: any ) {
				return { content: [ { type: 'text', text: e?.message || 'Unknown error' } ] };
			}

			if ( ! ( await isDirectory( themeRoot ) ) ) {
				return {
					content: [
						{
							type: 'text',
							text: `Theme directory does not exist: ${ themeRel }`,
						},
					],
				};
			}

			// Collect .html files from templates/ and parts/
			const dirs = [ 'templates', 'parts' ];
			const htmlFiles: Array< { relPath: string; absPath: string } > = [];

			for ( const dir of dirs ) {
				const dirPath = path.join( themeRoot, dir );
				if ( ! ( await isDirectory( dirPath ) ) ) {
					continue;
				}

				const entries = await fs.readdir( dirPath, { withFileTypes: true } );
				for ( const entry of entries ) {
					if ( entry.isFile() && entry.name.endsWith( '.html' ) ) {
						htmlFiles.push( {
							relPath: path.join( dir, entry.name ),
							absPath: path.join( dirPath, entry.name ),
						} );
					}
				}
			}

			if ( htmlFiles.length === 0 ) {
				return {
					content: [
						{
							type: 'text',
							text: `No .html files found in templates/ or parts/ for theme "${ themeSlug }".`,
						},
					],
					structuredContent: {
						themeSlug,
						filesProcessed: 0,
						filesFixed: 0,
						issues: [],
					},
				};
			}

			// Process each file
			let filesFixed = 0;
			const allIssues: Array< {
				file: string;
				issues: Array< { blockName: string; issues: string[] } >;
			} > = [];

			for ( const file of htmlFiles ) {
				const content = await fs.readFile( file.absPath, { encoding: 'utf8' } );

				// Skip files without WordPress block markers
				if ( ! content.includes( '<!-- wp:' ) ) {
					continue;
				}

				const result = fixBlocksInTemplate( content );

				if ( result.fixed ) {
					await fs.writeFile( file.absPath, result.html, { encoding: 'utf8' } );
					filesFixed++;
				}

				if ( result.issues.length > 0 ) {
					allIssues.push( {
						file: file.relPath,
						issues: result.issues,
					} );
				}
			}

			const summary = [
				`Block fix complete for theme "${ themeSlug }".`,
				`Files processed: ${ htmlFiles.length }`,
				`Files fixed: ${ filesFixed }`,
			];

			if ( allIssues.length > 0 ) {
				summary.push( `Issues found and fixed:` );
				for ( const fileIssue of allIssues ) {
					for ( const issue of fileIssue.issues ) {
						summary.push(
							`  ${ fileIssue.file }: ${ issue.blockName } — ${ issue.issues.join( ', ' ) }`
						);
					}
				}
			}

			return {
				content: [
					{
						type: 'text',
						text: summary.join( '\n' ),
					},
				],
				structuredContent: {
					themeSlug,
					filesProcessed: htmlFiles.length,
					filesFixed,
					issues: allIssues,
				},
			};
		}
	);
}
