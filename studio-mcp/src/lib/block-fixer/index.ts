/**
 * Block Fixer — Initialization Module
 *
 * Sets up JSDOM globals and loads @wordpress/blocks + @wordpress/block-library at startup.
 * WordPress packages use bare JSON imports internally, which fail in Node.js ESM
 * (requires import attributes). We use createRequire() to load them via CJS instead.
 *
 * IMPORTANT: JSDOM globals must be set BEFORE requiring @wordpress/blocks.
 * The top-level execution order in this file guarantees that.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { createRequire } from 'node:module';

const require = createRequire( import.meta.url );

// --- JSDOM globals (must run before @wordpress/blocks is loaded) ---

const { JSDOM, VirtualConsole } = require( 'jsdom' );

// Suppress JSDOM CSS parse errors — @wordpress/ui uses modern CSS (@layer, nesting)
// that JSDOM's CSS parser can't handle. These are harmless for block parsing.
const virtualConsole = new VirtualConsole();

const dom = new JSDOM( '<!DOCTYPE html><html><body></body></html>', {
	url: 'http://localhost',
	pretendToBeVisual: true,
	virtualConsole,
} );

( global as any ).window = dom.window;
( global as any ).document = dom.window.document;
( global as any ).DOMParser = dom.window.DOMParser;
( global as any ).XMLSerializer = dom.window.XMLSerializer;
( global as any ).Node = dom.window.Node;
( global as any ).Element = dom.window.Element;
( global as any ).HTMLElement = dom.window.HTMLElement;
( global as any ).getComputedStyle = dom.window.getComputedStyle;
( global as any ).MutationObserver = dom.window.MutationObserver;
( global as any ).requestAnimationFrame = ( cb: () => void ) => setTimeout( cb, 16 );
( global as any ).cancelAnimationFrame = ( id: number ) => clearTimeout( id );
( global as any ).matchMedia = () => ( {
	matches: false,
	addListener: () => {},
	removeListener: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
} );
( global as any ).ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

Object.defineProperty( global, 'navigator', {
	value: dom.window.navigator,
	writable: true,
	configurable: true,
} );

// --- WordPress packages (loaded after globals are set) ---

const wpBlocks = require( '@wordpress/blocks' );
const wpBlockLibrary = require( '@wordpress/block-library' );

try {
	wpBlockLibrary.registerCoreBlocks();
	console.error( '[BlockFixer] Block registry initialized with core blocks' );
} catch ( error ) {
	console.error( '[BlockFixer] Failed to initialize block registry:', error );
}

export const parse: ( html: string ) => any[] = wpBlocks.parse;
export const serialize: ( blocks: any[] ) => string = wpBlocks.serialize;
export const createBlock: ( name: string, attributes?: any, innerBlocks?: any[] ) => any =
	wpBlocks.createBlock;

export { fixBlocksInTemplate } from './block-fixer';
