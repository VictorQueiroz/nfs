import {
  decodeNodeFromScratchInstallationInformation,
  encodeNodeFromScratchInstallationInformation
} from "../schema/0.0.1/main.jsb";
import persistentDirectoryData from "./persistentDirectoryData";

export default function persistentLocalInstallationInformation(rootDirectory: string) {
  return persistentDirectoryData(
    rootDirectory,
    encodeNodeFromScratchInstallationInformation,
    decodeNodeFromScratchInstallationInformation
  );
}
