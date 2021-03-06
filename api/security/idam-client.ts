import Axios, { AxiosInstance } from "axios";
import { URLSearchParams } from "url";
import { logger } from "../logger";
import { config } from "../config";

const email = "a@b.com";
const password = "4590fgvhbfgbDdffm3lk4j";
const forename = "EM";
const surname = "showcase";

/**
 * IDAM client that creates a user then gets a token
 */
export class IdamClient {

  private readonly http: AxiosInstance;
  private readonly client: string;
  private readonly secret: string;
  private readonly redirect: string;

  constructor() {
    console.log("this is the idam key", config.idam.secret);
    console.log("this is the idam URL", config.idam.url);
    this.http = Axios.create({
      baseURL: config.idam.url
    });
    this.client = config.idam.client;
    this.secret = config.idam.secret;
    this.redirect = config.idam.redirect;
  }

  /**
   * Create a user then generate a token for it
   */
  public async getToken(): Promise<string> {

    let token = await this.getIdamTokenInIthc();
    if (token) {
      return `Bearer ${token}`;
    }
    await this.createUser();
    token = await this.getIdamToken();
    return `Bearer ${token}`;
  }

  private async createUser() {
    try {
      await this.http.post("/testing-support/accounts", { email, password, forename, surname });
    } catch (err) {
      logger.warn("could not create the user, possibly because the user already exists ", err.message);
      logger.debug("\n", err.stack);
    }
  }

  private async getIdamToken(): Promise<string> {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const params = new URLSearchParams();
    params.append("scope", "openid roles profile");
    params.append("grant_type", "password");
    params.append("redirect_uri", this.redirect);
    params.append("client_id", this.client);
    params.append("client_secret", this.secret);
    params.append("username", email);
    params.append("password", password);
    console.log("these are the params", params);
    try {
      const response = await this.http.post("/o/token", params, { headers });
      return response.data["access_token"];
    }
    catch (err) {
      logger.error("Error getting idam token", err.message);
      throw err;
    }
  }

  private async getIdamTokenInIthc(): Promise<string | undefined> {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const params = new URLSearchParams();
    params.append("scope", "openid roles profile");
    params.append("grant_type", "password");
    params.append("redirect_uri", this.redirect);
    params.append("client_id", this.client);
    params.append("client_secret", this.secret);
    params.append("username", "ithctestuser@hmcts.net");
    params.append("password", "Password123!");
    try {
      const response = await this.http.post("/o/token", params, { headers });
      return response.data["access_token"];
    }
    catch (err) {
      logger.warn("Error getting ITHC idam token", err.message);
      return undefined;
    }
  }
}
