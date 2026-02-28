<?php
/**
 * Plugin Name: Design Gallery
 * Description: Design gallery for BYO Agents workflow. Auto-polls gallery.json for live updates.
 */

// Early bail — only act on our routes.
if ( ! isset( $_GET['design-gallery'] ) && ! isset( $_GET['design-asset'] ) && ! isset( $_GET['design-gallery-data'] ) ) {
	return;
}

add_action( 'template_redirect', function () {
	$design_dir = ABSPATH . 'design/';

	// ── Route: JSON API (for auto-poll) ──
	if ( isset( $_GET['design-gallery-data'] ) ) {
		header( 'Content-Type: application/json; charset=UTF-8' );
		header( 'Cache-Control: no-cache, no-store, must-revalidate' );
		$json_path = $design_dir . 'gallery.json';
		echo file_exists( $json_path ) ? file_get_contents( $json_path ) : '{}';
		exit;
	}

	// ── Route: Artifact serving ──
	if ( isset( $_GET['design-asset'] ) ) {
		$requested = $_GET['design-asset'];

		// Security: only allow safe characters in path.
		if ( ! preg_match( '/^[a-zA-Z0-9\/_\-\.]+$/', $requested ) ) {
			status_header( 400 );
			echo 'Invalid path';
			exit;
		}

		$real = realpath( $design_dir . $requested );
		if ( $real && strpos( $real, realpath( $design_dir ) ) === 0 && is_file( $real ) ) {
			$ext        = strtolower( pathinfo( $real, PATHINFO_EXTENSION ) );
			$mime_types = array(
				'html' => 'text/html; charset=UTF-8',
				'json' => 'application/json; charset=UTF-8',
				'png'  => 'image/png',
				'jpg'  => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'gif'  => 'image/gif',
				'svg'  => 'image/svg+xml',
				'webp' => 'image/webp',
				'ico'  => 'image/x-icon',
				'css'  => 'text/css; charset=UTF-8',
				'js'   => 'application/javascript; charset=UTF-8',
			);
			header( 'Content-Type: ' . ( isset( $mime_types[ $ext ] ) ? $mime_types[ $ext ] : 'application/octet-stream' ) );
			readfile( $real );
		} else {
			status_header( 404 );
			echo 'Asset not found';
		}
		exit;
	}

	// ── Route: Gallery page ──
	if ( isset( $_GET['design-gallery'] ) ) {
		$json_path = $design_dir . 'gallery.json';
		$gallery   = file_exists( $json_path )
			? json_decode( file_get_contents( $json_path ), true )
			: array(
				'project'   => 'New Project',
				'brief'     => '',
				'phase'     => 'styles',
				'artifacts' => array(),
			);

		$gallery_json = wp_json_encode( $gallery );
		$project_name = esc_html( $gallery['project'] ?? 'Project' );
		?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Design Gallery — <?php echo $project_name; ?></title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#222;display:flex}

/* ── Sidebar ── */
.sidebar{
  width:260px;min-width:260px;height:100vh;background:#f8f8f8;
  border-right:1px solid #e5e5e5;display:flex;flex-direction:column;
  overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;
}
.sidebar::-webkit-scrollbar{width:4px}
.sidebar::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}

.sb-header{padding:20px 20px 0}
.sb-header h1{font-size:16px;font-weight:700;line-height:1.3}
.sb-header .brief{font-size:12px;color:#888;margin-top:2px}
.sb-intro{padding:12px 20px 0;font-size:11.5px;color:#999;line-height:1.5}

/* Phase nav */
.phase-nav{padding:16px 0 8px;flex:1}
.phase-item{position:relative}
.phase-btn{
  display:flex;align-items:center;gap:10px;width:100%;
  padding:8px 20px;border:none;background:none;cursor:pointer;
  font:inherit;font-size:13px;color:#999;text-align:left;
  transition:color .15s,background .15s;
}
.phase-btn:hover{background:rgba(0,0,0,.03)}
.phase-btn .num{
  width:22px;height:22px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;
  border:1.5px solid #ddd;color:#ccc;background:#fff;transition:all .15s;
}
.phase-item.done .phase-btn{color:#444}
.phase-item.done .num{background:#222;border-color:#222;color:#fff}
.phase-item.done .num::after{content:"\2713";font-size:10px}
.phase-item.done .num span{display:none}
.phase-item.current .phase-btn{color:#3858e9;font-weight:600}
.phase-item.current .num{border-color:#3858e9;color:#3858e9;background:#eef1ff}
.phase-item.future .phase-btn{color:#ccc}

/* Artifact list under each phase */
.artifact-list{padding:0 0 4px 52px;list-style:none}
.artifact-list li{margin:0}
.artifact-link{
  display:flex;align-items:center;gap:6px;padding:3px 12px 3px 0;
  font-size:12px;color:#777;text-decoration:none;cursor:pointer;
  border:none;background:none;font:inherit;width:100%;text-align:left;
  transition:color .12s;
}
.artifact-link:hover{color:#222}
.artifact-link.active{color:#3858e9;font-weight:600}
.artifact-link .dots{display:flex;gap:3px}
.dot{width:10px;height:10px;border-radius:50%;border:1px solid rgba(0,0,0,.08);display:inline-block;flex-shrink:0}

/* Tokens card in sidebar */
.sb-tokens{
  margin:8px 12px 16px;padding:14px;background:#fff;
  border:1px solid #e8e8e8;border-radius:10px;
}
.sb-tokens .lbl{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#aaa;margin-bottom:8px}
.color-bar{display:flex;border-radius:4px;overflow:hidden;height:20px;margin-bottom:8px}
.color-bar span{flex:1;min-width:24px}
.sb-tokens .fonts{font-size:11px;margin-bottom:6px}
.sb-tokens .fonts .hf{font-weight:700}
.sb-tokens .fonts .bf{color:#999}
.pill{font-size:10px;padding:2px 8px;border-radius:10px;background:#eee;color:#777;display:inline-block;margin-right:4px}

/* ── Main content ── */
.main{flex:1;height:100vh;display:flex;flex-direction:column;background:#fff;min-width:0}
.main-header{
  display:flex;align-items:center;gap:12px;padding:10px 20px;
  border-bottom:1px solid #eee;font-size:13px;color:#888;flex-shrink:0;
}
.main-header .artifact-title{font-weight:600;color:#222}
.viewer{flex:1;position:relative}
.viewer iframe{width:100%;height:100%;border:none;display:block;position:absolute;inset:0}

.empty-state{
  display:flex;align-items:center;justify-content:center;height:100%;
  color:#ccc;font-size:14px;font-style:italic;
}

/* Inspiration panel */
.inspiration-panel{padding:32px;overflow-y:auto;height:100%}
.ref-cards{display:flex;gap:12px;flex-wrap:wrap}
.ref-card{
  display:block;background:#f8f8f8;border:1px solid #e0e0e0;border-radius:8px;
  padding:14px;text-decoration:none;color:inherit;max-width:280px;transition:border-color .15s;
}
.ref-card:hover{border-color:#aaa}
.ref-card .title{font-weight:600;font-size:14px;color:#222}
.ref-card .notes{font-size:12px;color:#888;margin-top:4px}

/* Theme panel */
.theme-panel{padding:32px;overflow-y:auto;height:100%}
.theme-card{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:8px;padding:14px;display:inline-block;margin-right:12px}
.theme-card .name{font-weight:600;font-size:14px}
.theme-card .sub{font-size:12px;color:#888;margin-top:4px}

/* Live indicator */
.live-dot{
  width:6px;height:6px;border-radius:50%;background:#34c759;display:inline-block;
  margin-left:8px;animation:pulse 2s infinite;
}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

/* ── Responsive ── */
@media(max-width:720px){
  body{flex-direction:column}
  .sidebar{
    width:100%;min-width:unset;height:auto;max-height:45vh;
    border-right:none;border-bottom:1px solid #e5e5e5;
  }
  .main{height:55vh}
}
</style>
</head>
<body>

<aside class="sidebar" id="sidebar"></aside>

<div class="main">
  <div class="main-header">
    <span class="artifact-title" id="mainTitle">Gallery</span>
    <span class="live-dot" title="Auto-refreshing"></span>
  </div>
  <div class="viewer" id="viewer">
    <div class="empty-state">Waiting for designs...</div>
  </div>
</div>

<script>
// ── Gallery Data ──
var currentData = <?php echo $gallery_json; ?>;

// ── Phase Definitions ──
var PHASES = [
  { key: "inspiration", label: "Inspiration", num: 1 },
  { key: "styles", label: "Style Exploration", num: 2 },
  { key: "pages", label: "Page Design", num: 3 },
  { key: "approved", label: "Full Site Mockup", num: 4 },
  { key: "theme", label: "WordPress Site", num: 5 }
];

// Track what's currently displayed in the iframe.
var activePhase = null;
var activeFile = null;

// ── Render Sidebar ──
function renderSidebar() {
  var d = currentData;
  var cur = d.phase || "styles";
  var curIdx = PHASES.map(function(p) { return p.key; }).indexOf(cur);

  var html = '<div class="sb-header">'
    + '<h1>' + esc(d.project) + '</h1>'
    + (d.brief ? '<div class="brief">' + esc(d.brief) + '</div>' : '')
    + '</div>'
    + '<p class="sb-intro">Your design gallery. Artifacts appear here live as each phase progresses.</p>'
    + '<nav class="phase-nav">';

  for (var i = 0; i < PHASES.length; i++) {
    var p = PHASES[i];
    var status = i < curIdx ? "done" : i === curIdx ? "current" : "future";
    var artifacts = (d.artifacts && d.artifacts[p.key]) || [];

    html += '<div class="phase-item ' + status + '">'
      + '<button class="phase-btn" onclick="selectPhase(\'' + p.key + '\')">'
      + '<span class="num"><span>' + p.num + '</span></span>'
      + '<span>' + p.label + '</span>'
      + '</button>';

    if ((status === "done" || status === "current") && artifacts.length && p.key !== "inspiration" && p.key !== "theme") {
      html += '<ul class="artifact-list">';
      for (var j = 0; j < artifacts.length; j++) {
        var a = artifacts[j];
        var isActive = activePhase === p.key && activeFile === a.file;
        html += '<li><button class="artifact-link' + (isActive ? ' active' : '') + '" data-phase="' + p.key + '" data-file="' + a.file + '" onclick="selectArtifact(\'' + p.key + '\',\'' + a.file + '\')">'
          + esc(a.label || ('v' + a.version))
          + '<span class="dots">' + dots(a.colors || []) + '</span>'
          + '</button></li>';
      }
      html += '</ul>';
    }
    html += '</div>';
  }

  html += '</nav>';

  // Tokens card
  if (d.tokens) {
    var c = d.tokens.colors || {};
    var t = d.tokens.typography || {};
    var s = d.tokens.spacing || {};
    var mo = d.tokens.motion || {};
    var palette = [c.primary, c.secondary, c.accent];
    if (c.light) { palette.push(c.light.background, c.light.surface); }
    if (c.dark) { palette.push(c.dark.background, c.dark.surface); }
    palette = palette.filter(Boolean);
    var colorBar = palette.map(function(cl) { return '<span style="background:' + cl + '"></span>'; }).join('');
    var pills = [s && s.density, mo && mo.level].filter(Boolean).map(function(v) { return '<span class="pill">' + v + '</span>'; }).join('');
    html += '<div class="sb-tokens"><div class="lbl">Design Tokens</div>'
      + '<div class="color-bar">' + colorBar + '</div>'
      + '<div class="fonts"><span class="hf">' + esc((t.heading && t.heading.family) || '') + '</span>'
      + (t.body && t.body.family ? ' <span class="bf">/ ' + esc(t.body.family) + '</span>' : '')
      + '</div>'
      + (pills || '')
      + '</div>';
  }

  document.getElementById("sidebar").innerHTML = html;
}

function dots(colors) {
  return colors.slice(0, 4).map(function(c) {
    return '<span class="dot" style="background:' + c + '"></span>';
  }).join('');
}

function esc(s) {
  var el = document.createElement('span');
  el.textContent = s || '';
  return el.innerHTML;
}

// ── Navigation ──
function selectArtifact(phase, file) {
  activePhase = phase;
  activeFile = file;

  // Update active states in sidebar.
  document.querySelectorAll('.artifact-link').forEach(function(el) {
    el.classList.toggle('active', el.getAttribute('data-phase') === phase && el.getAttribute('data-file') === file);
  });

  var a = findArtifact(phase, file);
  var label = a && a.label ? a.label : file;
  var phaseObj = PHASES.filter(function(p) { return p.key === phase; })[0];
  var phaseLabel = phaseObj ? phaseObj.label : phase;
  document.getElementById('mainTitle').textContent = phaseLabel + ' — ' + label;
  document.getElementById('viewer').innerHTML = '<iframe src="?design-asset=' + encodeURIComponent(file) + '"></iframe>';
}

function selectPhase(phase) {
  document.querySelectorAll('.artifact-link').forEach(function(el) { el.classList.remove('active'); });
  var phaseObj = PHASES.filter(function(p) { return p.key === phase; })[0];
  document.getElementById('mainTitle').textContent = phaseObj ? phaseObj.label : phase;

  if (phase === 'inspiration') {
    var refs = currentData.references || [];
    var h = '<div class="inspiration-panel">';
    if (refs.length) {
      h += '<div class="ref-cards">';
      refs.forEach(function(r) {
        h += '<a href="' + esc(r.url) + '" target="_blank" rel="noopener" class="ref-card">'
          + '<div class="title">' + esc(r.title || r.url) + '</div>'
          + (r.notes ? '<div class="notes">' + esc(r.notes) + '</div>' : '')
          + '</a>';
      });
      h += '</div>';
    } else {
      h += '<div class="empty-state">No references shared yet</div>';
    }
    h += '</div>';
    document.getElementById('viewer').innerHTML = h;
    activePhase = phase;
    activeFile = null;
    return;
  }

  if (phase === 'theme') {
    var slugs = currentData.themeSlugs || [];
    var h = '<div class="theme-panel">';
    if (slugs.length) {
      slugs.forEach(function(s) {
        h += '<div class="theme-card"><div class="name">' + esc(s) + '</div><div class="sub">WordPress block theme</div></div>';
      });
      if (currentData.siteUrl) {
        h += '<p style="margin-top:16px;font-size:13px;color:#888">Site: <a href="' + esc(currentData.siteUrl) + '" target="_blank">' + esc(currentData.siteUrl) + '</a></p>';
      }
    } else {
      h += '<div class="empty-state">Theme build in progress...</div>';
    }
    h += '</div>';
    document.getElementById('viewer').innerHTML = h;
    activePhase = phase;
    activeFile = null;
    return;
  }

  var artifacts = (currentData.artifacts && currentData.artifacts[phase]) || [];
  if (artifacts.length) {
    var last = artifacts[artifacts.length - 1];
    selectArtifact(phase, last.file);
  } else {
    document.getElementById('viewer').innerHTML = '<div class="empty-state">Waiting for first artifact...</div>';
    activePhase = phase;
    activeFile = null;
  }
}

function findArtifact(phase, file) {
  var list = (currentData.artifacts && currentData.artifacts[phase]) || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].file === file) return list[i];
  }
  return null;
}

// ── Auto-poll ──
var pollDataStr = JSON.stringify(currentData);

setInterval(async function() {
  try {
    var res = await fetch('?design-gallery-data', { cache: 'no-store' });
    if (!res.ok) return;
    var data = await res.json();
    var newStr = JSON.stringify(data);
    if (newStr !== pollDataStr) {
      pollDataStr = newStr;
      currentData = data;
      renderSidebar();

      // If the currently-viewed artifact was updated, reload the iframe.
      if (activePhase && activeFile) {
        var iframe = document.querySelector('.viewer iframe');
        if (iframe) {
          iframe.src = iframe.src;
        }
      }

      // If no artifact is selected yet but there are now artifacts, show the latest.
      if (!activeFile) {
        var cur = currentData.phase || "styles";
        var curArtifacts = (currentData.artifacts && currentData.artifacts[cur]) || [];
        if (curArtifacts.length && cur !== "inspiration" && cur !== "theme") {
          var latest = curArtifacts[curArtifacts.length - 1];
          selectArtifact(cur, latest.file);
        }
      }
    }
  } catch (e) {
    // Silent fail — gallery stays usable, will retry next interval.
  }
}, 3000);

// ── Init ──
renderSidebar();

// Show latest artifact in the current phase on load.
(function() {
  var cur = currentData.phase || "styles";
  var curArtifacts = (currentData.artifacts && currentData.artifacts[cur]) || [];
  if (curArtifacts.length && cur !== "inspiration" && cur !== "theme") {
    var latest = curArtifacts[curArtifacts.length - 1];
    selectArtifact(cur, latest.file);
  }
})();
</script>
</body>
</html>
		<?php
		exit;
	}
} );
