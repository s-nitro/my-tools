# my-tools

A tiny "workbench" of free, standalone web tools, built with React + React
Router and deployed to GitHub Pages. Each tool lives at its own clean path:

```
yourname.github.io/my-tools/word-counter
yourname.github.io/my-tools/unit-converter
```

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Adding a new tool

1. Create `src/pages/tools/YourTool.jsx`. Default-export a React component —
   it doesn't need any special props.
2. Open `src/toolsRegistry.js`, import your component, and add an entry:

   ```js
   {
     path: 'your-tool',       // becomes /my-tools/your-tool
     name: 'Your Tool',
     blurb: 'One line describing what it does.',
     component: YourTool,
   }
   ```

3. That's it — it shows up on the home page and gets a route automatically.

## Deploying to GitHub Pages (one-time setup)

1. Create a new **public** GitHub repo named `my-tools` (or update
   `vite.config.js`'s `base` and `src/main.jsx`'s `basename` to match
   whatever you name it).
2. Push this project to that repo:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/my-tools.git
   git push -u origin main
   ```

3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**,
   choose **GitHub Actions**. That's the only manual step — the workflow in
   `.github/workflows/deploy.yml` handles the rest.
4. Push to `main` and check the **Actions** tab. Once the workflow finishes,
   your site is live at `https://YOUR_USERNAME.github.io/my-tools/`.

## Why it works with clean URLs

GitHub Pages has no server-side router, so it can't natively handle a direct
visit to `/my-tools/word-counter` — it'll 404. This project uses the
well-known [spa-github-pages](https://github.com/rafgraph/spa-github-pages)
trick: `public/404.html` catches the 404 and redirects to `index.html` with
the path encoded in the query string, and a small script in `index.html`
decodes it back before React Router takes over. You don't need to think
about this — it's already wired up.

## Renaming the repo / using a custom domain

- **Different repo name:** update `base` in `vite.config.js` and `basename`
  in `src/main.jsx` to `/your-new-name/`.
- **Custom domain:** add a `public/CNAME` file containing your domain, set
  `base: '/'` in `vite.config.js`, and `basename="/"` in `src/main.jsx`.
