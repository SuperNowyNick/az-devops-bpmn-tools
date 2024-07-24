import "azure-devops-ui/Core/override.css";

import { Header } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Splitter, SplitterDirection } from "azure-devops-ui/Splitter";

import * as React from "react";

import "azure-devops-ui/Core/override.css";
import "./BpmnDiff.scss";

import BpmnDiffDetailsPanel from "./BpmnDiffDetailsPanel";
import ReactBpmn, { BpmnMethods, BpmnStyle, Viewbox } from "../ReactBpmn/ReactBpmn";

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

    const [splitterDirection, setSplitterDirection] = React.useState(
        SplitterDirection.Horizontal
    )

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

    const focusOnElement = (id: string, removed?: boolean) => {
        if (isNavigating) return;
        isNavigating = true;
        const bpmnViewer = (removed ? childRef2.current : childRef1.current) as unknown as BpmnMethods;
        const viewBox = bpmnViewer.focusOn(id);
        const secondViewer = (removed ? childRef1.current : childRef2.current) as unknown as BpmnMethods;
        secondViewer.navigate(viewBox);
        isNavigating = false;
    }

    const fitViewboxes = () => {
        if (isNavigating) return;
        isNavigating = true;

        const viewer1 = childRef1.current as unknown as BpmnMethods;
        const viewer2 = childRef2.current as unknown as BpmnMethods;
        viewer1.fitToContainer();
        viewer2.fitToContainer();
        isNavigating = false;
    }

    const nearElement = React.useCallback(
        () => (
            <div
                style={{
                    padding: "15px",
                    overflow: "hidden",
                    width: "100%",
                    height: "100%"
                }}
            >
                <div style={{ minWidth: "100%", height: "100%" }}>
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
                    overflow: "hidden",
                }}
            >
                <div style={{ minWidth: "100%", height: "100%" }}>
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
                iconName: "Home",
            },
            id: "bpmnViewReset",
            important: true,
            subtle: true,
            onActivate: () => {
                isNavigating = true;
                (childRef1.current as BpmnMethods | null)?.resetView();
                isNavigating = false;
                syncViewbox(childRef2, (childRef1.current as BpmnMethods | null)?.getViewbox());
            },
            tooltipProps: {
                text: "Reset view",
            },
        },
        {
            iconProps: {
                iconName: "View",
            },
            id: "changeSplitterDirection",
            subtle: true,
            onActivate: () => {
                setSplitterDirection(splitterDirection == SplitterDirection.Horizontal
                    ? SplitterDirection.Vertical
                    : SplitterDirection.Horizontal)
            },
            tooltipProps: {
                text: "Change splitter orientation",
            },
        },
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
            <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
            <Splitter
                splitterDirection={splitterDirection}
                onRenderNearElement={nearElement}
                onRenderFarElement={farElement}
                onFixedSizeChanged={()=> {isNavigating = true; setTimeout(() => {isNavigating = false; fitViewboxes() }, 50) }}
            />
            { panelExpanded && <BpmnDiffDetailsPanel changes={changes} focusOn={(id: string, removed?: boolean) => { focusOnElement(id, removed);} } onClose={() => setPanelExpanded(false)}/>}
            </div>
        </Page>
    );
}

export default BpmnDiff;
