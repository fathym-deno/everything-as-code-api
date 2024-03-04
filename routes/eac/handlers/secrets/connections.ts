// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import {
  eacGetSecrets,
  EaCSecretAsCode,
  EverythingAsCode,
  loadSecretClient,
} from "@fathym/eac";
import { EaCAPIUserState } from "../../../../src/api/_EaCAPIUserState.ts";
import { EaCHandlerConnectionsRequest } from "../../../../src/api/models/EaCHandlerConnectionsRequest.ts";
import { EaCHandlerConnectionsResponse } from "../../../../src/api/models/EaCHandlerConnectionsResponse.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to retrieve locations for the provided services.
   * @param _req
   * @param ctx
   * @returns
   */
  async POST(req: Request, ctx: FreshContext<any, EaCAPIUserState>) {
    const handlerRequest: EaCHandlerConnectionsRequest = await req.json();

    const eac: EverythingAsCode = handlerRequest.EaC;

    const parentEaC: EverythingAsCode = handlerRequest.ParentEaC!;

    const secretDef = handlerRequest.Model as EaCSecretAsCode;

    const secret = handlerRequest.Current as EaCSecretAsCode;

    const secretClient = await loadSecretClient(
      eac,
      secretDef.CloudLookup || secret.CloudLookup!,
      secretDef.KeyVaultLookup || secret.KeyVaultLookup!,
    );

    const secreted = await eacGetSecrets(secretClient, {
      Value: secretDef.Details?.Value || secret.Details!.Value!,
    });

    return respond({
      Model: {
        Details: {
          Value: secreted.Value,
        },
      } as EaCSecretAsCode,
    } as EaCHandlerConnectionsResponse);
  },
};
