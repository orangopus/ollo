# Read-only ollo on GitHub Pages

A static version of ollo: public profiles from `profiles/*.json`, built into
plain HTML and published to the `gh-pages` branch. There's no server, no
database and no sign-in. GitHub is the store, and pull requests are the edit
button.

## How it works

- `profiles/<username>.json` holds one public profile (rules in `profiles/README.md`).
- `pages-site/build.mjs` validates every profile and writes `pages-site/dist/`.
  It uses only Node built-ins.
- `.github/workflows/pages-validate.yml` runs the build on pull requests and
  explains any errors in the log.
- `.github/workflows/pages-deploy.yml` builds on every merge to `main` and
  deploys `dist/` with GitHub's Pages actions (no `gh-pages` branch).
- With `OLLO_API` set (the deploy workflow uses `https://ollo.bio`), the
  build also fetches `/api/pages-profiles`: ollo.bio users who switched on
  **Show my profile on ollo.thng.my**. Those profiles and their avatars exist
  only in `dist/`, never in git. Repo profiles win on a username clash. If
  the API can't be reached, the build continues with repository profiles only.
- The deploy also runs every 6 hours, so opt-outs and deleted accounts drop
  off within about 6 hours.
- The privacy contact and controller come from `legal` in `app.config.ts`,
  shared with the full app.

## Domain and setup

The site is served at **https://ollo.thng.my/**.

1. **Settings → Pages:** Source is **GitHub Actions** and the custom domain is
   `ollo.thng.my`. Both are already set.
2. **DNS (Cloudflare, zone `thng.my`):** add a `CNAME` record with name `ollo`
   and target `orangopus.github.io`, with the proxy **off** (DNS only, grey
   cloud), so GitHub can issue the HTTPS certificate.
3. Once GitHub shows the certificate as issued, tick **Enforce HTTPS** in
   Settings → Pages.
4. Recommended: verify `thng.my` for the ORANGOPUS organisation
   (**Org settings → Pages → Add a domain**, then add the TXT record it gives
   you). This stops other GitHub accounts from claiming `*.thng.my`.

The deploy workflow reads the domain and base path from
`actions/configure-pages`, so changing the domain in Settings needs no code
change.

## Database migration (needed once)

Run `supabase/migrations/20261009120000_profiles_show_on_pages.sql` against
the Supabase database (SQL editor or `supabase db push`). It adds
`profiles.show_on_pages`, off by default. Until it exists,
`/api/pages-profiles` fails and deploys publish only repository profiles.

## Run locally

```sh
node pages-site/build.mjs          # validate + build into pages-site/dist
node pages-site/build.mjs --check  # validate only
OLLO_API=https://ollo.bio node pages-site/build.mjs  # include opted-in ollo.bio profiles
```

## Not included (compared with ollo.bio)

Sign-in, posting, likes, live streaming, Spotify, custom CSS/HTML and custom
domains. Those need the server and database the full app uses.
