import appEpics from './app';
import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';

const RootEpic = (action$, store$, dependencies) => {
  return combineEpics(...appEpics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );
};

export default RootEpic;
