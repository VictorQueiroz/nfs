import {
  decodeNodeFromScratchInstallationInformation,
  encodeNodeFromScratchInstallationInformation,
} from "../schema/0.0.1/main.jsb";
import defaults from "./config";
import persistentDirectoryData from "./persistentDirectoryData";

export default function persistentLocalInstallationInformation() {
  return persistentDirectoryData(
    defaults.rootDirectory,
    encodeNodeFromScratchInstallationInformation,
    decodeNodeFromScratchInstallationInformation,
  );
}
