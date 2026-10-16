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
(project `steward-grc-www`), using the org's `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
secrets. Both custom domains are added to the Pages project in the Cloudflare dashboard, not by
this workflow.

On GitHub's free plan, org secrets aren't visible to a private repo, so this workflow can't read
`CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` until the org upgrades its plan or this repo goes
public.

## 🤝 Contributing

Read the org's [CONTRIBUTING](https://github.com/Steward-GRC/.github/blob/main/CONTRIBUTING.md) and
[SECURITY](https://github.com/Steward-GRC/.github/blob/main/SECURITY.md) guides. Every commit is
signed off (DCO).

## 🙏 Acknowledgements

Steward was originally written by [@Bugs5382](https://github.com/Bugs5382).

## ⚖️ License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
