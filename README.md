# Maxence Fontana — portfolio

Requires Node.js 22 or newer. No package installation.

- Edit `content.json` for copy, project entries, images and links.
- Run `node build.mjs` to generate `public/index.html`.
- Run `node preview.mjs` and open http://127.0.0.1:4173.
- Cloudflare Pages: framework None, build command `node build.mjs`, output `public`, production branch `main`. Keep the repository private if desired and connect only that repository.
- For an image, add an optimized file under `public/images/`, then provide `{"src":"images/example.webp","alt":"A contextual description"}` in the appropriate content field.

## Assets and information pending

- An approved portrait, plus project photos for French Space Days / SmallSat and Guit’Art.
- A publishable Airbus visual, if available. Internal images and technical details stay outside the site.
- An approved professional LinkedIn link or public email. The verified GitHub profile is the only current outbound link.
- Exact formal internship/apprenticeship titles and the Guit’Art competition name if they are to appear publicly.

## Design and provenance

The reference identifies its generator as Wowchemy 5.5.0 for Hugo. This is an independent static implementation using common academic portfolio conventions, with Roboto/Montserrat, a profile alongside a biography and alternating content bands. No source code, artwork or copy from the reference is bundled. The accent palette, component geometry, outlines and navigation differ. Search, media and publication filters are omitted because this portfolio has no corresponding corpus. Fonts load from Google Fonts, with local fallback.

