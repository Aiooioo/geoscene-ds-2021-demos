import { defineConfig } from 'umi';

export default defineConfig({
  base: '/',
  publicPath: '/',
  antd: {},
  dva: {},
  lessLoader: {
    javascriptEnabled: true,
  },
  styles: ['https://localhost:8443/jsapi/4.19/esri/css/main.css'],
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  webpack5: {},
});
