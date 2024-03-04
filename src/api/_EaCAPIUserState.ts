import { UserEaCRecord } from "./UserEaCRecord.ts";
import { EaCAPIState } from "./_EaCAPIState.ts";

export type EaCAPIUserState = EaCAPIState & {
  UserEaC?: UserEaCRecord;
};
