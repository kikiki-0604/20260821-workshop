import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages hosts project sites at https://<user>.github.io/<repo>/,
// so all asset URLs need to be prefixed with the repository name.
// Update this if the repository is ever renamed.
export default defineConfig({
  plugins: [react()],
  base: '/20260821-workshop/',
});
