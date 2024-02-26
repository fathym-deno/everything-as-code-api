import { EaCMetadataBase } from "../../src.deps.ts";

export type EaCHandlerConnectionsResponse = {
  Model: EaCMetadataBase;
};

export function isEaCHandlerConnectionsResponse(
  res: unknown,
): res is EaCHandlerConnectionsResponse {
  const handlerResponse = res as EaCHandlerConnectionsResponse;

  return (
    handlerResponse.Model !== undefined
  );
}
