# website 🧭

> 🌐 The public Steward product site

This is the public marketing site for Steward: steward-grc.com and www.steward-grc.com. It's
separate from [steward-web](https://github.com/Steward-GRC/steward-web), which holds the product's
own staff and admin apps and its docs guide.

The site is a single static page for now, built with Vite and React and prerendered to plain
HTML. It's deployed to Cloudflare Pages only when a release is published; nothing goes live from a
push or a pull request. Every change lands through a pull request that the checks gate.

## 🛠️ Develop

```bash
npm install --ignore-scripts
npm run build      # prerendered static site in build/
```

## 🚀 Releases

Release Drafter keeps a draft release up to date from merged pull requests. Publishing that draft
creates the tag, and `.github/workflows/deploy.yml` puts that exact build live on Cloudflare Pages
(project `steward-grc-www`) with `wrangler pages deploy --branch=main`, so it lands as the
production deployment rather than a preview of the detached tag, using the org's `CLOUDFLARE_API_TOKEN`
and `CLOUDFLARE_ACCOUNT_ID` secrets. It only runs on a published release — no push, pull request or
manual trigger — and nothing is live until then. The workflow creates the `steward-grc-www` Pages
project itself the first time it doesn't find one; the custom domains are still added by hand to
the Pages project in the Cloudflare dashboard, not by this workflow.

## 🤝 Contributing

Read the org's [CONTRIBUTING](https://github.com/Steward-GRC/.github/blob/main/CONTRIBUTING.md) and
[SECURITY](https://github.com/Steward-GRC/.github/blob/main/SECURITY.md) guides. Every commit is
signed off (DCO).

## 🙏 Acknowledgements

Steward was originally written by [@Bugs5382](https://github.com/Bugs5382).

## ⚖️ License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
