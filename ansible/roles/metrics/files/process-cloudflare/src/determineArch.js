export const determineArch = (fileType, winArch, os) => {
  if (fileType != null) {
    if (fileType.indexOf("x64") >= 0 || fileType === "pkg") {
      // .pkg for Node.js <= 0.12 were universal so may be used for either x64 or x86
      return "x64";
    }
    if (fileType.indexOf("x86") >= 0) {
      return "x86";
    }
    if (fileType.indexOf("armv6") >= 0) {
      return "armv6l";
    }
    if (fileType.indexOf("armv7") >= 0) {
      // 4.1.0 had a misnamed binary, no 'l' in 'armv7l'
      return "armv7l";
    }
    if (fileType.indexOf("arm64") >= 0) {
      return "arm64";
    }
    if (fileType.indexOf("ppc64le") >= 0) {
      return "ppc64le";
    }
    if (fileType.indexOf("ppc64") >= 0) {
      return "ppc64";
    }
    if (fileType.indexOf("s390x") >= 0) {
      return "s390x";
    }
  }

  if (os === "win") {
    // we get here for older .msi files and node.exe files
    if (winArch && winArch.indexOf("x64") >= 0) {
      // could be 'x64' or 'win-x64'
      return "x64";
    } // could be 'win-x86' or ''
    return "x86";
  }

  return "";
};
