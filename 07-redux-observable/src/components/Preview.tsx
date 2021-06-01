import React, { useRef, useEffect } from 'react';
import { useSelector } from 'umi';
import { loadModules } from 'esri-loader';

function clearDom(container) {
  while (container.childNodes && container.childNodes.length > 0) {
    container.removeChild(container.childNodes[0]);
  }
}

const Preview = () => {
  const previewDom = useRef();
  const g = useSelector((store) => store.app.graphic);

  useEffect(() => {
    if (g) {
      if (previewDom.current) {
        loadModules(['esri/symbols/support/symbolPreview']).then(
          ([symbolPreview]) => {
            symbolPreview
              .renderPreviewHTML(g.symbol.clone())
              .then((previewEl) => {
                clearDom(previewDom.current);

                previewDom.current.appendChild(previewEl);
              });
          },
        );
      }
    }
  }, [g]);

  return (
    <div>
      <h4>符号预览</h4>
      <p style={{ padding: '0 10px' }} ref={previewDom}></p>
    </div>
  );
};

export default Preview;
