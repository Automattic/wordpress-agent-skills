# Local Development Quickstart

How to run the design-site workflow using your local repo as the live plugin source.

## Prerequisites

1. Clone the repo locally:
   ```bash
   git clone https://github.com/Automattic/wordpress-agent-skills.git ~/Documents/GitHub/wordpress-agent-skills
   ```

2. Check out the branch you want to test:
   ```bash
   cd ~/Documents/GitHub/wordpress-agent-skills
   git checkout add-mockup-approval-workflow
   ```

## Option A: VS Code Extension

Use this if you want to work entirely within the Claude Code VS Code panel.

1. **Open your Studio folder** (or an existing project) in VS Code.

2. **Add your local repo as a marketplace** — in the Claude Code panel, run:
   ```
   /plugins
   ```
   Go to the **Marketplaces** tab and add:
   ```
   ~/Documents/GitHub/wordpress-agent-skills
   ```
   This works because the repo has a `.claude-plugin/marketplace.json` at the root.

3. **Start the workflow:**
   ```
   /design-site A modern coffee shop called Brewhouse
   ```

4. **After making changes** to plugin files, run `/reload-plugins` to pick them up without restarting.

## Option B: CLI (Terminal)

Use this if you prefer the command line or need to pass flags directly.

1. **Navigate to your Studio folder or an existing project:**
   - **New project:** `cd ~/Studio`
   - **Existing project:** `cd ~/Studio/my-existing-site`

2. **Launch Claude with the local plugin:**
   ```bash
   claude --plugin-dir ~/Documents/GitHub/wordpress-agent-skills/claude-code/wp-site-creator
   ```

3. **Start the workflow:**
   ```
   /design-site A modern coffee shop called Brewhouse
   ```

## How It Works

Both options point Claude Code at your local repo files instead of the remote marketplace install. `CLAUDE_PLUGIN_ROOT` resolves to your local `claude-code/wp-site-creator/` directory, so whatever branch you have checked out is what gets used — no push, update, or symlink required.

Phase 0.5 handles Studio setup automatically — it will create a new Studio site or use the existing one at your current path, then install the gallery plugin.
