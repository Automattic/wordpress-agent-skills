import fs from 'node:fs/promises';
import path from 'node:path';

export async function resolveInsideRoot( root: string, rel: string ) {
	const rootReal = path.resolve( root );
	const target = path.resolve( rootReal, rel );

	// Ensure target is inside root (lexical check first)
	const rootRealWithTrailingSlash = rootReal.endsWith( path.sep ) ? rootReal : rootReal + path.sep;
	if ( target !== rootReal && ! target.startsWith( rootRealWithTrailingSlash ) ) {
		console.error(
			`Path escapes site root. root="${ rootReal }", requested="${ rel }", resolved="${ target }"`
		);
		throw new Error( 'Path is not allowed: it resolves outside the site root.' );
	}

	// Resolve symlinks and re-validate against the real root
	let realTarget: string;
	try {
		realTarget = await fs.realpath( target );
	} catch {
		// Path doesn't exist yet (write/mkdir) — resolve the parent instead
		const parentDir = path.dirname( target );
		let realParent: string;
		try {
			realParent = await fs.realpath( parentDir );
		} catch {
			// Parent doesn't exist either — trust the lexical check above
			return target;
		}
		realTarget = path.join( realParent, path.basename( target ) );
	}

	let realRoot: string;
	try {
		realRoot = await fs.realpath( rootReal );
	} catch {
		// Root doesn't exist — trust the lexical check above
		return target;
	}

	const realRootWithTrailingSlash = realRoot.endsWith( path.sep ) ? realRoot : realRoot + path.sep;
	if ( realTarget !== realRoot && ! realTarget.startsWith( realRootWithTrailingSlash ) ) {
		console.error(
			`Symlink escapes site root. root="${ realRoot }", requested="${ rel }", realTarget="${ realTarget }"`
		);
		throw new Error( 'Path is not allowed: it resolves outside the site root.' );
	}

	return realTarget;
}

export async function isDirectory( p: string ) {
	try {
		const st = await fs.lstat( p );
		return st.isDirectory();
	} catch {
		return false;
	}
}
