import { EaCMetadataBase, EverythingAsCode } from "../../src.deps.ts";

export type EaCHandlerCheckRequest =
  & {
    CommitID: string;

    CorelationID: string;

    EaC?: EverythingAsCode;

    ParentEaC?: EverythingAsCode;

    Type?: string;
  }
  & EaCMetadataBase;
