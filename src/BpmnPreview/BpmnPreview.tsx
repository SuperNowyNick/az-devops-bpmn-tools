import "azure-devops-ui/Core/override.css";

import { fileResolverInit } from "./AzureFileResolver";

import { Page } from "azure-devops-ui/Page";
import { SurfaceBackground, SurfaceContext } from "azure-devops-ui/Surface";

import * as React from "react";
import * as ReactDOM from "react-dom";

import "./BpmnPreview.scss";

import ReactBpmn from "../ReactBpmn/ReactBpmn";
import BpmnDiff from "../BpmnDiff/BpmnDiff";
import style from "../variables.module.scss";
import EmptyBpmn from "./Empty.bpmn";

function BpmnPreview() {
    const [bpmn, setBpmn] = React.useState<string>(EmptyBpmn.default);
    const [previousBpmn, setPreviousBpmn] = React.useState<string | null>(null);

    React.useEffect(() => {
        fileResolverInit((file, prevFile) => { setBpmn(file); if(prevFile) setPreviousBpmn(prevFile) })        
    });

    const bpmnStyle = {
        fillColor: style.background,
        strokeColor: style.text,
        labelColor: style.text,
    };

    const bpmnViewer =
        previousBpmn == null ? (
            <Page className="bpmn-preview"><ReactBpmn diagramXML={bpmn} style={bpmnStyle} /></Page>
        ) : (
            <BpmnDiff bpmn1={bpmn} bpmn2={previousBpmn} style={bpmnStyle} />
        );

    return (
        <SurfaceContext.Provider value={{ background: SurfaceBackground.normal }}>
            {bpmnViewer}
        </SurfaceContext.Provider>
    );
}

ReactDOM.render(<BpmnPreview />, document.getElementById("react-canvas"));
