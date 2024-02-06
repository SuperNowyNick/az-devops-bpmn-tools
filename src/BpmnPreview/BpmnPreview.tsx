import "azure-devops-ui/Core/override.css";

import * as SDK from "azure-devops-extension-sdk";

import { Page } from "azure-devops-ui/Page";
import { SurfaceBackground, SurfaceContext } from "azure-devops-ui/Surface";

import * as React from "react"; 
import * as ReactDOM from "react-dom";

import "azure-devops-ui/Core/override.css";
import './BpmnPreview.scss';

import ReactBpmn from "../ReactBpmn/ReactBpmn";
import style from "./variables.module.scss";

function BpmnPreview() {
    const [bpmn, setBpmn] = React.useState({ bpmn: null })

    React.useEffect(() => {
        const init = async () => {
            await SDK.init();
            await SDK.ready();
            const fileContent = SDK.getConfiguration().content;
            setBpmn(fileContent);
        }

        init();
    })

    return (
        <SurfaceContext.Provider value={{ background: SurfaceBackground.normal }}>
            <Page className="bpmn-preview">
                <ReactBpmn diagramXML={bpmn} style={{ fillColor: style.neutral2, strokeColor: style.text, labelColor: style.text }}/>
            </Page>
        </SurfaceContext.Provider>
    );
}

ReactDOM.render(<BpmnPreview />, document.getElementById("react-canvas"));
