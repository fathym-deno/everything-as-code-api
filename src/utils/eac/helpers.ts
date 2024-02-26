import {
  EaCHandler,
  EaCHandlers,
  EaCMetadataBase,
  EverythingAsCode,
  hasKvEntry,
  merge,
} from "../../src.deps.ts";
import { EaCHandlerCheckRequest } from "../../api/models/EaCHandlerCheckRequest.ts";
import { EaCHandlerCheckResponse } from "../../api/models/EaCHandlerCheckResponse.ts";
import {
  EaCHandlerErrorResponse,
  isEaCHandlerErrorResponse,
} from "../../api/models/EaCHandlerErrorResponse.ts";
import { EaCHandlerRequest } from "../../api/models/EaCHandlerRequest.ts";
import {
  EaCHandlerResponse,
  isEaCHandlerResponse,
} from "../../api/models/EaCHandlerResponse.ts";
import { EaCStatus } from "../../api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../api/models/EaCStatusProcessingTypes.ts";
import { EaCHandlerConnectionsRequest } from "../../api/models/EaCHandlerConnectionsRequest.ts";
import { EaCHandlerConnectionsResponse } from "../../api/models/EaCHandlerConnectionsResponse.ts";
import { EaCCommitRequest } from "../../api/models/EaCCommitRequest.ts";
import { waitOnProcessing } from "./waitForStatus.ts";

export async function callEaCHandler<T extends EaCMetadataBase>(
  loadEac: (entLookup: string) => Promise<EverythingAsCode>,
  handler: EaCHandler,
  commitReq: EaCCommitRequest,
  key: string,
  currentEaC: EverythingAsCode,
  diff: T,
): Promise<{
  Checks: EaCHandlerCheckRequest[];

  Errors: EaCHandlerErrorResponse[];

  Result: T;
}> {
  const current = (currentEaC[key] || {}) as T;

  const parentEaC = currentEaC?.ParentEnterpriseLookup
    ? await loadEac(currentEaC.ParentEnterpriseLookup)
    : undefined;

  if (handler != null) {
    const toExecute = Object.keys(diff || {}).map(async (diffLookup) => {
      const result = await fetch(handler.APIPath, {
        method: "post",
        body: JSON.stringify({
          CommitID: commitReq.CommitID,
          EaC: currentEaC,
          Lookup: diffLookup,
          Model: diff![diffLookup],
          ParentEaC: parentEaC,
        } as EaCHandlerRequest),
        headers: {
          Authorization: `Bearer ${commitReq.JWT}`,
        },
      });

      return {
        Lookup: diffLookup,
        Response: (await result.json()) as
          | EaCHandlerResponse
          | EaCHandlerErrorResponse,
      };
    });

    const handledResponses: {
      Lookup: string;
      Response: EaCHandlerResponse | EaCHandlerErrorResponse;
    }[] = await Promise.all(toExecute);

    const errors: EaCHandlerErrorResponse[] = [];

    const checks: EaCHandlerCheckRequest[] = [];

    if (current) {
      for (const handled of handledResponses) {
        const handledResponse = handled.Response;

        if (isEaCHandlerResponse(handledResponse)) {
          if (handled.Lookup !== handledResponse.Lookup) {
            current[handledResponse.Lookup] = current[handled.Lookup];

            delete current[handled.Lookup];
          }

          current[handledResponse.Lookup] = merge(
            current[handledResponse.Lookup] as object,
            handledResponse.Model as object,
          );

          handledResponse.Checks?.forEach((check) => {
            check.EaC = currentEaC;

            check.Type = key;
          });

          checks.push(...(handledResponse.Checks || []));
        } else if (isEaCHandlerErrorResponse(handledResponse)) {
          errors.push(handledResponse);
        }
      }
    }

    return {
      Checks: checks,
      Errors: errors,
      Result: current,
    };
  } else {
    return {
      Checks: [],
      Errors: [],
      Result: current,
    };
  }
}

export async function callEaCHandlerCheck(
  loadEaC: (entLookup: string) => Promise<EverythingAsCode>,
  handlers: EaCHandlers,
  jwt: string,
  req: EaCHandlerCheckRequest,
): Promise<EaCHandlerCheckResponse> {
  const handler = handlers[req.Type!]!;

  req.ParentEaC = req.EaC?.ParentEnterpriseLookup
    ? await loadEaC(req.EaC.ParentEnterpriseLookup)
    : undefined;

  const result = await fetch(`${handler.APIPath}/check`, {
    method: "post",
    body: JSON.stringify(req),
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const checkResp = (await result.json()) as EaCHandlerCheckResponse;

  return checkResp;
}

export async function callEaCHandlerConnections(
  loadEaC: (entLookup: string) => Promise<EverythingAsCode>,
  handler: EaCHandler,
  jwt: string,
  req: EaCHandlerConnectionsRequest,
): Promise<EaCHandlerConnectionsResponse> {
  req.ParentEaC = req.EaC?.ParentEnterpriseLookup
    ? await loadEaC(req.EaC.ParentEnterpriseLookup)
    : undefined;

  const result = await fetch(`${handler.APIPath}/connections`, {
    method: "post",
    body: JSON.stringify(req),
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const text = await result.text();

  try {
    const checkResp = JSON.parse(text) as EaCHandlerConnectionsResponse;

    return checkResp;
  } catch (err) {
    console.error(err);
    console.error(text);

    throw err;
  }
}

export async function eacExists(
  denoKv: Deno.Kv,
  entLookup: string,
): Promise<boolean> {
  let exists = await hasKvEntry(denoKv, ["EaC", entLookup]);

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Archive", entLookup]);
  }

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Processing", entLookup]);
  }

  return exists;
}

export async function invalidateProcessing(
  denoKv: Deno.Kv,
  entLookup: string,
  maxRunTimeSeconds = 60,
): Promise<void> {
  const status = await denoKv.get<EaCStatus>([
    "EaC",
    "Status",
    entLookup,
    "Eac",
  ]);

  if (status?.value) {
    const now = new Date(Date.now());

    const maxRunTime = new Date(
      status.value.StartTime.getSeconds() + maxRunTimeSeconds,
    );

    if (maxRunTime.getTime() < now.getTime()) {
      status.value.Processing = EaCStatusProcessingTypes.ERROR;

      status.value!.Messages = merge(status.value!.Messages, {
        Error: "Invalidated",
      });

      status.value.EndTime = new Date(Date.now());

      await markEaCProcessed(entLookup, denoKv.atomic())
        .set(["EaC", "Status", entLookup, "ID", status.value.ID], status)
        .commit();
    }
  } else {
    await markEaCProcessed(entLookup, denoKv.atomic()).commit();
  }
}

export function markEaCProcessed(
  entLookup: string,
  atomicOp: Deno.AtomicOperation,
): Deno.AtomicOperation {
  return atomicOp
    .delete(["EaC", "Processing", entLookup])
    .delete(["EaC", "Status", entLookup, "Eac"]);
}

export async function waitOnEaCProcessing<T>(
  denoKv: Deno.Kv,
  entLookup: string,
  commitId: string,
  msg: T,
  handler: (msg: T) => Promise<void>,
  maxRunTimeSeconds: number,
  sleepFor = 250,
): Promise<void> {
  await invalidateProcessing(denoKv, entLookup, maxRunTimeSeconds);

  const key = ["EaC", "Processing", entLookup];

  await waitOnProcessing(denoKv, key, msg, commitId, handler, sleepFor);
}
