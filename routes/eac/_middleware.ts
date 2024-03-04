import { loadJwtConfig } from "@fathym/eac";
import { buildJwtValidationHandler } from "@fathym/eac/fresh";
import { EaCAPIJWTPayload } from "../../src/api/_EaCAPIJWTPayload.ts";

export const handler = [
  buildJwtValidationHandler<EaCAPIJWTPayload>(loadJwtConfig()),
];
