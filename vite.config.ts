import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Make the main CSS file non-blocking by injecting it with the
 * `media="print"` + `onload="this.media='all'"` pattern. The browser
 * downloads it at low priority without delaying first paint, then swaps
 * it to `all` once it arrives. The critical CSS is already inlined in
 * index.html, so the hero renders immediately and the full stylesheet
 * layers in seamlessly.
 */
function nonBlockingCSS(): Plugin {
  return {
    name: 'non-blocking-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /(<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/index-[^"]+\.css)"/,
        '$1" media="print" onload="this.media=\'all\'"',
      );
    },
  };
}

/**
 * Preload the lazy-loaded hero HTML chunks (hero-desktop.html,
 * hero-mobile.html) so they start fetching immediately after the main
 * bundle, not after React boots and the dynamic import fires. This
 * shaves the gap between "JS loaded" and "hero design rendered".
 *
 * Uses closeBundle + filesystem write because Vite's own HTML plugin
 * rewrites the index.html asset after generateBundle, overwriting any
 * in-memory changes.
 */
function preloadHeroChunks(): Plugin {
  const heroChunkPattern = /hero-(desktop|mobile)-[A-Za-z0-9_-]+\.js$/;
  let heroChunkPaths: string[] = [];

  return {
    name: 'preload-hero-chunks',
    generateBundle(_opts, bundle) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && heroChunkPattern.test(name)) {
          heroChunkPaths.push(`/${name}`);
        }
      }
    },
    closeBundle() {
      if (heroChunkPaths.length === 0) return;
      const htmlPath = resolve('dist/index.html');
      if (!existsSync(htmlPath)) return;
      const html = readFileSync(htmlPath, 'utf-8');
      if (html.includes('hero-desktop')) return; // already injected
      const preloadTags = heroChunkPaths
        .map((src) => `<link rel="modulepreload" crossorigin href="${src}">`)
        .join('\n    ');
      const updated = html.replace(
        '</head>',
        `    ${preloadTags}\n  </head>`,
      );
      writeFileSync(htmlPath, updated);
    },
  };
}

export default defineConfig({
  plugins: [react(), nonBlockingCSS(), preloadHeroChunks()],
  esbuild: {
    pure: ['console.log', 'console.debug', 'console.info'],
    drop: ['debugger'],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react')) return 'react';
          }
        },
      },
    },
  },
});
