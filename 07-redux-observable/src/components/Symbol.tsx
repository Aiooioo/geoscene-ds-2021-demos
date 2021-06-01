import React, { CSSProperties } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Slider, Popover } from 'antd';
import { SketchPicker } from 'react-color';
import { EPIC_ACTION_SYMBOL } from '@/constants/action-types';

const colorStubStyle: CSSProperties = {
  display: 'flex',
  width: 80,
  height: 20,
  border: '1px solid #ddd',
  boxSizing: 'content-box',
  margin: 3,
};

const SymbolEdit = () => {
  const dispatch = useDispatch();
  const g = useSelector((store) => store.app.graphic);
  const symbol = useSelector((store) => store.app.symbol);

  function handleSizeChange(value) {
    dispatch({
      type: EPIC_ACTION_SYMBOL,
      payload: { ...symbol, size: value },
    });
  }

  function handleColorChange(value) {
    dispatch({
      type: EPIC_ACTION_SYMBOL,
      payload: { ...symbol, color: value.hex },
    });
  }

  return (
    <div>
      <h4>符号大小</h4>
      <div style={{ padding: '0 10px' }}>
        <Slider
          style={{ width: '100%' }}
          min={1}
          max={20}
          step={1}
          value={parseInt(symbol.size)}
          onChange={handleSizeChange}
        />
      </div>

      <h4 style={{ marginTop: 8 }}>填充颜色</h4>
      <div style={{ padding: '0 10px' }}>
        <Popover
          placement={'left'}
          content={
            <SketchPicker
              color={symbol.color}
              onChangeComplete={handleColorChange}
            />
          }
        >
          <span
            style={{
              ...colorStubStyle,
              background: symbol.color,
            }}
          ></span>
        </Popover>
      </div>
    </div>
  );
};

export default SymbolEdit;
