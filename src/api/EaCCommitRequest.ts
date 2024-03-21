import { EverythingAsCode } from "../src.deps.ts";
import { DenoKVNonce } from "../deno.deps.ts";

export type EaCCommitRequest = {
  CommitID: string;

  EaC: EverythingAsCode;

  JWT: string;

  ProcessingSeconds: number;

  Username: string;
} & DenoKVNonce;

export function isEaCCommitRequest(req: unknown): req is EaCCommitRequest {
  const commitRequest = req as EaCCommitRequest;

  return (
    commitRequest.EaC !== undefined &&
    typeof commitRequest.EaC.EnterpriseLookup === "string" &&
    commitRequest.CommitID !== undefined &&
    typeof commitRequest.CommitID === "string" &&
    commitRequest.JWT !== undefined &&
    typeof commitRequest.JWT === "string" &&
    commitRequest.ProcessingSeconds !== undefined &&
    typeof commitRequest.ProcessingSeconds === "number" &&
    commitRequest.Username !== undefined &&
    typeof commitRequest.Username === "string"
  );
}
