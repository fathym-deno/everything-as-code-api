import { delay } from "../../src.deps.ts";
import { EaCStatus } from "../../api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../api/models/EaCStatusProcessingTypes.ts";
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
      return null;
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
  handler: (msg: T) => Promise<void>,
  sleepFor = 250,
) {
  const processing = await denoKv.get<string>(key);

  if (processing.value && processing.value !== owner) {
    await delay(sleepFor);

    await handler(msg);
  }

  await denoKv.set(key, owner);
}
