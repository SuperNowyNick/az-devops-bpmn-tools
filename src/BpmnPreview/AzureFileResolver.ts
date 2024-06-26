import * as SDK from "azure-devops-extension-sdk";

import {
    CommonServiceIds,
    IHostNavigationService,
    getClient,
} from "azure-devops-extension-api";

import { GitRestClient } from "azure-devops-extension-api/Git/GitClient";
import { BuildRestClient } from "azure-devops-extension-api/Build/BuildClient";

const fileResolverInit = async (callback :(bpmn: string, previousBpmn?: string | null) => void) => {
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
        callback(files?.file ? files.file : fileContent, files.previousFile);
    }
    else
    {
        callback(fileContent);
    }
};

const loadPreviousFile = async (pageRoute, params) => {
    const client = getClient(GitRestClient);
    const iterations = await client.getPullRequestIterations(
        pageRoute.routeValues.GitRepositoryName,
        Number(pageRoute.routeValues.parameters),
        pageRoute.routeValues.project
    );

    const source = params.iteration
        ? iterations[params.iteration - 1].sourceRefCommit.commitId
        : iterations[iterations.length - 1].sourceRefCommit.commitId;

    const target = params.base
        ? iterations[params.base - 1].sourceRefCommit.commitId
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
    } catch (e) {
        return { file: null, previousFile: null };
    }
    try {
        previousFile = await buildClient.getFileContents(
            pageRoute.routeValues.project,
            "tfsGit",
            undefined,
            pageRoute.routeValues.GitRepositoryName,
            target,
            params.path
        );
        return { file, previousFile };
    } catch (e) {
        return { file: file, previousFile: null };
    }
};

export { fileResolverInit };