// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../src/api/_EaCAPIUserState.ts";
import { EaCHandlerCheckRequest } from "../../../../src/api/models/EaCHandlerCheckRequest.ts";
import { EaCHandlerCheckResponse } from "../../../../src/api/models/EaCHandlerCheckResponse.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req: Request, _ctx: FreshContext<any, EaCAPIUserState>) {
    const checkRequest: EaCHandlerCheckRequest = await req.json();

    console.log(
      `Processing EaC commit ${checkRequest.CommitID} DevOps Action checks`,
    );

    return respond({
      CorelationID: checkRequest.CorelationID,
      Complete: true,
      HasError: false,
      Messages: {},
    } as EaCHandlerCheckResponse);
  },
};
