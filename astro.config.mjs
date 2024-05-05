import { defineConfig } from 'astro/config';

// Integrations
// import svelte from '@astrojs/svelte';
import react from "@astrojs/react";
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

// Adapters
import vercelAdapter from '@astrojs/vercel/serverless';
import netlifyAdapter from '@astrojs/netlify';
import nodeAdapter from '@astrojs/node';
import cloudflareAdapter from '@astrojs/cloudflare';

// Helper function to unwrap both Vite and Node environment variables
const unwrapEnvVar = (varName, fallbackValue) => {
  const classicEnvVar = process?.env && process.env[varName];
  const viteEnvVar = import.meta.env[varName];
  return classicEnvVar || viteEnvVar || fallbackValue;
}

// Determine the deploy target (vercel, netlify, cloudflare, node)
const deployTarget = unwrapEnvVar('DEPLOY_TARGET', 'node');

// Determine the output mode (server, hybrid or static)
const output = unwrapEnvVar('OUTPUT', 'hybrid');

// The FQDN of where the site is hosted (used for sitemaps & canonical URLs)
const site = unwrapEnvVar('SITE_URL', 'https://web-check.xyz');

// The base URL of the site (if serving from a subdirectory)
const base = unwrapEnvVar('BASE_URL', '/');

// Initialize Astro integrations
const integrations = [react(), partytown(), sitemap()];

// Set the appropriate adapter, based on the deploy target
function getAdapter(target) {
  switch(target) {
    case 'vercel':
      return vercelAdapter();
    case 'netlify':
      return netlifyAdapter();
    case 'cloudflare':
      return cloudflareAdapter();
    case 'node':
      return nodeAdapter({ mode: 'middleware' });
    default:
      throw new Error(`Unsupported deploy target: ${target}`);
  }
}
const adapter = getAdapter(deployTarget);

// Print build information to console
console.log(
  `\n\x1b[1m\x1b[35m Preparing to start build of Web Check.... \x1b[0m\n`,
  `\x1b[35m\x1b[2mCompiling for "${deployTarget}" using "${output}" mode, `
  + `to deploy to "${site}" at "${base}"\x1b[0m\n`,
  `\x1b[2m\x1b[36m🛟 For documentation and support, visit the GitHub repo: ` +
  `https://github.com/lissy93/web-check \n`,
  `💖 Found Web-Check useful? Consider sponsoring us on GitHub ` +
  `to help fund maintenance & development.\x1b[0m\n`,
);

const buildOptions = {
  output: 'dist',
  format: 'esm',
};


const redirects = {
  '/': '/test',
  // '/results/[...target]': '/check/[...target]', // The old path was /results (redirect to maintain compatibility)
}

// Export Astro configuration
export default defineConfig({ output, base, integrations, site, adapter, redirects, buildOptions });

