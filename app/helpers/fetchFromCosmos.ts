import axios from "axios";
import CryptoJS from "crypto-js";

// Azure REST API Documentation:
// https://learn.microsoft.com/en-us/rest/api/cosmos-db/list-documents

// Stolen shamelessly from:
// https://github.com/blazerroadg/react-native-azure-cosmos/blob/master/headers.js
export const AzureToken = (
  method: string,
  masterKey: string,
  url: string,
  date: string
) => {
  // Rip apart the URL to extract the resource and resource type.
  let strippedurl = url.replace(new RegExp("^https?://[^/]+/"), "/");
  const strippedparts = strippedurl.split("/");
  const truestrippedcount = strippedparts.length - 1;
  let resourceId = "";
  let resType = "";

  if (truestrippedcount % 2) {
    resType = strippedparts[truestrippedcount];
    if (truestrippedcount > 1) {
      var lastPart = strippedurl.lastIndexOf("/");
      resourceId = strippedurl.substring(1, lastPart);
    }
  } else {
    resType = strippedparts[truestrippedcount - 1];
    strippedurl = strippedurl.substring(1);
    resourceId = strippedurl;
  }

  var verb = method.toLowerCase();
  var key = CryptoJS.enc.Base64.parse(masterKey);

  var payload =
    (verb || "").toLowerCase() +
    "\n" +
    (resType || "").toLowerCase() +
    "\n" +
    (resourceId || "") +
    "\n" +
    (date || "").toLowerCase() +
    "\n" +
    "" +
    "\n";

  var signature = CryptoJS.HmacSHA256(payload, key);
  var base64Bits = CryptoJS.enc.Base64.stringify(signature);
  var MasterToken = "master";
  var TokenVersion = "1.0";

  const auth = encodeURIComponent(
    "type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + base64Bits
  );

  return auth;
};

export const AzureDocHeader = (token: string, date: string) => {
  return {
    accept: "application/json",
    "x-ms-version": "2018-12-31",
    "x-ms-max-item-count": 1000,
    Authorization: token,
    "x-ms-date": date,
    "Content-Type": "application/json",
  };
};

export default async <Type>(
  masterKey: string,
  accountName: string,
  databaseId: string,
  containerId: string
): Promise<Type[]> => {
  // Construct the request URL.
  const requestUrl = `https://${accountName}.documents.azure.com/dbs/${databaseId}/colls/${containerId}/docs`;

  // The date must be in a specific format.
  const today = new Date();
  const UTCstring = today.toUTCString();

  // Create the Authorization token and the headers.
  const auth = AzureToken("get", masterKey, requestUrl, UTCstring);
  const headers = AzureDocHeader(auth, UTCstring);

  // Make a GET request with custom headers
  try {
    const response = await axios.get(requestUrl, {
      headers: headers,
      responseType: "json",
    });

    const results = response.data.Documents as Array<Type>;
    return results;
  } catch (error) {
    console.log(error);
    return [];
  }
};
