import * as actions from '@/constants/action-types';
import { loadModules } from 'esri-loader';
import sketchUtils from '@/utils/sketch';

function createView(opts: any = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => (next) => (action) => next(action);
  }

  return (store) => (next) => async (action) => {
    switch (action.type) {
      case actions.INIT_VIEW: {
        const { payload } = action;
        const { container } = payload;

        // DOM container not defined
        if (!container) break;

        const [Map, MapView] = await loadModules([
          'esri/Map',
          'esri/views/MapView',
        ]);

        window.view = new MapView({
          container,
          map: new Map({
            basemap: 'osm',
          }),
        });

        return window.view.when(() => {
          sketchUtils.setView(window.view);
        });
      }
      default: {
        next(action);
        break;
      }
    }

    return Promise.resolve();
  };
}

export { createView };
