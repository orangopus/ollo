#!/usr/bin/env node
// Builds the read-only ollo for GitHub Pages from profiles/*.json.
//
//   node pages-site/build.mjs           validate + write pages-site/dist/
//   node pages-site/build.mjs --check   validate only (used on pull requests)
//
// Node built-ins only, so CI needs no npm install. Every URL in the output is
// relative, so the site works at a domain root (https://ollo.thng.my/) or under
// a project path (https://orangopus.github.io/ollo/).

import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const PROFILES = join(ROOT, 'profiles');
const DIST = join(HERE, 'dist');
const REPO = 'ORANGOPUS/ollo';
const CHECK_ONLY = process.argv.includes('--check');
// When set (the deploy workflow sets it to https://ollo.bio), profiles of
// ollo.bio users who opted in are fetched from <OLLO_API>/api/pages-profiles.
// They exist only in dist/ and are never written into the repository.
const OLLO_API = (process.env.OLLO_API || '').replace(/\/$/, '');
const MAX_AVATAR = 1024 * 1024;

// Set by the deploy workflow from actions/configure-pages, so the site follows
// whatever domain is configured in Settings → Pages.
const SITE_URL = (process.env.PAGES_BASE_URL || 'https://ollo.thng.my').replace(/\/$/, '');
const SITE_PATH = (process.env.PAGES_BASE_PATH || '').replace(/\/$/, '') + '/';
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');

// Same palette and hash as composables/useAvatarTint.ts
const TINTS = ['#04d87f', '#fdd35c', '#7ec8ff', '#ff9f7a', '#c9a6ff', '#8fe3c4'];
function tintFor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
}

// Controller and contact come from app.config.ts so the app and this site share one source.
function readLegal() {
  const src = readFileSync(join(ROOT, 'app.config.ts'), 'utf8');
  const pick = (key) => (src.match(new RegExp(`${key}:\\s*"([^"]*)"`)) || [])[1] || '';
  return { controller: pick('controller') || 'Orangopus Collective', contactEmail: pick('contactEmail'), lastUpdated: pick('lastUpdated') };
}

const USERNAME = /^[a-z0-9][a-z0-9._-]{0,28}[a-z0-9]$/;
const RESERVED = new Set(['add', 'privacy', 'terms', 'assets', 'avatars', '404']);
const AVATAR = /^avatars\/([a-z0-9._-]+)\.(png|jpe?g|webp)$/;
const FIELDS = new Set(['username', 'displayName', 'bio', 'tint', 'avatar', 'links']);

function validate(file, data) {
  const errors = [];
  const expected = file.replace(/\.json$/, '');
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return ['the file must contain one JSON object'];

  for (const key of Object.keys(data)) if (!FIELDS.has(key)) errors.push(`unknown field "${key}" (allowed: ${[...FIELDS].join(', ')})`);

  const { username, displayName, bio, tint, avatar, links } = data;
  if (typeof username !== 'string' || !USERNAME.test(username)) errors.push('"username" must be 2–30 characters of a-z, 0-9, ".", "_" or "-", starting and ending with a letter or number');
  else if (username !== expected) errors.push(`"username" is "${username}" but the file is named "${file}"; they must match`);
  else if (RESERVED.has(username)) errors.push(`"${username}" is reserved; pick another username`);

  if (typeof displayName !== 'string' || !displayName.trim() || displayName.length > 50) errors.push('"displayName" is required, 1–50 characters');
  if (bio !== undefined && (typeof bio !== 'string' || bio.length > 280)) errors.push('"bio" must be text, up to 280 characters');
  if (tint !== undefined && !TINTS.includes(String(tint).toLowerCase())) errors.push(`"tint" must be one of ${TINTS.join(' ')}`);

  if (avatar !== undefined) {
    const m = typeof avatar === 'string' && avatar.match(AVATAR);
    if (!m) errors.push('"avatar" must look like "avatars/<username>.png" (or .jpg / .webp)');
    else if (m[1] !== username) errors.push(`"avatar" file must be named after your username: avatars/${username}.${m[2]}`);
    else {
      const path = join(PROFILES, avatar);
      if (!existsSync(path)) errors.push(`"avatar" points to profiles/${avatar}, which isn't in the pull request`);
      else if (statSync(path).size > 1024 * 1024) errors.push(`profiles/${avatar} is larger than 1 MB`);
    }
  }

  if (links !== undefined) {
    if (!Array.isArray(links)) errors.push('"links" must be a list');
    else {
      if (links.length > 12) errors.push('"links" can have at most 12 items');
      links.forEach((link, i) => {
        const where = `links[${i}]`;
        if (typeof link !== 'object' || link === null) return errors.push(`${where} must be { "label": "...", "url": "https://..." }`);
        for (const key of Object.keys(link)) if (key !== 'label' && key !== 'url') errors.push(`${where} has unknown field "${key}"`);
        if (typeof link.label !== 'string' || !link.label.trim() || link.label.length > 40) errors.push(`${where}.label is required, 1–40 characters`);
        let url;
        try { url = new URL(link.url); } catch { url = null; }
        if (!url || url.protocol !== 'https:') errors.push(`${where}.url must be a full https:// link`);
      });
    }
  }
  return errors;
}

