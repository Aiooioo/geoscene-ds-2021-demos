// 中间件注册
import { createEpicMiddleware } from 'redux-observable';
import { createView } from '@/middlewares/geoscene-view';
import { setDefaultOptions } from 'esri-loader';

setDefaultOptions({
  url: 'https://localhost:8443/jsapi/4.19/init.js',
});

const epicMiddleware = createEpicMiddleware();
window.epicMiddleware = epicMiddleware;

export const dva = {
  config: {
    onAction: [createView(), epicMiddleware],
    onError(err: any) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
