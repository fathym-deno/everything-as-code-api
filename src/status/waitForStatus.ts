import { EaCServiceClient, EaCStatus } from "./.deps.ts";
import { withStatusCheck } from "./withStatusCheck.ts";

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
