// deno-lint-ignore-file no-explicit-any
import { FreshContext, Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import { respond } from "@fathym/common";
import { EverythingAsCode, loadJwtConfig } from "@fathym/eac";
import { denoKv } from "../../configs/deno-kv.config.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EaCAPIUserState } from "../../src/api/EaCAPIUserState.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to get a user's EaC.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(req, ctx: FreshContext<any, EaCAPIUserState>) {
    const parentEntLookup = ctx.state.EnterpriseLookup;

    if (!parentEntLookup) {
      return respond(
        {
          Message: `The provided JWT is invalid.`,
        },
        {
          status: STATUS_CODE.Unauthorized,
        },
      );
    }

    const url = new URL(req.url);

    const entLookup = url.searchParams.get("entLookup")!;

    const username = url.searchParams.get("username")!;

    const expTime = Number.parseInt(
      url.searchParams.get("expTime") || `${60 * 60 * 1}`,
    );

    const eacRes = await denoKv.get<EverythingAsCode>(["EaC", entLookup]);

    const eac = eacRes.value;

    if (eac?.ParentEnterpriseLookup !== parentEntLookup) {
      return respond(
        {
          Message:
            `You are not authorized to generate a JWT for this enterprise.`,
        },
        {
          status: STATUS_CODE.Unauthorized,
        },
      );
    }

    const userEaC = await denoKv.get<UserEaCRecord>([
      "User",
      username,
      "EaC",
      entLookup,
    ]);

    if (!userEaC?.value) {
      return respond(
        {
          Message:
            `The requested user ${username} does not have access to the enterprise '${entLookup}'.`,
        },
        {
          status: STATUS_CODE.Unauthorized,
        },
      );
    }

    const jwt = await loadJwtConfig().Create(
      {
        EnterpriseLookup: entLookup,
        Username: username,
      },
      expTime,
    );

    return respond({
      Token: jwt,
    });
  },
};
