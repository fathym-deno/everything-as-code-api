// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import {
  EaCIoTAsCode,
  EverythingAsCodeClouds,
  EverythingAsCodeIoT,
} from "@fathym/eac";
import { EaCAPIUserState } from "../../../../src/api/_EaCAPIUserState.ts";
import { EaCHandlerRequest } from "../../../../src/api/models/EaCHandlerRequest.ts";
import { EaCHandlerResponse } from "../../../../src/api/models/EaCHandlerResponse.ts";
import { EaCHandlerErrorResponse } from "../../../../src/api/models/EaCHandlerErrorResponse.ts";
import { ensureIoTDevices } from "../../../../src/eac/iot.helpers.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req, _ctx: FreshContext<any, EaCAPIUserState>) {
    try {
      // const username = ctx.state.Username;

      const handlerRequest: EaCHandlerRequest = await req.json();

      console.log(
        `Processing EaC commit ${handlerRequest.CommitID} IoT processes for IoT ${handlerRequest.Lookup}`,
      );

      const eac: EverythingAsCodeIoT & EverythingAsCodeClouds =
        handlerRequest.EaC;

      const currentIoT = eac.IoT || {};

      const iotLookup = handlerRequest.Lookup;

      const current = currentIoT[iotLookup] || {};

      const iot = handlerRequest.Model as EaCIoTAsCode;

      const iotCloud = eac.Clouds![current.CloudLookup!];

      const devicesResp = await ensureIoTDevices(iotCloud, current, iot);

      if (Object.keys(devicesResp || {}).length === 0) {
        return respond({
          Checks: [],
          Lookup: iotLookup,
          Messages: {
            Message: `The iot '${iotLookup}' has been handled.`,
          },
          Model: iot,
        } as EaCHandlerResponse);
      } else {
        return respond({
          HasError: true,
          Messages: {
            Errors: devicesResp,
          },
        } as EaCHandlerErrorResponse);
      }
    } catch (err) {
      console.error(err);

      return respond({
        HasError: true,
        Messages: {
          Error: JSON.stringify(err),
        },
      } as EaCHandlerErrorResponse);
    }
  },
};
