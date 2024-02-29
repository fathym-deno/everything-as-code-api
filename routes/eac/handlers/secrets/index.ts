// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { merge, respond } from "@fathym/common";
import {
  EaCSecretAsCode,
  eacSetSecrets,
  EverythingAsCode,
  EverythingAsCodeClouds,
  loadSecretClient,
} from "@fathym/eac";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerRequest } from "../../../../src/api/models/EaCHandlerRequest.ts";
import { EaCHandlerResponse } from "../../../../src/api/models/EaCHandlerResponse.ts";
import { resolveDynamicValues } from "../../../../src/utils/eac/resolveDynamicValues.ts";
import { denoKv } from "../../../../configs/deno-kv.config.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req, ctx: FreshContext<any, EaCAPIUserState>) {
    const handlerRequest: EaCHandlerRequest = await req.json();

    console.log(
      `Processing EaC commit ${handlerRequest.CommitID} Secret processes for secret ${handlerRequest.Lookup}`,
    );

    const eac: EverythingAsCodeClouds & EverythingAsCode = handlerRequest.EaC;

    const currentSecrets = eac.Secrets || {};

    const secretLookup = handlerRequest.Lookup;

    const current = currentSecrets[secretLookup] || {};

    const secretDef = handlerRequest.Model as EaCSecretAsCode;

    let secretValue = secretDef.Details?.Value;

    if (secretValue && !secretValue.startsWith("$secret:")) {
      const resolved = await resolveDynamicValues(
        denoKv,
        {
          SecretValue: secretValue,
        },
        eac,
        ctx.state.JWT!,
      );

      secretValue = resolved.SecretValue;

      const secretClient = await loadSecretClient(
        eac,
        secretDef.CloudLookup || current.CloudLookup!,
        secretDef.KeyVaultLookup || current.KeyVaultLookup!,
      );

      const secreted = await eacSetSecrets(secretClient, secretLookup, {
        Value: secretValue,
      });

      secretDef.Details = merge(current.Details!, {
        Value: secreted.Value,
      });
    }

    return respond({
      Checks: [],
      Lookup: secretLookup,
      Messages: {
        Message: `The secret '${secretLookup}' has been handled.`,
      },
      Model: secretDef,
    } as EaCHandlerResponse);
  },
};
