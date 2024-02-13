import "azure-devops-ui/Core/override.css";

import * as SDK from "azure-devops-extension-sdk";
import {
    CommonServiceIds,
    IHostNavigationService,
    getClient,
} from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git/GitClient";
import { BuildRestClient } from "azure-devops-extension-api/Build/BuildClient";

import { Page } from "azure-devops-ui/Page";
import { SurfaceBackground, SurfaceContext } from "azure-devops-ui/Surface";

import * as React from "react";
import * as ReactDOM from "react-dom";

import "azure-devops-ui/Core/override.css";
import "./BpmnPreview.scss";

import ReactBpmn from "../ReactBpmn/ReactBpmn";
import BpmnDiff from "../BpmnDiff/BpmnDiff";
import style from "../variables.module.scss";
import EmptyBpmn from "./Empty.bpmn";

const loadPreviousFile = async (pageRoute, params) => {

    const client = getClient(GitRestClient);
    const iterations = await client.getPullRequestIterations(
        pageRoute.routeValues.GitRepositoryName,
        Number(pageRoute.routeValues.parameters),
        pageRoute.routeValues.project
    );

    const iteration = params.base
        ? iterations[params.base]
        : iterations[0];
    const buildClient = getClient(BuildRestClient);
    try {
        const file = await buildClient.getFileContents(
            pageRoute.routeValues.project,
            "tfsGit",
            undefined,
            pageRoute.routeValues.GitRepositoryName,
            iteration.targetRefCommit.commitId,
            params.path
        );
        return file;
    } catch (e) {
        return;
    }
}

function BpmnPreview() {
    const [bpmn, setBpmn] = React.useState<string>(EmptyBpmn.default);
    const [previousBpmn, setPreviousBpmn] = React.useState<string | null>(null);

    React.useEffect(() => {
        const init = async () => {
            await SDK.init();
            await SDK.ready();
            const fileContent = SDK.getConfiguration().content;
            setBpmn(fileContent);

            const navigationService =
                await SDK.getService<IHostNavigationService>(
                    CommonServiceIds.HostNavigationService
                );
            const pageRoute = await navigationService.getPageRoute();
            const params = await navigationService.getQueryParams();

            if (pageRoute.id == "ms.vss-code-web.pull-request-details-route") {
                const previousFile = await loadPreviousFile(pageRoute, params);
                if(previousFile)
                    setPreviousBpmn(previousFile);
            }
        };

        init();
    });

    const bpmnStyle = {
        fillColor: style.neutral2,
        strokeColor: style.text,
        labelColor: style.text,
    };

    const bpmnViewer =
        previousBpmn == null ? (
            <ReactBpmn diagramXML={bpmn} style={bpmnStyle} />
        ) : (
            <BpmnDiff bpmn1={bpmn} bpmn2={previousBpmn} style={bpmnStyle} />
        );

    return (
        <SurfaceContext.Provider
            value={{ background: SurfaceBackground.normal }}
        >
            <Page className="bpmn-preview">{bpmnViewer}</Page>
        </SurfaceContext.Provider>
    );
}

ReactDOM.render(<BpmnPreview />, document.getElementById("react-canvas"));
