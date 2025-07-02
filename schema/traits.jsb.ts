import { NodeFromScratchInstallationInformation } from "./0.0.1/main.jsb";
import { NodeFromScratchInstallationConfigurationInformation } from "./0.0.1/main.jsb";
import { isNodeFromScratchInstallationInformation } from "./0.0.1/main.jsb";
import { ISerializer } from "./__types__";
import { encodeNodeFromScratchInstallationInformation } from "./0.0.1/main.jsb";
import { IDeserializer } from "./__types__";
import { decodeNodeFromScratchInstallationInformation } from "./0.0.1/main.jsb";
import { defaultNodeFromScratchInstallationInformation } from "./0.0.1/main.jsb";
import { compareNodeFromScratchInstallationInformation } from "./0.0.1/main.jsb";
import { isNodeFromScratchInstallationConfigurationInformation } from "./0.0.1/main.jsb";
import { encodeNodeFromScratchInstallationConfigurationInformation } from "./0.0.1/main.jsb";
import { decodeNodeFromScratchInstallationConfigurationInformation } from "./0.0.1/main.jsb";
import { defaultNodeFromScratchInstallationConfigurationInformation } from "./0.0.1/main.jsb";
import { compareNodeFromScratchInstallationConfigurationInformation } from "./0.0.1/main.jsb";
export type InstallationInformation = Readonly<NodeFromScratchInstallationInformation>;
export function isInstallationInformationTrait(value: unknown): value is InstallationInformation {
    if(isNodeFromScratchInstallationInformation(value)) return true;
    return false;
}
export function encodeInstallationInformationTrait(__s: ISerializer,value: InstallationInformation) {
    switch(value._name) {
        case '001.main.NodeFromScratchInstallationInformation':
            return encodeNodeFromScratchInstallationInformation(__s,value);
    }
    throw new Error(`Failed to encode: Received invalid value on "_name" property. We got "${value['_name']}" value, but this function was expecting to receive one of the following:\n\t- 001.main.NodeFromScratchInstallationInformation\n\n\nPossible cause is that maybe this type simply does not extend this trait, and somehow the type-checking prevented you from calling this function wrongly.`);
}
export function decodeInstallationInformationTrait(__d: IDeserializer) {
    const __id = __d.readInt32();
    __d.rewind(4);
    let value: NodeFromScratchInstallationInformation;
    switch(__id) {
        case 559808368: {
            const tmp = decodeNodeFromScratchInstallationInformation(__d);
            if(tmp === null) return null;
            value = tmp;
            break;
        }
        default: return null;
    }
    return value;
}
export function defaultInstallationInformationTrait() {
    return defaultNodeFromScratchInstallationInformation();
}
export function compareInstallationInformationTrait(__a: InstallationInformation, __b: InstallationInformation) {
    return compareNodeFromScratchInstallationInformation(__a, __b);
}
export type ConfigurationInformation = Readonly<NodeFromScratchInstallationConfigurationInformation>;
export function isConfigurationInformationTrait(value: unknown): value is ConfigurationInformation {
    if(isNodeFromScratchInstallationConfigurationInformation(value)) return true;
    return false;
}
export function encodeConfigurationInformationTrait(__s: ISerializer,value: ConfigurationInformation) {
    switch(value._name) {
        case '001.main.NodeFromScratchInstallationConfigurationInformation':
            return encodeNodeFromScratchInstallationConfigurationInformation(__s,value);
    }
    throw new Error(`Failed to encode: Received invalid value on "_name" property. We got "${value['_name']}" value, but this function was expecting to receive one of the following:\n\t- 001.main.NodeFromScratchInstallationConfigurationInformation\n\n\nPossible cause is that maybe this type simply does not extend this trait, and somehow the type-checking prevented you from calling this function wrongly.`);
}
export function decodeConfigurationInformationTrait(__d: IDeserializer) {
    const __id = __d.readInt32();
    __d.rewind(4);
    let value: NodeFromScratchInstallationConfigurationInformation;
    switch(__id) {
        case -2100621895: {
            const tmp = decodeNodeFromScratchInstallationConfigurationInformation(__d);
            if(tmp === null) return null;
            value = tmp;
            break;
        }
        default: return null;
    }
    return value;
}
export function defaultConfigurationInformationTrait() {
    return defaultNodeFromScratchInstallationConfigurationInformation();
}
export function compareConfigurationInformationTrait(__a: ConfigurationInformation, __b: ConfigurationInformation) {
    return compareNodeFromScratchInstallationConfigurationInformation(__a, __b);
}
