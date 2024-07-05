import { determineOS } from "./determineOS.js";
import { determineArch } from "./determineArch.js";

const extensionRe = /\.(tar\.gz|tar\.xz|pkg|msi|exe|zip|7z)$/;
const uriRe =
  /(\/+(dist|download\/+release)\/+(node-latest\.tar\.gz|([^/]+)\/+((win-x64|win-x86|win-arm64|x64)?\/+?node\.exe|(x64\/)?node-+(v[0-9.]+)[.-]([^? ]+))))/;
const versionRe = /^v[0-9.]+$/;

export const logTransform2 = (jsonObj) => {
  if (
    jsonObj.ClientRequestMethod !== "GET" || // Drop anything that isnt a GET or a 200 range response
    jsonObj.EdgeResponseStatus < 200 ||
    jsonObj.EdgeResponseStatus >= 300
  ) {
    return;
  }

  if (jsonObj.EdgeResponseBytes < 1024) {
    // unreasonably small for something we want to measure
    return;
  }

  if (!extensionRe.test(jsonObj.ClientRequestPath)) {
    // not a file we care about
    return;
  }

  const requestPath = jsonObj.ClientRequestPath.replace(/\/\/+/g, "/");
  const uriMatch = requestPath.match(uriRe); // Check that the request is for an actual node file
  if (!uriMatch) {
    // what is this then?
    return;
  }

  const path = uriMatch[1];
  const pathVersion = uriMatch[4];
  const file = uriMatch[5];
  const winArch = uriMatch[6];
  const fileVersion = uriMatch[8];
  const fileType = uriMatch[9];

  let version = "";
  // version can come from the filename or the path, filename is best
  // but it may not be there (e.g. node.exe) so fall back to path version
  if (versionRe.test(fileVersion)) {
    version = fileVersion;
  } else if (versionRe.test(pathVersion)) {
    version = pathVersion;
  }

  const os = determineOS(path, file, fileType);
  const arch = determineArch(fileType, winArch, os);

  const line = [];
  const date = new Date(jsonObj.EdgeStartTimestamp / 1000 / 1000);
  line.push(date.toISOString().slice(0, 10)); // date
  line.push(jsonObj.ClientCountry.toUpperCase()); // country
  line.push(""); // state/province, derived from chunk.EdgeColoCode probably
  line.push(jsonObj.ClientRequestPath); // URI
  line.push(version); // version
  line.push(os); // os
  line.push(arch); // arch
  line.push(jsonObj.EdgeResponseBytes);

  return `${line.join(",")}\n`;
};
