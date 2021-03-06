import * as aksVaultConfig from "config";
import * as propertiesVolume from "@hmcts/properties-volume";
propertiesVolume.addTo(aksVaultConfig);

const IDAM_SECRET = aksVaultConfig.secrets ? aksVaultConfig.secrets["em-showcase"]["show-oauth2-token"] : undefined;
const S2S_KEY = aksVaultConfig.secrets ? aksVaultConfig.secrets["em-showcase"]["microservicekey-em-gw"] : undefined;

export const config = {
    proxies: {
        assembly: {
            endpoints: [
                "/api/form-definitions",
                "/api/template-renditions",
                "/doc-assembly"
            ],
            target: process.env["REFORM_ENVIRONMENT"] ? process.env["DOCASSEMBLY_URL"] : "http://localhost:4631",
            pathRewrite: {
                "^/doc-assembly": "/api"
            }
        },
        dmStore: {
            endpoints: ["/documents"],
            target: process.env["REFORM_ENVIRONMENT"] ? process.env["DM_STORE_APP_URL"] : "http://localhost:4603"
        },
        annotation: {
            endpoints: ["/em-anno"],
            target: process.env["REFORM_ENVIRONMENT"] ? process.env["ANNOTATION_API_URL"] : "http://localhost:4623",
            pathRewrite: {
                "^/em-anno": "/api"
            }
        },
        npa: {
            endpoints: [
                "/api/markups",
                "/api/redaction"
            ],
            target: process.env["REFORM_ENVIRONMENT"] ? process.env["NPA_URL"] : "http://localhost:4624"
        },
        icp: {
            endpoints: ["/icp"],
            target: process.env["REFORM_ENVIRONMENT"] ? process.env["ICP_API_URL"] : "http://localhost:4621",
        }
    },
    idam: {
        url: process.env["IDAM_URL"] || "http://localhost:5000",
        client: "webshow",
        secret: IDAM_SECRET  || "AAAAAAAAAAAAAAAA",
        redirect: process.env["REDIRECT_URL"] || "https://em-show-aat.service.core-compute-aat.internal/oauth2/callback",
    },
    s2s: {
        url: process.env["S2S_URL"] || "http://localhost:4502",
        secret: S2S_KEY || "AAAAAAAAAAAAAAAA",
        microservice: "em_gw"
    },
    port: process.env.PORT || 1337,
    tokenRefreshTime: 60 * 60 * 1000
};
