import {
  EaCServiceClient,
  EaCStatus,
  EaCStatusProcessingTypes,
  loadEaCSvc,
} from "./.deps.ts";
import { withStatusCheck } from "./withStatusCheck.ts";

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
