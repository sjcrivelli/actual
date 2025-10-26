import { transform } from 'esbuild';

export default function jsxInJs() {
  return {
    name: 'jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      // Only .js files in this package's src
      if (!id.endsWith('.js')) return null;
      if (!id.includes('/packages/desktop-client/src/')) return null;

      // Quick heuristic to avoid needless work
      if (!code.includes('<')) return null;

      const result = await transform(code, {
        loader: 'jsx',
        jsx: 'automatic',
        sourcemap: true,
        sourcefile: id,
      });
      return { code: result.code, map: result.map };
    },
  };
}
