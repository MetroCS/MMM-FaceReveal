const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

function isImageFile(filename) {
  return /\.(png|jpe?g|gif|webp|bmp)$/i.test(filename);
}

function stripSuffix(filename, suffix) {
  const name = path.parse(filename).name; // No extension
  return name.endsWith(suffix) ? name.slice(0, -suffix.length) : null;
}

function resolvePaths(moduleDir, moduleName, userPath) {
  // Treat non-absolute paths as relative to the module folder
  if (!path.isAbsolute(userPath)) {
    const fsPath = path.join(moduleDir, userPath);
    const urlPath = `/modules/${moduleName}/` + userPath.replace(/\\/g, "/").replace(/^\/+/, "");
    return { fsPath, urlPath };
  }

  // Absolute paths are readable from disk, but usually NOT web-served.
  return { fsPath: userPath, urlPath: null };
}

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification !== "MMFR_GET_PAIRS") return;

    try {
      const moduleDir = __dirname;
      const moduleName = "MMM-FaceReveal";

      const faces = resolvePaths(moduleDir, moduleName, payload.facesPath);
      const cards = resolvePaths(moduleDir, moduleName, payload.cardsPath);

      if (!faces.urlPath || !cards.urlPath) {
        this.sendSocketNotification("MMFR_ERROR", {
          message:
          "Use module-relative paths (recommended). " +
	    "Put images under modules/MMM-FaceReveal/ and " +
	    "set facesPath/cardsPath like 'images/faces' and 'images/cards'."
        });
        return;
      }

      const faceSuffix = payload.faceSuffix || "_face";
      const cardSuffix = payload.cardSuffix || "_card";

      const faceFiles = fs
            .readdirSync(faces.fsPath, { withFileTypes: true })
            .filter((d) => d.isFile() && isImageFile(d.name))
            .map((d) => d.name);

      const cardFiles = fs
            .readdirSync(cards.fsPath, { withFileTypes: true })
            .filter((d) => d.isFile() && isImageFile(d.name))
            .map((d) => d.name);

      // Build maps: key -> filename
      const faceMap = new Map();
      for (const f of faceFiles) {
        const key = stripSuffix(f, faceSuffix);
        if (key) faceMap.set(key, f);
      }

      const cardMap = new Map();
      for (const f of cardFiles) {
        const key = stripSuffix(f, cardSuffix);
        if (key) cardMap.set(key, f);
      }

      // Pair only keys that exist in both
      const keys = [];
      for (const k of faceMap.keys()) {
        if (cardMap.has(k)) keys.push(k);
      }
      keys.sort((a, b) => a.localeCompare(b));

      const pairs = keys.map((k) => ({
        key: k,
        faceUrl: faces.urlPath + "/" + faceMap.get(k),
        cardUrl: cards.urlPath + "/" + cardMap.get(k)
      }));

      this.sendSocketNotification("MMFR_PAIRS", { pairs });
    } catch (err) {
      this.sendSocketNotification("MMFR_ERROR", {
        message: err && err.message ? err.message : String(err)
      });
    }
  }
});
