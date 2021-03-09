import Axios, { AxiosInstance } from "axios";
import * as otp from "otp";
import { config } from "../config";
import { logger } from "../logger";

/**
 * Client for the service auth provider API that fetches an S2S token
 */
export class ServiceAuthProviderClient {

    private readonly http: AxiosInstance;
    private readonly microservice: string;
    private readonly secret: string;

    constructor() {
        console.log("this is the s2s key", config.s2s.secret);
        console.log("this is the s2s URL", config.s2s.url);
        this.http = Axios.create({
            baseURL: config.s2s.url,
            headers: {
                "Content-Type": "application/json"
            }
        });
        this.microservice = config.s2s.microservice;
        this.secret = config.s2s.secret;
    }

    /**
     * Generate a one time password and fetch an S2S token
     */
    public async getToken(): Promise<string> {
        const body = {
            microservice: this.microservice,
            oneTimePassword: otp({ secret: this.secret }).totp(),
        };

        try {
            const response = await this.http.post("/lease", body);
            return `Bearer ${response.data}`;
        }
        catch (err) {
            logger.error("Error getting s2s token", err.message);
            throw err;
        }
    }
}
