import { useEffect } from 'react';
import rootEpic from '@/epics/root';
import MapComponent from '@/components/Map';
import Sketch from '@/components/Sketch';
import styles from './index.less';

export default function IndexPage() {
  useEffect(() => {
    window.epicMiddleware.run(rootEpic);
  }, []);

  return (
    <div className={styles.wrap}>
      <MapComponent />
      <Sketch />
    </div>
  );
}
