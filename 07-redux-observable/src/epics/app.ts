import { fromEventPattern, merge, of, from, concat, combineLatest } from 'rxjs';
import { isEqual } from 'lodash/fp';
import {
  map,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  filter,
  startWith,
  mapTo,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import {
  EPIC_ACTION_START_DRAW,
  EPIC_ACTION_END_DRAW,
  EPIC_ACTION_CANCEL_DRAW,
  EPIC_ACTION_SYMBOL,
} from '@/constants/action-types';
import sketchUtils from '@/utils/sketch';
import graphicBuilder from '@/utils/graphic';

const drawEpic = (action$, state$) => {
  return action$.pipe(
    ofType(EPIC_ACTION_START_DRAW),
    switchMap((drawTool) => {
      const promise = sketchUtils.activeDrawPoint();

      return from(promise).pipe(
        mergeMap(({ geometry }) => {
          return [
            { type: 'app/updateActiveTool', payload: '' },
            {
              type: 'app/updateCurrent',
              payload: null,
            },
            { type: 'app/resetDefaultGraphicSymbol' },
            {
              type: EPIC_ACTION_END_DRAW,
              payload: { geometry, tool: drawTool.payload },
            },
          ];
        }),
        startWith({
          type: 'app/updateActiveTool',
          payload: drawTool.payload,
        }),
      );
    }),
  );
};

const cancelEpic = (action$, state$) => {
  return action$.pipe(
    ofType(EPIC_ACTION_CANCEL_DRAW),
    tap(() => {
      sketchUtils.cancelDraw();
    }),
    mapTo({
      type: 'app/updateActiveTool',
      payload: '',
    }),
  );
};

const graphicEpic = (action$, state$) => {
  const symbol$ = state$.pipe(
    map(({ app }) => {
      return {
        symbol: app.symbol,
      };
    }),
    distinctUntilChanged(isEqual),
  );

  return action$.pipe(
    ofType(EPIC_ACTION_END_DRAW),
    withLatestFrom(symbol$),
    switchMap(([{ payload }, { symbol }]) => {
      const geometry = payload.geometry;

      return from(graphicBuilder(geometry, symbol)).pipe(
        tap((g) => {
          window.view.graphics.add(g);
        }),
        switchMap((graphic) => {
          return of({
            type: 'app/updateCurrent',
            payload: graphic,
          });
        }),
      );
    }),
  );
};

const symbolEpic = (action$, state$) => {
  const graphic$ = state$.pipe(map((store) => store.app.graphic));

  return action$.pipe(
    ofType(EPIC_ACTION_SYMBOL),
    withLatestFrom(graphic$),
    switchMap(([{ payload }, g]) => {
      const newG = g ? g.clone() : null;
      if (g) {
        window.view.graphics.remove(g);
      }
      if (newG) {
        newG.symbol = payload;
        window.view.graphics.add(newG);
      }

      return [
        {
          type: 'app/updateCurrent',
          payload: newG,
        },
        {
          type: 'app/updateGraphicSymbol',
          payload,
        },
      ];
    }),
  );
};

export default [drawEpic, cancelEpic, graphicEpic, symbolEpic];
