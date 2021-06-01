import React from 'react';
import { useSelector, useDispatch } from 'umi';
import classes from 'classnames';
import Preview from '@/components/Preview';
import SymbolEdit from '@/components/Symbol';
import {
  EPIC_ACTION_START_DRAW,
  EPIC_ACTION_CANCEL_DRAW,
} from '@/constants/action-types';
import styles from './component.less';

const SketchPanel = () => {
  const dispatch = useDispatch();
  const selected = useSelector((store) => store.app.activeTool);
  const g = useSelector((store) => store.app.graphic);

  function drawPoint() {
    if (selected !== 'point') {
      dispatch({ type: EPIC_ACTION_START_DRAW, payload: 'point' });
    }
  }

  function cancelDraw() {
    if (!!selected) {
      dispatch({ type: EPIC_ACTION_CANCEL_DRAW });
    }
  }

  return (
    <div className={classes('esri-widget', 'esri-component', styles.panel)}>
      <h3>
        <strong>要素绘制</strong>
      </h3>
      <div className="esri-sketch__panel">
        <div className="esri-sketch__section">
          <button
            className={classes('esri-sketch__button', 'esri-icon-map-pin', {
              ['esri-sketch__button--selected']: selected === 'point',
            })}
            type="button"
            title="绘制点"
            onClick={drawPoint}
          ></button>
        </div>
        <div className="esri-sketch__section">
          <button
            className={classes('esri-sketch__button', 'esri-icon-deny')}
            type="button"
            title="取消绘制"
            disabled={!selected}
            onClick={cancelDraw}
          ></button>
        </div>
      </div>
      {g && <Preview />}
      {g && <SymbolEdit />}
    </div>
  );
};

export default SketchPanel;
