// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCSourceAsCode, EverythingAsCodeSources } from "@fathym/eac";
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

    const eac: EverythingAsCodeSources = handlerRequest.EaC;

    const sourceDef = handlerRequest.Model as EaCSourceAsCode;

    return respond({
      Model: {} as EaCSourceAsCode,
    } as EaCHandlerConnectionsResponse);
  },
};
