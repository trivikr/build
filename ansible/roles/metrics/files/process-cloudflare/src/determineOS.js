export const determineOS = (path, file, fileType) => {
  if (/node\.exe$/.test(file)) {
    return "win";
  }
  if (/\/node-latest\.tar\.gz$/.test(path)) {
    return "src";
  }
  if (fileType == null) {
    return "";
  }
  if (/msi$/.test(fileType) || /^win-/.test(fileType)) {
    return "win";
  }
  if (/^tar\..z$/.test(fileType)) {
    return "src";
  }
  if (/^headers\.tar\..z$/.test(fileType)) {
    return "headers";
  }
  if (/^linux-/.test(fileType)) {
    return "linux";
  }
  if (fileType === "pkg" || /^darwin-/.test(fileType)) {
    return "osx";
  }
  if (/^sunos-/.test(fileType)) {
    return "sunos";
  }
  if (/^aix-/.test(fileType)) {
    return "aix";
  }
  return "";
};
