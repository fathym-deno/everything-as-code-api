// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../../../src/api/_EaCAPIUserState.ts";
import { denoKv } from "../../../../../../configs/deno-kv.config.ts";
import { EverythingAsCodeClouds, loadAzureCloudCredentials } from "@fathym/eac";

export const handler: Handlers = {
  /**
   * Use this endpoint to retrieve locations for the provided services.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(req: Request, ctx: FreshContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const cloudLookup: string = ctx.params.cloudLookup;

    const url = new URL(req.url);

    const scopes: string[] = (url.searchParams.get("scope") as string).split(
      ",",
    );

    const eacResult = await denoKv.get<EverythingAsCodeClouds>([
      "EaC",
      entLookup,
    ]);

    const eac = eacResult.value!;

    const creds = await loadAzureCloudCredentials(eac, cloudLookup);

    const authToken = await creds.getToken(scopes);

    return respond({
      Token: authToken.token,
    });
  },
};
