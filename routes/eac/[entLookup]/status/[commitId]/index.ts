// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../../src/api/_EaCAPIUserState.ts";
import { EaCStatus } from "../../../../../src/api/models/EaCStatus.ts";
import { denoKv } from "../../../../../configs/deno-kv.config.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to get the current status of an EaC.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(_req: Request, ctx: FreshContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const commitId: string = ctx.params.commitId;

    const status = await denoKv.get<EaCStatus>([
      "EaC",
      "Status",
      entLookup,
      "ID",
      commitId,
    ]);

    return respond(status?.value! || {});
  },
};
