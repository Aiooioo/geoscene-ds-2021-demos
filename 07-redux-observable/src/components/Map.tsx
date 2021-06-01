import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'umi';
import { INIT_VIEW } from '@/constants/action-types';

const MapComponent = () => {
  const domRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: INIT_VIEW,
      payload: {
        container: domRef.current,
      },
    });
  }, []);

  return <div style={{ width: '100%', height: '100%' }} ref={domRef} />;
};

export default MapComponent;
