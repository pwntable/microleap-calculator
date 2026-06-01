import { defineConfig } from 'vite';

export default defineConfig({
  base: '/microleap-calculator/',
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});
