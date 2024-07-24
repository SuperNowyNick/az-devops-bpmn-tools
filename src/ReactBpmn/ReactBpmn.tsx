import React, { useEffect, forwardRef, useRef, memo, useImperativeHandle } from "react";

import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min";
import { BpmnDiff, ElementChange } from "../bpmn-compare/bpmn-compare";

export interface ReactBpmnProps {
  diagramXML: string,
  style?: BpmnStyle,
  onLoad?: () => void,
  onNavigate?: (viewbox : Viewbox) => void,
  changes?: BpmnDiff
}

export interface BpmnStyle {
  fillColor: string,
  strokeColor: string,
  labelColor: string
}

export interface BpmnMethods {
  navigate(viewbox: Viewbox): void;
  getViewbox(): Viewbox;
  resetView(): void;
  focusOn(id: string): Viewbox,
  fitToContainer(): void
}

export interface Viewbox {
  [x: string | number | symbol]: unknown | any;
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
          if(viewbox.height == Infinity || viewbox.width == Infinity || viewbox.scale == 0) return;
          const currentViewbox = bpmnViewer.get('canvas').viewbox();
          viewbox.width = currentViewbox.outer.width;
          viewbox.height = currentViewbox.outer.height;
          bpmnViewer.get('canvas').viewbox(viewbox);
        },
        getViewbox() {
          return bpmnViewer.get('canvas').viewbox() as Viewbox
        },
        resetView() {
          bpmnViewer.get('canvas').zoom('fit-viewport');
        },
        focusOn(id: string) {
          const element = bpmnViewer.get('elementRegistry')._elements[id].element;
          let oldViewbox = bpmnViewer.get('canvas').viewbox();
          const point = element.waypoints
            ? { x: element.waypoints[0].x, y: element.waypoints[0].y }
            : { x: element.x + element.width/2, y: element.y + element.height/2 };

          oldViewbox.x = point.x - oldViewbox.outer.width/2;
          oldViewbox.y = point.y - oldViewbox.outer.height/2;
          oldViewbox.width = oldViewbox.outer.width;
          oldViewbox.height = oldViewbox.outer.height;

          bpmnViewer.get('canvas').viewbox(oldViewbox);
          return oldViewbox;
        },
        fitToContainer() {
          let oldViewbox = bpmnViewer.get('canvas').viewbox();
          oldViewbox.width = oldViewbox.outer.width;
          oldViewbox.height = oldViewbox.outer.height;
          bpmnViewer.get('canvas').viewbox(oldViewbox);
        }
      }))

    const containerRef = useRef<HTMLDivElement>(null);

    const onNavigate = (e: any) => {
      if (props.onNavigate)
        props.onNavigate(bpmnViewer.get('canvas').viewbox() as Viewbox);
    }

    const markChanges = (viewer, changes : ElementChange[], marker) => {
      changes.forEach(x => {
        try {viewer.get('canvas').addMarker(x.id, marker);}
        catch (e) { }
      });
    }

    const loadXml = async () => {
      await bpmnViewer.importXML(props.diagramXML);
      if(props.onLoad)
        props.onLoad();

      if(props.changes)
      {
        markChanges(bpmnViewer, props.changes.added, CHANGE_MARKERS.added);
        markChanges(bpmnViewer, props.changes.removed, CHANGE_MARKERS.removed);
        markChanges(bpmnViewer, props.changes.changed, CHANGE_MARKERS.modified);
        markChanges(bpmnViewer, props.changes.layoutChanged, CHANGE_MARKERS.layout);
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