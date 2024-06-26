import "azure-devops-ui/Core/override.css";

import { Header } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Splitter, SplitterDirection } from "azure-devops-ui/Splitter";

import * as React from "react";

import "azure-devops-ui/Core/override.css";
import "./BpmnDiff.scss";

import BpmnDiffDetailsPanel from "./BpmnDiffDetailsPanel";
import ReactBpmn, { BpmnMethods, BpmnStyle } from "../ReactBpmn/ReactBpmn";

import BpmnModdle from "bpmn-moddle";
import bpmnCompare, { BpmnDiff } from "../bpmn-compare/bpmn-compare";

function BpmnDiff(props: { bpmn1: string; bpmn2: string; style: BpmnStyle }) {
    let isNavigating = false;
    const childRef1 = React.useRef(null);
    const childRef2 = React.useRef(null);
    const viewBox = React.useRef(null);

    const [changes, setChanges] = React.useState(
        undefined as BpmnDiff | undefined
    );

    const [panelExpanded, setPanelExpanded] = React.useState(false);

    const loadDiff = async () => {
        const moddle = new BpmnModdle();
        const bpmn1 = await moddle.fromXML(props.bpmn1);
        const bpmn2 = await moddle.fromXML(props.bpmn2);

        let bpmnDiff = bpmnCompare(bpmn1, bpmn2);
        if (!changes) {
            setChanges(bpmnDiff);
        }
    };

    loadDiff();

    const syncViewbox = (ref, viewbox) => {
        if (isNavigating) return;
        isNavigating = true;
        const bpmnViewer = ref.current as unknown as BpmnMethods;
        bpmnViewer.navigate(viewbox);
        viewBox.current = viewbox;
        isNavigating = false;
    };

    const nearElement = React.useCallback(
        () => (
            <div
                style={{
                    padding: "15px",
                    width: "100%",
                    height: "100%",
                    overflow: "clip",
                    alignItems: "stretch",
                    display: "flex",
                }}
            >
                <div style={{ width: "8000px" }}>
                    <ReactBpmn
                        ref={childRef1}
                        diagramXML={props.bpmn1}
                        style={props.style}
                        changes={changes}
                        onLoad={() => viewBox.current && syncViewbox(childRef1, viewBox.current)}
                        onNavigate={(v) => syncViewbox(childRef2, v)}
                    />
                </div>
            </div>
        ),
        [changes]
    );

    const farElement = React.useCallback(
        () => (
            <div
                style={{
                    padding: "15px",
                    width: "100%",
                    height: "100%",
                    overflow: "clip",
                    alignItems: "stretch",
                    display: "flex",
                }}
            >
                <div style={{ width: "8000px" }}>
                    <ReactBpmn
                        ref={childRef2}
                        diagramXML={props.bpmn2}
                        style={props.style}
                        changes={changes}
                        onLoad={() => viewBox.current && syncViewbox(childRef2, viewBox.current)}
                        onNavigate={(v) => syncViewbox(childRef1, v)}
                    />
                </div>
            </div>
        ),
        [changes]
    );

    const HeaderCommandBarItems: IHeaderCommandBarItem[] = [
        {
            iconProps: {
                iconName: "Lightbulb",
            },
            id: "bpmnDiffDetails",
            important: true,
            onActivate: () => setPanelExpanded(true),
            text: "Details",
            tooltipProps: {
                text: "Open panel with diff details",
            },
        },
    ];

    return (
        <Page className="bpmn-preview">
            <Header commandBarItems={HeaderCommandBarItems} />
            <Splitter
                splitterDirection={SplitterDirection.Horizontal}
                onRenderNearElement={nearElement}
                onRenderFarElement={farElement}
            />
            { panelExpanded && <BpmnDiffDetailsPanel changes={changes} onClose={() => setPanelExpanded(false)}/>}
        </Page>
    );
}

export default BpmnDiff;
