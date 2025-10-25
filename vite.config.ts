// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   preview:{
//     host:true,
//     port:8080,
//   }
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path'

const localUrl = (port: number) => `http://localhost:${port}/assets/remoteEntry.js`;

const productionUrl = (url: string) => `${url}/assets/remoteEntry.js`;

const production = true;

const prod = {
  compMfe: productionUrl('https://comp-mfe.vercel.app'),
};

const local = {
  compMfe: localUrl(5001),
};

export default defineConfig({
  base: './',
  plugins: [
    react(),
    federation({
      name: 'container',
      remotes: production ? prod : local,
      shared: ['react', 'react-dom'],
    }),
  ],
  preview: {
    host: true,
    port: 8080,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  }
});
