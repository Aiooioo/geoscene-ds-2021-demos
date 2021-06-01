const defaultSymbol = {
  type: 'simple-marker',
  size: 9,
  color: 'red',
};

export default {
  namespace: 'app',
  state: {
    activeTool: '',

    graphic: null,

    symbol: defaultSymbol,
  },

  effects: {},

  reducers: {
    resetDefaultGraphicSymbol(state) {
      return { ...state, symbol: defaultSymbol };
    },
    updateGraphicSymbol(state, action) {
      return { ...state, symbol: action.payload };
    },
    updateCurrent(state, action) {
      return { ...state, graphic: action.payload };
    },
    updateActiveTool(state, action) {
      return { ...state, activeTool: action.payload };
    },
  },
};
