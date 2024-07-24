import * as SDK from "azure-devops-extension-sdk";

import {
    CommonServiceIds,
    IHostNavigationService,
    IPageRoute,
    getClient,
} from "azure-devops-extension-api";

import { GitRestClient } from "azure-devops-extension-api/Git/GitClient";
import { BuildRestClient } from "azure-devops-extension-api/Build/BuildClient";

const PullRequestRouteID = "ms.vss-code-web.pull-request-details-route";
const CommitCmpRouteID = "ms.vss-code-web.commit-new-route";

const fileResolverInit = async (
    callback: (bpmn: string, previousBpmn?: string | null) => void
) => {
    await SDK.init();
    await SDK.ready();

    const defaultFileContent = SDK.getConfiguration().content;

    const navigationService = await SDK.getService<IHostNavigationService>(
        CommonServiceIds.HostNavigationService
    );

    const pageRoute = await navigationService.getPageRoute();
    const params = await navigationService.getQueryParams();

    let fileResolution = { file: null as any, previousFile: null as any};

    switch (pageRoute.id) {
        case PullRequestRouteID:
            fileResolution= await loadPreviousPullRequestFile(pageRoute,params);
            break;
        case CommitCmpRouteID:
            fileResolution = await loadPreviousCommitCmpFile(pageRoute,params);
            break;
    }
    
    callback(fileResolution.file ? fileResolution.file : defaultFileContent, fileResolution.previousFile);
};

const loadPreviousPullRequestFile = async (pageRoute: IPageRoute, params) => {
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

    return await tryLoadFiles(pageRoute, source, target, params.path);
};

const loadPreviousCommitCmpFile = async (pageRoute: IPageRoute, params) => {
    const client = getClient(GitRestClient);

    const commit = await client.getCommit(
        pageRoute.routeValues.parameters,
        pageRoute.routeValues.GitRepositoryName,
        pageRoute.routeValues.project
    );
    const baseVersion = commit.commitId;
    const targetVersion = commit.parents[0];

    return await tryLoadFiles(pageRoute, baseVersion, targetVersion, params.path);
};

const tryLoadFiles = async (pageRoute: IPageRoute, source, target, path) => {
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
            path
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
            path
        );
        return { file, previousFile };
    } catch (e) {
        return { file: file, previousFile: null };
    }
}

export { fileResolverInit };
