import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: this must match your GitHub repo name exactly.
// If your repo is github.com/yourname/my-tools, your site will live at
// https://yourname.github.io/my-tools/  — so base stays '/my-tools/'.
// If you rename the repo, update this to match (e.g. '/some-other-name/').
export default defineConfig({
  plugins: [react()],
  base: '/my-tools/',
})
