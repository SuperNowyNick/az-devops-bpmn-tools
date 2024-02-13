import "azure-devops-ui/Core/override.css";

import * as SDK from "azure-devops-extension-sdk";

import { Splitter, SplitterDirection } from "azure-devops-ui/Splitter";

import * as React from "react"; 

import "azure-devops-ui/Core/override.css";
import './BpmnDiff.scss';

import ReactBpmn, { BpmnMethods, BpmnStyle } from "../ReactBpmn/ReactBpmn";

import BpmnModdle from 'bpmn-moddle'
import { diff } from 'bpmn-js-differ'

function BpmnDiff(props: { bpmn1 : string, bpmn2 : string, style : BpmnStyle } ) {
    let isNavigating = false;
    const childRef1 = React.useRef(null);
    const childRef2 = React.useRef(null);

    const [bpmn, setBpmn] = React.useState({ bpmn1: props.bpmn1 as any, bpmn2: props.bpmn2 as any})
    const [changes, setChanges] = React.useState(null as any);

    const loadDiff = async () => {
        const moddle = new BpmnModdle();
        const bpmn1 = await moddle.fromXML(bpmn.bpmn1);
        const bpmn2 = await moddle.fromXML(bpmn.bpmn2);

        let bpmnDiff = diff(bpmn2.rootElement, bpmn1.rootElement);

        if(!changes)
            {
                setChanges(bpmnDiff);
            }
    }

    loadDiff();

    const syncViewbox = (ref, viewbox) => {
        if(isNavigating) return;
        isNavigating = true;
        const bpmnViewer = ref.current as unknown as BpmnMethods;
        bpmnViewer.navigate(viewbox);
        isNavigating = false;
    }

    React.useEffect(() => {
        const init = async () => {
            await SDK.init();
            await SDK.ready();
            const fileContent = SDK.getConfiguration().content;
            setBpmn(fileContent);
        }

        //init();
    })

    const nearElement = React.useCallback( () => (
        <div style={{ padding: "15px", width: "100%", height: "100%", overflow: "clip", alignItems: "stretch", display: "flex" }}>
        <div style={{ width: "8000px" }}>
            <ReactBpmn
                ref={childRef1}
                diagramXML={bpmn.bpmn1}
                style={props.style}
                changes={changes}
                onNavigate={(v) => syncViewbox(childRef2, v)} />
        </div></div>
    ), [changes]);

    const farElement = React.useCallback( () => (
        <div style={{ padding: "15px", width: "100%", height: "100%", overflow: "clip", alignItems: "stretch", display: "flex" }}>
        <div style={{ width: "8000px" }}>
            <ReactBpmn
                ref={childRef2}
                diagramXML={bpmn.bpmn2}
                style={props.style}
                changes={changes}
                onNavigate={(v) => syncViewbox(childRef1, v)} />
        </div></div>
    ), [changes]);

    return (
        <Splitter 
            splitterDirection={SplitterDirection.Horizontal} 
            onRenderNearElement={nearElement} 
            onRenderFarElement={farElement} />
    );
}

export default BpmnDiff;
