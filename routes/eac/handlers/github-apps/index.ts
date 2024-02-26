// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import {
  EaCGitHubAppAsCode,
  EaCGitHubAppDetails,
  eacSetSecrets,
  EverythingAsCodeGitHub,
  loadSecretClient,
} from "@fathym/eac";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerRequest } from "../../../../src/api/models/EaCHandlerRequest.ts";
import { EaCHandlerResponse } from "../../../../src/api/models/EaCHandlerResponse.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req, _ctx: FreshContext<any, EaCAPIUserState>) {
    const handlerRequest: EaCHandlerRequest = await req.json();

    console.log(
      `Processing EaC commit ${handlerRequest.CommitID} GitHub App processes for app ${handlerRequest.Lookup}`,
    );

    const eac: EverythingAsCodeGitHub = handlerRequest.EaC;

    const currentGitHubApps = eac.GitHubApps || {};

    const gitHubAppLookup = handlerRequest.Lookup;

    const current = currentGitHubApps[gitHubAppLookup] || {};

    const gitHubApp = handlerRequest.Model as EaCGitHubAppAsCode;

    const cloudLookup = gitHubApp.CloudLookup || current.CloudLookup!;

    const keyVaultLookup = gitHubApp.KeyVaultLookup || current.KeyVaultLookup!;

    const secretClient = await loadSecretClient(
      eac,
      cloudLookup,
      keyVaultLookup,
    );

    const secretRoot = `github-app-${gitHubAppLookup}`;

    const secreted = await eacSetSecrets(secretClient, secretRoot, {
      ClientSecret: gitHubApp.Details?.ClientSecret,
      PrivateKey: gitHubApp.Details?.PrivateKey,
      WebhooksSecret: gitHubApp.Details?.WebhooksSecret,
    });

    gitHubApp.Details = {
      ...gitHubApp.Details,
      ...secreted,
    } as EaCGitHubAppDetails;

    return respond({
      Checks: [],
      Lookup: gitHubAppLookup,
      Messages: {
        Message: `The GitHubApp '${gitHubAppLookup}' has been handled.`,
      },
      Model: gitHubApp,
    } as EaCHandlerResponse);
  },
};
