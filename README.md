# Lede — marketing site (v13)

Static HTML/CSS/JS rebuild of the joinlede.com redesign. It is built from the Figma file
`joinlede.com-redesign`, page *Homepage (26)*. There is no build step and no framework;
open the files or serve the folder.

| Page | File | Figma frame |
|---|---|---|
| Home | `index.html` | `4068:2` |
| Pricing | `pricing.html` | `4515:44` |
| Showcase (features) | `showcase.html` | `4520:58` |
| About | `about.html` | — (content from the v12 HTML about page) |

## Structure

```
index.html  pricing.html  showcase.html  about.html
css/lede.css     one shared stylesheet: tokens, type, nav, footer, form, cards
js/lede.js       one shared script: sticky header, reveals, form placeholder
assets/img/      raster images (webp)
assets/svg/      hand-drawn art exported from Figma
.nojekyll        tells GitHub Pages to serve files as-is
```

**Header behaviour**
- On the home page (`<body class="home">`), the big logo sits in the hero. The small
  wordmark appears in the header only once it sticks on scroll.
- Every other page shows the Figma header from the top: wordmark on the left, links
  and a button on the right.

**Links are relative** (`pricing.html`, not `/pricing.html`). This is required because
GitHub Pages serves a project site from a sub-path (`https://<user>.github.io/<repo>/`).

## Preview locally

```bash
python3 -m http.server 4174 --directory site
```

Then open http://localhost:4174.

## Publish on GitHub Pages

This folder is its own git repository. To publish it:

1. Create an empty repo on GitHub, for example `lede-site`.
2. Push: `git remote add origin https://github.com/<owner>/lede-site.git && git push -u origin main`
3. In the repo, go to Settings → Pages → Build and deployment. Set Source to *Deploy from a branch*,
   the branch to `main`, and the folder to `/ (root)`.

Visibility:
- A **public** repo gives a public URL.
- A **private** repo can use Pages only on a paid plan. On GitHub Enterprise Cloud, the
  site can be limited to org members.
- The pages carry `<meta name="robots" content="noindex">` so search engines skip the preview.

## Not wired up yet

- The contact form is a front-end placeholder. Submitting only shows the thank-you panel.
- Schibsted Grotesk stands in for the Adobe Fonts face; see the FONT SWAP note in `css/lede.css`.