function loadProfiles() {
  const files = readdirSync(PROFILES).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort();
  const profiles = [];
  let failed = 0;
  for (const file of files) {
    let data;
    try {
      data = JSON.parse(readFileSync(join(PROFILES, file), 'utf8'));
    } catch (e) {
      console.error(`✗ profiles/${file}: not valid JSON (${e.message})`);
      failed++;
      continue;
    }
    const errors = validate(file, data);
    if (errors.length) {
      failed++;
      console.error(`✗ profiles/${file}`);
      for (const err of errors) console.error(`    - ${err}`);
      continue;
    }
    console.log(`✓ profiles/${file}`);
    profiles.push({
      ...data,
      bio: data.bio || '',
      links: data.links || [],
      tint: (data.tint || tintFor(data.username)).toLowerCase(),
    });
  }
  if (failed) {
    console.error(`\n${failed} profile file(s) need fixing. See profiles/README.md for the rules.`);
    process.exit(1);
  }
  return profiles.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

// ---------- rendering ----------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const MARK = `<svg viewBox="0 0 186 111" aria-hidden="true"><path d="M48.07 108.14C74.6183 108.14 96.14 86.6183 96.14 60.07C96.14 33.5217 74.6183 12 48.07 12C21.5217 12 0 33.5217 0 60.07C0 86.6183 21.5217 108.14 48.07 108.14Z" fill="#fff"/><path d="M128.94 23.996C132.952 8.88921 148.347 -0.0759104 163.325 3.97194C178.301 8.01986 187.19 23.5478 183.177 38.6546L175.91 66.008C167.884 96.2213 137.095 114.152 107.14 106.056L128.94 23.996Z" fill="#04D87F"/></svg>`;

function avatarHtml(p, base, size) {
  const avatar = p.avatarOut || p.avatar;
  const src = avatar ? `${base}${avatar}` : `${base}assets/avatar.svg`;
  return `<span class="avatar" style="--tint:${p.tint};--size:${size}px"><img src="${esc(src)}" width="${size}" height="${size}" alt="" loading="lazy"></span>`;
}

function page({ title, description, base, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="${base}assets/avatar.svg" type="image/svg+xml">
<link rel="stylesheet" href="${base}assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="bar"><div class="bar-inner">
  <a class="brand" href="${base}">${MARK}<span>ollo</span></a>
  <a class="bar-cta" href="${base}add/">Add your profile</a>
</div></header>
<main id="main">
${body}
</main>
<footer class="foot"><nav aria-label="Footer">
  <a href="${base}">Explore</a>
  <a href="${base}add/">Add your profile</a>
  <a href="${base}privacy/">Privacy</a>
  <a href="${base}terms/">Terms</a>
  <a href="https://github.com/${REPO}">Source code</a>
</nav></footer>
</body>
</html>
`;
}

function explorePage(profiles) {
  const base = './';
  const grid = (list) => `<ul class="grid">${list.map((p) => `
  <li><a class="card" href="${base}${esc(p.username)}/">
    ${avatarHtml(p, base, 56)}
    <span class="card-body">
      <span class="card-name">${esc(p.displayName)}</span>
      <span class="card-handle">@${esc(p.username)}</span>
      ${p.bio ? `<span class="card-bio">${esc(p.bio)}</span>` : ''}
    </span>
  </a></li>`).join('')}
</ul>`;
  const fromRepo = profiles.filter((p) => p.source !== 'app');
  const fromApp = profiles.filter((p) => p.source === 'app');
  return page({
    title: 'ollo: one little link, organised.',
    description: 'Public ollo profiles, published from GitHub and ollo.bio.',
    base,
    body: `<section class="hero">
  <h1>one little link, <span class="accent">organised.</span></h1>
  <p class="lede">Public ollo pages, added by pull request or shared from ollo.bio. No accounts, no tracking.</p>
</section>
<h2 id="explore">Explore</h2>
${fromRepo.length ? grid(fromRepo) : `<p class="empty">No profiles yet. Be the first: <a href="${base}add/">add your profile</a>.</p>`}
<h2 id="from-ollo">From ollo.bio</h2>
${fromApp.length ? grid(fromApp) : `<p class="empty">Nobody has chosen to appear here yet. ollo.bio users can switch on <strong>Show my profile on ollo.thng.my</strong> under Privacy in their <a href="https://ollo.bio/dashboard">dashboard</a>.</p>`}`,
  });
}

function profilePage(p) {
  const base = '../';
  const links = p.links.length
    ? `<ul class="links">${p.links.map((l) => `<li><a href="${esc(l.url)}" rel="noopener nofollow ugc">${esc(l.label)}</a></li>`).join('')}</ul>`
    : '';
  return page({
    title: `${p.displayName} (@${p.username}) · ollo`,
    description: p.bio || `${p.displayName} on ollo`,
    base,
    body: `<article class="profile" style="--tint:${p.tint}">
  ${avatarHtml(p, base, 128)}
  <h1>${esc(p.displayName)}</h1>
  <p class="handle">@${esc(p.username)}</p>
  ${p.source === 'app' ? `<p class="source-badge"><a href="https://ollo.bio/${esc(p.username)}" aria-label="From ollo.bio: open @${esc(p.username)} on ollo.bio">${MARK}<span>From ollo.bio</span></a></p>` : ''}
  ${p.bio ? `<p class="bio">${esc(p.bio)}</p>` : ''}
  ${links}
  <p class="edit">${p.source === 'app'
    ? 'From ollo.bio. Is this you? <a href="https://ollo.bio/dashboard">Change it or hide it in your ollo dashboard</a>'
    : `Is this you? <a href="https://github.com/${REPO}/edit/main/profiles/${esc(p.username)}.json">Edit this profile on GitHub</a>`}</p>
</article>`,
  });
}

function addPage() {
  const template = readFileSync(join(PROFILES, '_template.json'), 'utf8');
  const newFile = `https://github.com/${REPO}/new/main/profiles?filename=yourname.json&value=${encodeURIComponent(template)}`;
  return page({
    title: 'Add your profile · ollo',
    description: 'Add your public ollo page with a GitHub pull request.',
    base: '../',
    body: `<div class="prose">
  <h1>Add your profile</h1>
  <p class="lede">Your page is a small file in our GitHub repository. You'll need a free GitHub account.</p>
  <div class="callout"><p><strong>Everything in your profile is public</strong>, and stays in the repository's history even if you delete it later. Only add what you're happy for anyone to see.</p></div>
  <ol class="steps">
    <li><div><strong>Open the template</strong>GitHub opens an editor with the template filled in. Rename <code>yourname.json</code> to your username.</div></li>
    <li><div><strong>Fill it in</strong>Add your name, a short bio and up to 12 links. Links must start with <code>https://</code>.</div></li>
    <li><div><strong>Propose the change</strong>GitHub creates a pull request. An automatic check tells you if anything needs fixing.</div></li>
    <li><div><strong>Go live</strong>Once a maintainer merges it, your page appears at <code>${esc(SITE_HOST)}/&lt;username&gt;/</code> within a few minutes.</div></li>
  </ol>
  <p><a class="button" href="${esc(newFile)}">Open the template on GitHub</a></p>
  <p>All the rules are in <a href="https://github.com/${REPO}/blob/main/profiles/README.md">profiles/README.md</a>.</p>
</div>`,
  });
}

function contact(legal) {
  return legal.contactEmail
    ? `<a href="mailto:${esc(legal.contactEmail)}">${esc(legal.contactEmail)}</a>`
    : '<strong class="missing">[privacy contact email not set: add it in app.config.ts]</strong>';
}

function privacyPage(legal) {
  return page({
    title: 'Privacy · ollo',
    description: 'How the read-only ollo handles your data.',
    base: '../',
    body: `<div class="prose">
  <h1>Privacy notice</h1>
  <p class="updated">${legal.lastUpdated ? `Last updated ${esc(legal.lastUpdated)} · ` : ''}This notice covers ${esc(SITE_HOST)}. The full app at ollo.bio has <a href="https://ollo.bio/privacy">its own notice</a>.</p>
  <div class="callout"><p><strong>The short version:</strong> this site has no accounts, no cookies and no tracking. The only personal data here is what people choose to put in their public profile file on GitHub.</p></div>
  <h2>Who we are</h2>
  <p>${esc(legal.controller)} runs ollo and is the controller of personal data on this site under the UK GDPR and the EU GDPR. Contact: ${contact(legal)}.</p>
  <h2>What we hold and why</h2>
  <ul>
    <li><strong>Your profile file:</strong> your username, display name, bio, links and optional avatar. We publish it because you asked us to by opening a pull request. The legal basis is your consent, which you can withdraw by deleting the file.</li>
    <li><strong>Your pull request:</strong> GitHub shows your GitHub username and the content of your pull request publicly. That's part of how GitHub works.</li>
  </ul>
  <h2>Profiles shared from ollo.bio</h2>
  <p>If you use ollo.bio and switch on <strong>Show my profile on ollo.thng.my</strong> under Privacy in your dashboard, this site shows your username, display name, bio, avatar and links. The legal basis is your consent. This data is fetched from ollo.bio each time the site is rebuilt (at least every 6 hours) and is <strong>not</strong> stored in the git repository. Switch the setting off or delete your account and you'll be removed at the next rebuild, within about 6 hours.</p>
  <h2>Who else handles it</h2>
  <p><strong>GitHub</strong> stores the repository and hosts this site. GitHub may log your IP address and browser details when you visit, under its own privacy statement. GitHub may process data in the United States.</p>
  <h2>Public, and in git history</h2>
  <p>Everything in a profile file is public. Git keeps every past version of a file, so deleting your file takes your page off the site, but earlier versions stay in the repository's history. Copies other people or search engines made can't be recalled by us.</p>
  <h2>Your rights</h2>
  <ul>
    <li><strong>Change or delete your page:</strong> open a pull request that edits or removes your file.</li>
    <li><strong>Remove it from history as well:</strong> email ${contact(legal)}. We'll rewrite the repository history to remove it and reply within one month.</li>
    <li>You can also ask for a copy of your data, or object to how we use it.</li>
  </ul>
  <h2>Complaints</h2>
  <p>Tell us first so we can fix it. You also have the right to complain to the data protection authority where you live or work. In the UK, that's the Information Commissioner's Office (ico.org.uk).</p>
</div>`,
  });
}

function termsPage(legal) {
  return page({
    title: 'Terms · ollo',
    description: 'Terms for adding a profile to the read-only ollo.',
    base: '../',
    body: `<div class="prose">
  <h1>Terms</h1>
  <p class="updated">${legal.lastUpdated ? `Last updated ${esc(legal.lastUpdated)}` : ''}</p>
  <ul>
    <li>${esc(legal.controller)} runs this site for free and may change or remove it. It's provided as is, without warranties.</li>
    <li>Only add a profile for yourself, or for a project you're allowed to represent.</li>
    <li>You keep ownership of your content. By opening a pull request, you let us publish it here until you remove it.</li>
    <li>No illegal, hateful, harassing or sexually explicit content, no impersonation, and no links to phishing or malware. Maintainers may decline or remove profiles that break these rules.</li>
    <li>Usernames are first come, first served. We may reassign one that impersonates someone or infringes a trademark.</li>
    <li>The code is MIT licensed. These terms cover this hosted site.</li>
  </ul>
  <p>Questions: ${contact(legal)}.</p>
</div>`,
  });
}

function notFoundPage() {
  // GitHub Pages serves 404.html for any missing path at any depth, so links
  // here are absolute from the site root.
  return page({
    title: 'Page not found · ollo',
    description: 'This page does not exist.',
    base: SITE_PATH,
    body: `<div class="prose">
  <h1>Nothing here</h1>
  <p class="lede">There's no profile or page at this address. It may have been renamed or removed.</p>
  <p><a class="button" href="${SITE_PATH}">Explore profiles</a></p>
</div>`,
  });
}

// ---------- opted-in profiles from ollo.bio ----------

// Same rules as repo profiles, but lenient: anything invalid is dropped or
// trimmed rather than failing the build, because users edit these in the app.
function sanitizeAppProfile(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const username = String(raw.username || '').toLowerCase();
  if (!USERNAME.test(username) || RESERVED.has(username)) return null;
  const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const displayName = text(raw.displayName, 50) || username;
  const links = (Array.isArray(raw.links) ? raw.links : [])
    .map((l) => {
      let url;
      try { url = new URL(l && l.url); } catch { return null; }
      if (url.protocol !== 'https:') return null;
      return { label: text(l.label, 40) || url.hostname, url: url.href };
    })
    .filter(Boolean)
    .slice(0, 12);
  let avatarUrl = null;
  try {
    const u = new URL(raw.avatar);
    if (u.protocol === 'https:') avatarUrl = u.href;
  } catch { /* "avatar.png" default or empty: use the site default */ }
  return { source: 'app', username, displayName, bio: text(raw.bio, 280), links, tint: tintFor(username), avatarUrl };
}

function imageExt(buf) {
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

async function fetchAppProfiles() {
  const url = `${OLLO_API}/api/pages-profiles`;
  let res;
  try {
    res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
  } catch (e) {
    console.warn(`⚠ Could not reach ${url}: ${e.message}. Continuing with repository profiles only.`);
    return [];
  }
  if (!res.ok) {
    console.warn(`⚠ ${url} answered ${res.status}. Continuing with repository profiles only.`);
    return [];
  }
  let data;
  try { data = await res.json(); } catch {
    console.warn(`⚠ ${url} did not return JSON. Continuing with repository profiles only.`);
    return [];
  }
  if (!Array.isArray(data)) {
    console.warn(`⚠ ${url} did not return a list. Continuing with repository profiles only.`);
    return [];
  }
  const out = data.map(sanitizeAppProfile).filter(Boolean);
  console.log(`✓ ${out.length} opted-in profile(s) from ${OLLO_API} (${data.length - out.length} skipped as invalid)`);
  return out;
}

// Download each avatar so visitors never load anything from Supabase.
async function localizeAvatar(p) {
  if (!p.avatarUrl) return;
  try {
    const res = await fetch(p.avatarUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return;
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = buf.length <= MAX_AVATAR ? imageExt(buf) : null;
    if (!ext) return;
    p.avatarOut = `avatars/app-${p.username}.${ext}`;
    writeFileSync(join(DIST, p.avatarOut), buf);
  } catch { /* keep the default avatar */ }
}

// ---------- main ----------

const repoProfiles = loadProfiles();
console.log(`\n${repoProfiles.length} profile(s) valid.`);
if (CHECK_ONLY) process.exit(0);

// Repo profiles win if a username exists in both places.
const appProfiles = OLLO_API ? await fetchAppProfiles() : [];
const taken = new Set(repoProfiles.map((p) => p.username));
const profiles = [...repoProfiles, ...appProfiles.filter((p) => !taken.has(p.username))]
  .sort((a, b) => a.displayName.localeCompare(b.displayName));

const legal = readLegal();
rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'avatars'), { recursive: true });
for (const p of profiles) if (p.source === 'app') await localizeAvatar(p);
const write = (rel, html) => {
  const path = join(DIST, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
};

write('index.html', explorePage(profiles));
for (const p of profiles) write(`${p.username}/index.html`, profilePage(p));
write('add/index.html', addPage());
write('privacy/index.html', privacyPage(legal));
write('terms/index.html', termsPage(legal));
write('404.html', notFoundPage());
write('.nojekyll', '');

mkdirSync(join(DIST, 'assets'), { recursive: true });
for (const f of readdirSync(join(HERE, 'assets'))) copyFileSync(join(HERE, 'assets', f), join(DIST, 'assets', f));
for (const p of profiles) if (p.source !== 'app' && p.avatar) copyFileSync(join(PROFILES, p.avatar), join(DIST, p.avatar));

console.log(`Wrote ${DIST}`);
