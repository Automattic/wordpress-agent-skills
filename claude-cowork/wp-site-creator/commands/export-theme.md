---
description: Package theme for distribution or create a shareable preview link
argument-hint: "<zip | share | copy>"
---

# Export Theme

Package the generated WordPress block theme for distribution or sharing. Since the theme files already live on disk in the Studio site, this command helps you distribute them.

## Trigger

User runs `/export-theme` or asks to export, share, zip, or package the theme.

## Prerequisites

This command requires a theme to have been deployed to a Studio site in the current conversation (via `/create-site`).

If no theme has been deployed, respond:
"No theme has been deployed yet. Use `/create-site` first to generate and deploy a theme, then use `/export-theme` to package it."

## Input Validation

Before running any shell commands, validate the theme slug:
- Theme slugs MUST match the pattern `^[a-z0-9-]+$` (lowercase letters, numbers, hyphens only)
- Reject any slug containing spaces, special characters, `/`, `\`, `..`, or shell metacharacters
- Always quote variables in shell commands with double quotes

## Export Options

Present the user with these options:

"How would you like to export the **[Theme Name]** theme?

1. **ZIP archive** — package for upload to another WordPress site
2. **Shareable preview link** — create a link others can view
3. **Copy to another location** — copy the theme folder elsewhere"

If `$ARGUMENTS` specifies an option (e.g., `zip`, `share`, `copy`), skip the prompt and proceed directly.

### Option 1: ZIP Archive

1. Locate theme files at `<site-path>/wp-content/themes/<theme-slug>/`
2. Create a ZIP archive:

```bash
cd "<site-path>/wp-content/themes" && zip -r "<theme-slug>.zip" "<theme-slug>/"
```

3. Report the ZIP location and provide installation instructions:

"ZIP archive created at:
`<site-path>/wp-content/themes/<theme-slug>.zip`

**Installation instructions:**

1. **Via WordPress Admin:**
   - Go to Appearance > Themes > Add New > Upload Theme
   - Upload `<theme-slug>.zip`
   - Click 'Install Now' then 'Activate'

2. **Via FTP/File Manager:**
   - Upload the `<theme-slug>` folder to `/wp-content/themes/`
   - Go to Appearance > Themes and click 'Activate'

3. **Via WP-CLI:**
   ```bash
   wp theme install <path-to-zip> --activate
   ```"

### Option 2: Shareable Preview Link

1. Call `studio_preview_create` with the site path
2. Share the resulting URL:

"Preview link created:
`<preview-url>`

Share this link with anyone to preview the theme. The link provides a live view of your Studio site."

### Option 3: Copy to Another Location

1. Ask the user for the destination path (default: `./outputs/themes/<theme-slug>/`)
2. Copy the theme directory:

```bash
cp -r "<site-path>/wp-content/themes/<theme-slug>" "<destination-path>"
```

3. Confirm the copy:

"Theme files copied to:
`<destination-path>`"

## Notes

- Theme files are located at `<site-path>/wp-content/themes/<theme-slug>/`
- The Studio site path is available from the `/create-site` workflow
- ZIP archives can be uploaded directly to any WordPress installation
