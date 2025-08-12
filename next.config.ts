import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';
import type { NextConfig } from 'next';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti.import('./src/lib/env.ts');
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
