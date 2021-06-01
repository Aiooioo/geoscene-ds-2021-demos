import { loadModules } from 'esri-loader';
import _ from 'lodash';

class SketchUtil {
  view = null;
  vm = null;
  vmCreated = false;

  tempLayer = null;

  drawingPromise = null;
  drawingResolve = null;
  drawingReject = null;

  async init() {
    const [GraphicsLayer, SketchViewModel] = await loadModules([
      'esri/layers/GraphicsLayer',
      'esri/widgets/Sketch/SketchViewModel',
    ]);

    const tempLyr = new GraphicsLayer({
      listMode: 'hide',
    });
    this.tempLayer = tempLyr;
    this.view.map.add(tempLyr);

    this.vm = new SketchViewModel({
      view: this.view,
      layer: tempLyr,
      updateOnGraphicClick: false,
    });

    this.vm.on('create', this.onDrawComplete.bind(this));
    this.vm.on(['update', 'undo', 'redo'], this.onGraphicUpdate.bind(this));
  }

  onDrawComplete(evt) {
    if (evt.state === 'complete') {
      const { graphic } = evt;
      const { geometry } = graphic;
      const { type } = geometry;

      if (type === 'point' || type === 'polyline' || type === 'polygon') {
        this.vm.layer.remove(graphic);
      }

      if (this.drawingResolve) {
        this.drawingResolve({
          state: 'create',
          geometry,
          graphic,
        });

        this.drawingPromise = null;
        this.drawingResolve = null;
        this.drawingReject = null;
      }
    }
  }

  onGraphicUpdate(evt) {
    // get the graphic as it is being updated
    const graphic = evt.graphics[0];
    console.log(evt.state);
    if (evt.aborted) {
      this.vm.layer = this.tempLayer;
    } else if (evt.state === 'complete') {
      this.vm.layer = this.tempLayer;
      const { geometry } = graphic;
      const { type } = geometry;

      if (this.drawingResolve) {
        this.drawingResolve({
          state: 'update',
          geometry,
          graphic,
        });

        this.drawingPromise = null;
        this.drawingResolve = null;
        this.drawingReject = null;
      }
    }
  }

  setView(view) {
    this.view = view;

    this.init().then(() => {
      this.vmCreated = true;
    });
  }

  wrapSketchEventInPromise() {
    if (_.isFunction(this.drawingReject)) {
      // reject previous drawing
      this.drawingReject();

      this.drawingPromise = null;
      this.drawingResolve = null;
      this.drawingReject = null;
    }

    const that = this;
    this.drawingPromise = new Promise((res, rej) => {
      that.drawingResolve = res;
      that.drawingReject = rej;
    });
    return this.drawingPromise;
  }

  completePrevEdit() {
    // if (this.vm.state === 'active') {
    this.vm.cancel();
    // }
  }

  startEditGraphics(graphics) {
    this.vm.layer = graphics[0].layer;

    const that = this;
    setTimeout(() => {
      that.vm.update(graphics, {
        multipleSelectionEnabled: false,
      });
    }, 100);
  }

  async activeDrawPoint() {
    if (!this.vmCreated) throw new Error('还没有准备好');

    this.vm.create('point');

    return this.wrapSketchEventInPromise();
  }

  clearSketchGraphics() {
    if (this.vm) {
      this.completePrevEdit();

      this.vm.layer.removeAll();
    }
  }

  cancelDraw() {
    if (!this.vmCreated) return;

    if (this.vm) {
      this.vm.cancel();
    }

    if (_.isFunction(this.drawingReject)) {
      // reject previous drawing
      this.drawingReject();

      this.drawingPromise = null;
      this.drawingResolve = null;
      this.drawingReject = null;
    }
  }
}

export default new SketchUtil();
