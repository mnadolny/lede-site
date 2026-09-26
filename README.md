# Lede — marketing site (v13)

Static HTML/CSS/JS rebuild of the joinlede.com redesign. It is built from the Figma file
`joinlede.com-redesign`, page *Homepage (26)*. There is no build step and no framework;
open the files or serve the folder.

| Page | File | Figma frame |
|---|---|---|
| Home | `index.html` | `4068:2` |
| Pricing | `pricing.html` | `4515:44` |
| Showcase (features) | `showcase.html` | `4520:58` |
| About | `about.html` | — no frame yet; content from the v12 about page |

## Structure

```
index.html  pricing.html  showcase.html  about.html
css/lede.css     one shared stylesheet: tokens, type, nav, footer, form, cards
js/lede.js       one shared script: sticky header, reveals, form placeholder
assets/img/      raster images (webp)
assets/svg/      hand-drawn art exported from Figma
.nojekyll        tells GitHub Pages to serve files as-is
```

**Design notes**
- Colour, type and spacing come from the Figma frames at 1440px. The primary blue is `#3644FB`, and the type is Schibsted Grotesk only.
- The hand-drawn art (logos, brackets, underlines, corners, arrow) is exported straight from Figma into `assets/svg/`.
- The home feature carousel works: dots, arrow keys, swipe, and a click on a peeking card all move it. The Figma frame shows it static.

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

## Published

Live at **https://mnadolny.github.io/lede-site/**. The repo is public, and Pages deploys from `main` at `/ (root)`.
Pushing to `main` redeploys the site within a minute or two.

**Keeping it out of search results**
- Every page carries `<meta name="robots" content="noindex, nofollow">`. Keep that tag on any new page.
- Don't add a `robots.txt` that blocks crawling. Crawlers only read `robots.txt` from the domain root
  (`mnadolny.github.io/robots.txt`), not from this sub-path. Blocking crawling would also stop search
  engines from seeing the noindex tag, so a linked page could still show up as a bare URL.
- GitHub Pages can't send custom headers such as `X-Robots-Tag`, so the meta tag is the tool here.
- noindex keeps the pages out of search results. It does not make them private: anyone with the link,
  or anyone who opens the public repo, can see them.

## Not wired up yet

- The contact form is a front-end placeholder. Submitting only shows the thank-you panel.
- Schibsted Grotesk stands in for the Adobe Fonts face; see the FONT SWAP note in `css/lede.css`.
