import React, { useEffect, forwardRef, useRef, memo, useImperativeHandle } from "react";

import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min";

export interface ReactBpmnProps {
  diagramXML: string,
  style?: BpmnStyle,
  onLoad?: () => void,
  onNavigate?: (viewbox : Viewbox) => void,
  changes?: any
}

export interface BpmnStyle {
  fillColor: string,
  strokeColor: string,
  labelColor: string
}

export interface BpmnMethods {
  navigate(viewbox: Viewbox): void;
  getViewbox(): Viewbox;
}

export interface Viewbox {
  [x: string | number | symbol]: unknown;
}

enum CHANGE_MARKERS {
  added = "diff-added",
  removed = "diff-removed",
  modified = "diff-changed",
  layout = "diff-layout-changed"
}

const ReactBpmn = memo(
  forwardRef((props: ReactBpmnProps, ref) => {
    const bpmnViewer = props.style ? new BpmnJS({
      bpmnRenderer: {
        defaultFillColor: props.style.fillColor,
        defaultStrokeColor: props.style.strokeColor,
        defaultLabelColor: props.style.labelColor
      }
    }) : new BpmnJS();
    
    useImperativeHandle(ref,
      (): BpmnMethods => ({
        navigate(viewbox) {
          bpmnViewer.get('canvas').viewbox(viewbox);
        },
        getViewbox() {
          return bpmnViewer.get('canvas').viewbox() as Viewbox
        }
      }))

    const containerRef = useRef<HTMLDivElement>(null);

    const onNavigate = (e: any) => {
      if (props.onNavigate)
        props.onNavigate(bpmnViewer.get('canvas').viewbox() as Viewbox);
    }

    const markChanges = (viewer, changes, marker) => {
      let element: keyof typeof changes;
      for (element in changes){
        try {viewer.get('canvas').addMarker(element, marker);}
        catch (e) { }
      }
    }

    const loadXml = async () => {
      await bpmnViewer.importXML(props.diagramXML);
      if(props.onLoad)
        props.onLoad();

      if(props.changes)
      {
        markChanges(bpmnViewer, props.changes._added, CHANGE_MARKERS.added);
        markChanges(bpmnViewer, props.changes._removed, CHANGE_MARKERS.removed);
        markChanges(bpmnViewer, props.changes._changed, CHANGE_MARKERS.modified);
        markChanges(bpmnViewer, props.changes._layoutChanged, CHANGE_MARKERS.layout);
      }
    }

    useEffect (() => {
      bpmnViewer.attachTo(containerRef.current);
      loadXml();

      if(props.onNavigate)
        bpmnViewer.on('canvas.viewbox.changing', onNavigate);

      return () => {
        bpmnViewer.destroy();
      }
    })

    return (
        <div className="react-bpmn-diagram-container" ref={containerRef}></div>
    );
}));

export default ReactBpmn;