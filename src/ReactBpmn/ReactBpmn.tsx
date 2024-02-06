import React, { useLayoutEffect, useRef } from "react";

import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min";

function ReactBpmn(props: { style?: { fillColor: string, strokeColor: string, labelColor: string }, diagramXML }) {
    const bpmnViewer = props.style ? new BpmnJS({
      bpmnRenderer: {
        defaultFillColor: props.style.fillColor,
        defaultStrokeColor: props.style.strokeColor,
        defaultLabelColor: props.style.labelColor
      }
    }) : new BpmnJS();
    
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