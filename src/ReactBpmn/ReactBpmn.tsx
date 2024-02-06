import React, { useEffect, useLayoutEffect, useRef } from "react";

import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.development";

function ReactBpmn(props: { diagramXML }) {
    const bpmnViewer = new BpmnJS();

    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect (() => {
      bpmnViewer.attachTo(containerRef.current);

      if(props.diagramXML)
      {
        bpmnViewer.importXML(props.diagramXML)
      }

      return () => {
        bpmnViewer.destroy();
      }
    })

    return (
        <div className="react-bpmn-diagram-container" ref={containerRef}></div>
    );
}

export default ReactBpmn;