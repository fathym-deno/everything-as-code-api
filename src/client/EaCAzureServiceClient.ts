import {
  BillingAccount,
  EaCServiceDefinitions,
  Location,
  Subscription,
  TenantIdDescription,
} from "./.deps.ts";
import { EaCBaseClient } from "./EaCBaseClient.ts";

export class EaCAzureServiceClient extends EaCBaseClient {
  /** */
  constructor(baseUrl: URL, apiToken: string) {
    super(baseUrl, apiToken);
  }

  //#region API Methods
  public async BillingAccounts(
    entLookup: string,
    azureAccessToken: string,
  ): Promise<BillingAccount[]> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/azure/billing/accounts`),
      {
        method: "GET",
        headers: this.loadHeaders({
          "x-eac-azure-access-token": azureAccessToken,
        }),
      },
    );

    return await this.json(response);
  }

  public async CloudAPIVersions(
    entLookup: string,
    cloudLookup: string,
    svcDefs: EaCServiceDefinitions,
  ): Promise<Record<string, string>> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/azure/${cloudLookup}/api-versions`),
      {
        method: "POST",
        headers: this.loadHeaders(),
        body: JSON.stringify(svcDefs),
      },
    );

    return await this.json(response);
  }

  public async CloudAuthToken(
    entLookup: string,
    cloudLookup: string,
    scopes: string[],
  ): Promise<string> {
    const response = await fetch(
      this.loadClientUrl(
        `${entLookup}/azure/${cloudLookup}/auth-token?scope=${
          scopes.join(",")
        }`,
      ),
      {
        method: "GET",
        headers: this.loadHeaders(),
      },
    );

    return await this.json(response, "");
  }

  public async CloudEnsureProviders(
    entLookup: string,
    cloudLookup: string,
    svcDefs: EaCServiceDefinitions,
  ): Promise<{
    Locations: Location[];
  }> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/azure/${cloudLookup}/providers`),
      {
        method: "POST",
        headers: this.loadHeaders(),
        body: JSON.stringify(svcDefs),
      },
    );

    return await this.json(response);
  }

  public async CloudLocations(
    entLookup: string,
    cloudLookup: string,
    svcDefs: EaCServiceDefinitions,
  ): Promise<{
    Locations: Location[];
  }> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/azure/${cloudLookup}/locations`),
      {
        method: "POST",
        headers: this.loadHeaders(),
        body: JSON.stringify(svcDefs),
      },
    );

    return await this.json(response);
  }

  public async Subscriptions(
    entLookup: string,
    azureAccessToken: string,
  ): Promise<Subscription[]> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/azure/subscriptions`),
      {
        method: "GET",
        headers: this.loadHeaders({
          "x-eac-azure-access-token": azureAccessToken,
        }),
      },
    );

    return await this.json(response);
  }

  public async Tenants(
    entLookup: string,
    azureAccessToken: string,
  ): Promise<TenantIdDescription[]> {
    const response = await fetch(
      this.loadClientUrl(`${entLookup}/azure/tenants`),
      {
        method: "GET",
        headers: this.loadHeaders({
          "x-eac-azure-access-token": azureAccessToken,
        }),
      },
    );

    return await this.json(response);
  }
  //#endregion

  //#region Helpers
  //#endregion
}
