---
name: studio-setup
description: Studio environment verification and site creation. Referenced by quick-build and design-site commands.
---

# Studio Environment Setup

Before any work begins, confirm that WordPress Studio is installed, the CLI is active, and establish the site path.

## Verification Steps

1. Run `studio site list` (Bash) to get all existing site paths.
2. **If the command fails** (non-zero exit code, "command not found", or connection error): Studio is not installed or its CLI is not enabled. Tell the user:

   "It looks like either WordPress Studio is not installed, or the CLI is not turned on.

   - **To install WordPress Studio:** <https://developer.wordpress.com/studio/>
   - **To enable the CLI:** <https://developer.wordpress.com/docs/developer-tools/studio/cli/>

   Once Studio is installed and the CLI is enabled, run the command again."

   **Stop here.**

3. **If the command succeeds**, derive the Studio home folder:
   - If sites exist, extract the common parent directory from their paths
   - If no sites exist yet, default to `~/Studio`
4. **Resolve to absolute path** (expand `~`) and store as `STUDIO_HOME`
5. **Check current working directory** against `STUDIO_HOME`:
   - If within `STUDIO_HOME`: proceed
   - Note: on macOS, directory names are case-insensitive (`~/studio` = `~/Studio`)
   - If **not** within `STUDIO_HOME`: tell the user:

     "It looks like you're running Claude from `<current-dir>`, but your Studio sites live in `<STUDIO_HOME>`.

     You have two options:
     1. **Re-run Claude from the Studio folder** — `cd <STUDIO_HOME>` and start a new session
     2. **Tell me the path** — if your Studio sites are in a different location, let me know

     Which would you prefer?"

     Wait for response. If they provide a path, validate and update `STUDIO_HOME`. If they choose to re-run, stop.

## Site Creation

1. Ask the user: use an existing Studio site or create a new one?
2. If **new**: derive theme slug from site name (kebab-case, validate: `^[a-z0-9-]+$`), then:
   ```bash
   studio site create --path <STUDIO_HOME>/<theme-slug> --name "<site-name>" --skip-browser
   ```
3. If **existing**: use the selected site's path; run `studio site start --path <site-path>` if not already running

Store `<site-path>` for all subsequent steps.
