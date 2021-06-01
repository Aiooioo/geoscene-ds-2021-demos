import { loadModules } from 'esri-loader';

export default async (geometry, symbol) => {
  const [Graphic] = await loadModules(['esri/Graphic']);

  return new Graphic({
    geometry,
    symbol,
  });
};
