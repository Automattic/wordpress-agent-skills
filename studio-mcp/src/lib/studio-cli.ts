import { spawn } from 'node:child_process';

type CliResult = {
	stdout: string;
	stderr: string;
	exitCode: number;
};

export function formatCliFailure( cmd: string, res: CliResult ) {
	return (
		`${ cmd } failed (exit ${ res.exitCode }).\n\n` +
		( res.stderr.trim() ? `stderr:\n${ res.stderr.trim() }\n\n` : '' ) +
		( res.stdout.trim() ? `stdout:\n${ res.stdout.trim() }` : '' )
	);
}

export function runStudioCli( args: string[] ) {
	return new Promise< CliResult >( ( resolve ) => {
		const child = spawn( 'studio', args, {
			/**
			 * 'ignore' for stdin: child can't ask interactive questions (safer, avoids hanging).
			 * 'pipe' for stdout: we want to capture normal output (e.g. `studio preview list` output).
			 * 'pipe' for stderr: we want to capture error output for debugging.
			 */
			stdio: [ 'ignore', 'pipe', 'pipe' ],
		} );

		let stdout = '';
		let stderr = '';

		child.stdout.on( 'data', ( d ) => ( stdout += d.toString( 'utf8' ) ) );
		child.stderr.on( 'data', ( d ) => ( stderr += d.toString( 'utf8' ) ) );

		child.on( 'close', ( code: number | null ) => {
			resolve( { stdout, stderr, exitCode: code ?? 0 } );
		} );
	} );
}

export function extractFirstWpBuildUrl( text: string ): string | undefined {
	const urlMatch = text.match( /https?:\/\/[^\s|]+\.wp\.build/ );
	return urlMatch?.[ 0 ];
}
