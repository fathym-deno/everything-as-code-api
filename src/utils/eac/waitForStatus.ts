import { delay } from "../../src.deps.ts";
import { EaCStatus } from "../../api/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../api/EaCStatusProcessingTypes.ts";
import { EaCServiceClient } from "../../eac/client/EaCServiceClient.ts";
import { loadEaCSvc } from "../../eac/client/clientFactories.ts";

export async function waitForStatus(
  eacSvc: EaCServiceClient,
  entLookup: string,
  commitId: string,
  sleepFor = 400,
): Promise<EaCStatus> {
  return await withStatusCheck(async () => {
    return await eacSvc.Status(entLookup, commitId);
  }, sleepFor);
}

export async function waitForStatusWithFreshJwt(
  parentEaCSvc: EaCServiceClient,
  entLookup: string,
  commitId: string,
  username: string,
  sleepFor = 400,
): Promise<EaCStatus> {
  return await withStatusCheck(async () => {
    const eacJwt = await parentEaCSvc.JWT(entLookup, username);

    if (!eacJwt.Token) {
      return {
        EnterpriseLookup: entLookup,
        ID: commitId,
        Messages: { Operation: "Waiting for valid JWT" },
        Processing: EaCStatusProcessingTypes.QUEUED,
        StartTime: new Date(),
        Username: username,
      };
    }
    const eacSvc = await loadEaCSvc(eacJwt.Token);

    return await eacSvc.Status(entLookup, commitId);
  }, sleepFor);
}

export async function withStatusCheck(
  action: () => Promise<EaCStatus | null>,
  sleepFor = 400,
): Promise<EaCStatus> {
  let status: EaCStatus | null = null;

  do {
    status = (await action()) || status;

    await delay(sleepFor);
  } while (
    status?.Processing != EaCStatusProcessingTypes.COMPLETE &&
    status?.Processing != EaCStatusProcessingTypes.ERROR
  );

  return status;
}

export async function waitOnProcessing<T>(
  denoKv: Deno.Kv,
  key: Deno.KvKey,
  msg: T,
  owner: string,
  handler: (denoKv: Deno.Kv, msg: T) => Promise<void>,
  sleepFor = 250,
) {
  const processing = await denoKv.get<string>(key);

  if (processing.value && processing.value !== owner) {
    await delay(sleepFor);

    await handler(denoKv, msg);
  }

  await denoKv.set(key, owner);
}
