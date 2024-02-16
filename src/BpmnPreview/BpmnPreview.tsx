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

    const source = params.iteration
        ? iterations[params.iteration-1].sourceRefCommit.commitId
        : iterations[iterations.length-1].sourceRefCommit.commitId;

    const target = params.base
        ? iterations[params.base-1].sourceRefCommit.commitId
        : iterations[0].targetRefCommit.commitId;

    const buildClient = getClient(BuildRestClient);
    let file = null as string | null;
    let previousFile = null as string | null;
    try {
        file = await buildClient.getFileContents(
            pageRoute.routeValues.project,
            "tfsGit",
            undefined,
            pageRoute.routeValues.GitRepositoryName,
            source,
            params.path
        );
    } catch(e) { return {file: null, previousFile: null}; }
    try {
        previousFile = await buildClient.getFileContents(
            pageRoute.routeValues.project,
            "tfsGit",
            undefined,
            pageRoute.routeValues.GitRepositoryName,
            target,
            params.path
        );
        return {file, previousFile};
    } catch (e) {
        return {file: file, previousFile: null};
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

            const navigationService =
                await SDK.getService<IHostNavigationService>(
                    CommonServiceIds.HostNavigationService
                );

            const pageRoute = await navigationService.getPageRoute();
            const params = await navigationService.getQueryParams();

            if (pageRoute.id == "ms.vss-code-web.pull-request-details-route") {
                const files = await loadPreviousFile(pageRoute, params);
                if(files?.file)
                    setBpmn(files.file);
                else
                    setBpmn(fileContent);
                if(files?.previousFile)
                    setPreviousBpmn(files.previousFile);
            }
            else
            {
                setBpmn(fileContent);
            }
        };

        init();
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
