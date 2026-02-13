/**
 * Block Fixer Utility
 *
 * Uses @wordpress/blocks to parse, validate, and fix block HTML.
 * This fixes validation issues caused by AI-generated templates
 * that have style attribute mismatches.
 *
 * Key insight: The parse() function automatically applies validation fixes,
 * so we just need to parse and re-serialize to get clean, validated HTML.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { fixNestedParagraphs } from './paragraph-fixer';
import { parse, serialize, createBlock } from './index';

export interface BlockFixResult {
	html: string;
	fixed: boolean;
	issues: Array< { blockName: string; issues: string[] } >;
}

/**
 * Recursively fix a block and its inner blocks.
 * Invalid blocks are recreated using createBlock() to regenerate clean HTML.
 */
function fixBlockRecursively( block: any ): { block: any; wasFixed: boolean } {
	// First, recursively fix all inner blocks
	let anyInnerFixed = false;
	const fixedInnerBlocks: any[] = [];

	if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
		for ( const innerBlock of block.innerBlocks ) {
			const result = fixBlockRecursively( innerBlock );
			fixedInnerBlocks.push( result.block );
			if ( result.wasFixed ) {
				anyInnerFixed = true;
			}
		}
	}

	// If this block is invalid OR any inner blocks were fixed, recreate it
	if ( ! block.isValid || anyInnerFixed ) {
		if ( ! block.name ) {
			// Can't fix blocks without a name (freeform HTML)
			return { block, wasFixed: false };
		}

		// Recreate the block from its attributes — this generates clean HTML
		const fixedBlock = createBlock(
			block.name,
			block.attributes,
			fixedInnerBlocks.length > 0 ? fixedInnerBlocks : undefined
		);

		return { block: fixedBlock, wasFixed: true };
	}

	// Block is valid and no inner blocks were fixed
	return { block, wasFixed: false };
}

/**
 * Fix block validation issues in template HTML.
 * Invalid blocks are recreated using createBlock() to regenerate clean markup.
 */
export function fixBlocksInTemplate( htmlContent: string ): BlockFixResult {
	try {
		// Apply manual fixes before WordPress block parsing
		const preFixedContent = fixNestedParagraphs( htmlContent );

		// Parse the HTML into blocks
		const blocks = parse( preFixedContent );

		// Check for invalid blocks
		let hadInvalidBlocks = false;
		const issues: Array< { blockName: string; issues: string[] } > = [];

		const collectIssues = ( blockList: any[] ) => {
			for ( const block of blockList ) {
				if ( ! block.isValid ) {
					hadInvalidBlocks = true;
					const blockIssues = block.validationIssues || [];
					if ( blockIssues.length > 0 ) {
						issues.push( {
							blockName: block.name || 'unknown',
							issues: blockIssues.map( ( i: any ) => i.message || String( i ) ),
						} );
					} else {
						issues.push( {
							blockName: block.name || 'unknown',
							issues: [ 'Block marked as invalid' ],
						} );
					}
				}
				if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
					collectIssues( block.innerBlocks );
				}
			}
		};

		collectIssues( blocks );

		if ( ! hadInvalidBlocks ) {
			// Return pre-fixed content (with nested p tags fixed even if no block validation issues)
			const wasPreFixed = preFixedContent !== htmlContent;
			return { html: preFixedContent, fixed: wasPreFixed, issues: [] };
		}

		// Fix all blocks recursively
		const fixedBlocks = blocks.map(
			( block: any ) => fixBlockRecursively( block ).block
		);

		// Serialize the fixed blocks back to HTML
		let fixedHtml = serialize( fixedBlocks );

		// IMPORTANT: Run paragraph fixer AFTER serialize, because WordPress serialize()
		// can introduce nested <p> tags when there are style attribute mismatches.
		fixedHtml = fixNestedParagraphs( fixedHtml );

		// Log fixes to stderr
		console.error( `[BlockFixer] Fixed ${ issues.length } invalid block(s)` );
		for ( const issue of issues ) {
			console.error( `  - ${ issue.blockName }: ${ issue.issues.join( ', ' ) }` );
		}

		return {
			html: fixedHtml,
			fixed: true,
			issues,
		};
	} catch ( error ) {
		console.error( '[BlockFixer] Error fixing blocks:', error );
		// Return original content on error
		return {
			html: htmlContent,
			fixed: false,
			issues: [],
		};
	}
}
