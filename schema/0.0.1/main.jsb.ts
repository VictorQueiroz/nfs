import { ISerializer } from "../__types__";
import { IDeserializer } from "../__types__";
export interface NodeVersionInstallationInformation  {
    _name: '001.main.NodeVersionInstallationInformation';
    id: Readonly<NodeVersionInstallationInformationReference>;
    location: string;
    buildInformation: Readonly<NodeVersionInstallationBuildInformation>;
}
export function isNodeVersionInstallationInformation(value: unknown): value is NodeVersionInstallationInformation {
    if(!(typeof value === 'object' && value !== null && '_name' in value && typeof value['_name'] === 'string' && value['_name'] === "001.main.NodeVersionInstallationInformation")) return false;
    if(!(
        "id" in value && ((__v0) => (isNodeVersionInstallationInformationReference(__v0)))(value['id'])
    )) return false;
    if(!(
        "location" in value && ((__v1) => (typeof __v1 === 'string'))(value['location'])
    )) return false;
    if(!(
        "buildInformation" in value && ((__v2) => (isNodeVersionInstallationBuildInformation(__v2)))(value['buildInformation'])
    )) return false;
    return true;
}
export interface NodeVersionInstallationInformationInputParams {
    id: Readonly<NodeVersionInstallationInformationReference>;
    location: string;
    buildInformation: Readonly<NodeVersionInstallationBuildInformation>;
}
export function NodeVersionInstallationInformation(params: NodeVersionInstallationInformationInputParams): NodeVersionInstallationInformation {
    return {
        _name: '001.main.NodeVersionInstallationInformation',
        id: params['id'],
        location: params['location'],
        buildInformation: params['buildInformation']
    };
}
export function encodeNodeVersionInstallationInformation(__s: ISerializer, value: NodeVersionInstallationInformation) {
    __s.writeInt32(1843473502);
    /**
     * encoding param: id
     */
    const __pv0 = value['id'];
    encodeNodeVersionInstallationInformationReference(__s,__pv0);
    /**
     * encoding param: location
     */
    const __pv1 = value['location'];
    __s.writeString(__pv1);
    /**
     * encoding param: buildInformation
     */
    const __pv2 = value['buildInformation'];
    encodeNodeVersionInstallationBuildInformation(__s,__pv2);
}
export function decodeNodeVersionInstallationInformation(__d: IDeserializer): NodeVersionInstallationInformation | null {
    const __id = __d.readInt32();
    /**
     * decode header
     */
    if(__id !== 1843473502) return null;
    let id: NodeVersionInstallationInformationReference;
    let location: string;
    let buildInformation: NodeVersionInstallationBuildInformation;
    /**
     * decoding param: id
     */
    const __tmp1 = decodeNodeVersionInstallationInformationReference(__d);
    if(__tmp1 === null) return null;
    id = __tmp1;
    /**
     * decoding param: location
     */
    location = __d.readString();
    /**
     * decoding param: buildInformation
     */
    const __tmp3 = decodeNodeVersionInstallationBuildInformation(__d);
    if(__tmp3 === null) return null;
    buildInformation = __tmp3;
    return {
        _name: '001.main.NodeVersionInstallationInformation',
        id,
        location,
        buildInformation
    };
}
export function defaultNodeVersionInstallationInformation(params: Partial<NodeVersionInstallationInformationInputParams> = {}): NodeVersionInstallationInformation {
    return NodeVersionInstallationInformation({
        id: defaultNodeVersionInstallationInformationReference(),
        location: "",
        buildInformation: defaultNodeVersionInstallationBuildInformation(),
        ...params
    });
}
export function compareNodeVersionInstallationInformation(__a: NodeVersionInstallationInformation, __b: NodeVersionInstallationInformation): boolean {
    return (
        /**
         * compare parameter id
         */
        compareNodeVersionInstallationInformationReference(__a['id'],__b['id']) &&
        /**
         * compare parameter location
         */
        __a['location'] === __b['location'] &&
        /**
         * compare parameter buildInformation
         */
        compareNodeVersionInstallationBuildInformation(__a['buildInformation'],__b['buildInformation'])
    );
}
export function updateNodeVersionInstallationInformation(value: NodeVersionInstallationInformation, changes: Partial<NodeVersionInstallationInformationInputParams>) {
    if(typeof changes['id'] !== 'undefined') {
        if(!(compareNodeVersionInstallationInformationReference(changes['id'],value['id']))) {
            value = NodeVersionInstallationInformation({
                ...value,
                id: changes['id'],
            });
        }
    }
    if(typeof changes['location'] !== 'undefined') {
        if(!(changes['location'] === value['location'])) {
            value = NodeVersionInstallationInformation({
                ...value,
                location: changes['location'],
            });
        }
    }
    if(typeof changes['buildInformation'] !== 'undefined') {
        if(!(compareNodeVersionInstallationBuildInformation(changes['buildInformation'],value['buildInformation']))) {
            value = NodeVersionInstallationInformation({
                ...value,
                buildInformation: changes['buildInformation'],
            });
        }
    }
    return value;
}
export interface NodeVersionInstallationBuildInformation  {
    _name: '001.main.NodeVersionInstallationBuildInformation';
    location: string;
    configureArguments: ReadonlyArray<string>;
}
export function isNodeVersionInstallationBuildInformation(value: unknown): value is NodeVersionInstallationBuildInformation {
    if(!(typeof value === 'object' && value !== null && '_name' in value && typeof value['_name'] === 'string' && value['_name'] === "001.main.NodeVersionInstallationBuildInformation")) return false;
    if(!(
        "location" in value && ((__v0) => (typeof __v0 === 'string'))(value['location'])
    )) return false;
    if(!(
        "configureArguments" in value && ((__v1) => ((Array.isArray(__v1) || __v1 instanceof Set) && Array.from(__v1).every(p => (typeof p === 'string'))))(value['configureArguments'])
    )) return false;
    return true;
}
export interface NodeVersionInstallationBuildInformationInputParams {
    location: string;
    configureArguments: ReadonlyArray<string>;
}
export function NodeVersionInstallationBuildInformation(params: NodeVersionInstallationBuildInformationInputParams): NodeVersionInstallationBuildInformation {
    return {
        _name: '001.main.NodeVersionInstallationBuildInformation',
        location: params['location'],
        configureArguments: params['configureArguments']
    };
}
export function encodeNodeVersionInstallationBuildInformation(__s: ISerializer, value: NodeVersionInstallationBuildInformation) {
    __s.writeInt32(2144988977);
    /**
     * encoding param: location
     */
    const __pv0 = value['location'];
    __s.writeString(__pv0);
    /**
     * encoding param: configureArguments
     */
    const __pv1 = value['configureArguments'];
    const __l2 = __pv1.length;
    __s.writeUint32(__l2);
    for(const __item2 of __pv1) {
        __s.writeString(__item2);
    }
}
export function decodeNodeVersionInstallationBuildInformation(__d: IDeserializer): NodeVersionInstallationBuildInformation | null {
    const __id = __d.readInt32();
    /**
     * decode header
     */
    if(__id !== 2144988977) return null;
    let location: string;
    let configureArguments: Array<string>;
    /**
     * decoding param: location
     */
    location = __d.readString();
    /**
     * decoding param: configureArguments
     */
    const __l2 = __d.readUint32();
    const __o2 = new Array<string>(__l2);
    configureArguments = __o2;
    for(let __i2 = 0; __i2 < __l2; __i2++) {
        __o2[__i2] = __d.readString();
    }
    return {
        _name: '001.main.NodeVersionInstallationBuildInformation',
        location,
        configureArguments
    };
}
export function defaultNodeVersionInstallationBuildInformation(params: Partial<NodeVersionInstallationBuildInformationInputParams> = {}): NodeVersionInstallationBuildInformation {
    return NodeVersionInstallationBuildInformation({
        location: "",
        configureArguments: [],
        ...params
    });
}
export function compareNodeVersionInstallationBuildInformation(__a: NodeVersionInstallationBuildInformation, __b: NodeVersionInstallationBuildInformation): boolean {
    return (
        /**
         * compare parameter location
         */
        __a['location'] === __b['location'] &&
        /**
         * compare parameter configureArguments
         */
        __a['configureArguments'].length === __b['configureArguments'].length && Array.from(__a['configureArguments']).every((__originalItem1,__index1) => (typeof __originalItem1 === 'undefined' ? false : (__item1 => typeof __item1 === 'undefined' ? false : (__originalItem1 === __item1))(Array.from(__b['configureArguments'])[__index1])))
    );
}
export function updateNodeVersionInstallationBuildInformation(value: NodeVersionInstallationBuildInformation, changes: Partial<NodeVersionInstallationBuildInformationInputParams>) {
    if(typeof changes['location'] !== 'undefined') {
        if(!(changes['location'] === value['location'])) {
            value = NodeVersionInstallationBuildInformation({
                ...value,
                location: changes['location'],
            });
        }
    }
    if(typeof changes['configureArguments'] !== 'undefined') {
        if(!(changes['configureArguments'].length === value['configureArguments'].length && Array.from(changes['configureArguments']).every((__originalItem2,__index2) => (typeof __originalItem2 === 'undefined' ? false : (__item2 => typeof __item2 === 'undefined' ? false : (__originalItem2 === __item2))(Array.from(value['configureArguments'])[__index2]))))) {
            value = NodeVersionInstallationBuildInformation({
                ...value,
                configureArguments: changes['configureArguments'],
            });
        }
    }
    return value;
}
export interface NodeFromScratchInstallationConfigurationInformation  {
    _name: '001.main.NodeFromScratchInstallationConfigurationInformation';
    defaultInstallation: Readonly<NodeVersionInstallationInformationReference> | null;
}
export function isNodeFromScratchInstallationConfigurationInformation(value: unknown): value is NodeFromScratchInstallationConfigurationInformation {
    if(!(typeof value === 'object' && value !== null && '_name' in value && typeof value['_name'] === 'string' && value['_name'] === "001.main.NodeFromScratchInstallationConfigurationInformation")) return false;
    if(!(
        "defaultInstallation" in value && ((__v0) => (__v0 === null ? true : ((x) => (isNodeVersionInstallationInformationReference(x)))(__v0)))(value['defaultInstallation'])
    )) return false;
    return true;
}
export interface NodeFromScratchInstallationConfigurationInformationInputParams {
    defaultInstallation: Readonly<NodeVersionInstallationInformationReference> | null;
}
export function NodeFromScratchInstallationConfigurationInformation(params: NodeFromScratchInstallationConfigurationInformationInputParams): NodeFromScratchInstallationConfigurationInformation {
    return {
        _name: '001.main.NodeFromScratchInstallationConfigurationInformation',
        defaultInstallation: params['defaultInstallation']
    };
}
export function encodeNodeFromScratchInstallationConfigurationInformation(__s: ISerializer, value: NodeFromScratchInstallationConfigurationInformation) {
    __s.writeInt32(-2100621895);
    /**
     * encoding param: defaultInstallation
     */
    const __pv0 = value['defaultInstallation'];
    if(__pv0 === null) {
        __s.writeUint8(0);
    } else {
        __s.writeUint8(1);
        encodeNodeVersionInstallationInformationReference(__s,__pv0);
    }
}
export function decodeNodeFromScratchInstallationConfigurationInformation(__d: IDeserializer): NodeFromScratchInstallationConfigurationInformation | null {
    const __id = __d.readInt32();
    /**
     * decode header
     */
    if(__id !== -2100621895) return null;
    let defaultInstallation: NodeVersionInstallationInformationReference | null;
    /**
     * decoding param: defaultInstallation
     */
    if(__d.readUint8() === 1) {
        const __tmp2 = decodeNodeVersionInstallationInformationReference(__d);
        if(__tmp2 === null) return null;
        defaultInstallation = __tmp2;
    } else {
        defaultInstallation = null;
    }
    return {
        _name: '001.main.NodeFromScratchInstallationConfigurationInformation',
        defaultInstallation
    };
}
export function defaultNodeFromScratchInstallationConfigurationInformation(params: Partial<NodeFromScratchInstallationConfigurationInformationInputParams> = {}): NodeFromScratchInstallationConfigurationInformation {
    return NodeFromScratchInstallationConfigurationInformation({
        defaultInstallation: null,
        ...params
    });
}
export function compareNodeFromScratchInstallationConfigurationInformation(__a: NodeFromScratchInstallationConfigurationInformation, __b: NodeFromScratchInstallationConfigurationInformation): boolean {
    return (
        /**
         * compare parameter defaultInstallation
         */
        ((__dp01, __dp02) => __dp01 !== null && __dp02 !== null ? compareNodeVersionInstallationInformationReference(__dp01,__dp02) : __dp01 === __dp02)(__a['defaultInstallation'],__b['defaultInstallation'])
    );
}
export function updateNodeFromScratchInstallationConfigurationInformation(value: NodeFromScratchInstallationConfigurationInformation, changes: Partial<NodeFromScratchInstallationConfigurationInformationInputParams>) {
    if(typeof changes['defaultInstallation'] !== 'undefined') {
        if(!(((__dp11, __dp12) => __dp11 !== null && __dp12 !== null ? compareNodeVersionInstallationInformationReference(__dp11,__dp12) : __dp11 === __dp12)(changes['defaultInstallation'],value['defaultInstallation']))) {
            value = NodeFromScratchInstallationConfigurationInformation({
                ...value,
                defaultInstallation: changes['defaultInstallation'],
            });
        }
    }
    return value;
}
export interface NodeFromScratchInstallationInformation  {
    _name: '001.main.NodeFromScratchInstallationInformation';
    location: string;
    installRootDirectories: ReadonlySet<string>;
}
export function isNodeFromScratchInstallationInformation(value: unknown): value is NodeFromScratchInstallationInformation {
    if(!(typeof value === 'object' && value !== null && '_name' in value && typeof value['_name'] === 'string' && value['_name'] === "001.main.NodeFromScratchInstallationInformation")) return false;
    if(!(
        "location" in value && ((__v0) => (typeof __v0 === 'string'))(value['location'])
    )) return false;
    if(!(
        "installRootDirectories" in value && ((__v1) => ((Array.isArray(__v1) || __v1 instanceof Set) && Array.from(__v1).every(p => (typeof p === 'string'))))(value['installRootDirectories'])
    )) return false;
    return true;
}
export interface NodeFromScratchInstallationInformationInputParams {
    location: string;
    installRootDirectories: ReadonlySet<string>;
}
export function NodeFromScratchInstallationInformation(params: NodeFromScratchInstallationInformationInputParams): NodeFromScratchInstallationInformation {
    return {
        _name: '001.main.NodeFromScratchInstallationInformation',
        location: params['location'],
        installRootDirectories: params['installRootDirectories']
    };
}
export function encodeNodeFromScratchInstallationInformation(__s: ISerializer, value: NodeFromScratchInstallationInformation) {
    __s.writeInt32(559808368);
    /**
     * encoding param: location
     */
    const __pv0 = value['location'];
    __s.writeString(__pv0);
    /**
     * encoding param: installRootDirectories
     */
    const __pv1 = value['installRootDirectories'];
    const __l2 = __pv1.size;
    __s.writeUint32(__l2);
    for(const __v2 of __pv1) {
        __s.writeString(__v2);
    }
}
export function decodeNodeFromScratchInstallationInformation(__d: IDeserializer): NodeFromScratchInstallationInformation | null {
    const __id = __d.readInt32();
    /**
     * decode header
     */
    if(__id !== 559808368) return null;
    let location: string;
    let installRootDirectories: Set<string>;
    /**
     * decoding param: location
     */
    location = __d.readString();
    /**
     * decoding param: installRootDirectories
     */
    let __tmp2: string;
    const __l2 = __d.readUint32();
    const __o2 = new Set<string>();
    installRootDirectories = __o2;
    for(let __i2 = 0; __i2 < __l2; __i2++) {
        __tmp2 = __d.readString();
        __o2.add(__tmp2);
    }
    return {
        _name: '001.main.NodeFromScratchInstallationInformation',
        location,
        installRootDirectories
    };
}
export function defaultNodeFromScratchInstallationInformation(params: Partial<NodeFromScratchInstallationInformationInputParams> = {}): NodeFromScratchInstallationInformation {
    return NodeFromScratchInstallationInformation({
        location: "",
        installRootDirectories: new Set<string>(),
        ...params
    });
}
export function compareNodeFromScratchInstallationInformation(__a: NodeFromScratchInstallationInformation, __b: NodeFromScratchInstallationInformation): boolean {
    return (
        /**
         * compare parameter location
         */
        __a['location'] === __b['location'] &&
        /**
         * compare parameter installRootDirectories
         */
        __a['installRootDirectories'].size === __b['installRootDirectories'].size && Array.from(__a['installRootDirectories']).every((__originalItem1,__index1) => (typeof __originalItem1 === 'undefined' ? false : (__item1 => typeof __item1 === 'undefined' ? false : (__originalItem1 === __item1))(Array.from(__b['installRootDirectories'])[__index1])))
    );
}
export function updateNodeFromScratchInstallationInformation(value: NodeFromScratchInstallationInformation, changes: Partial<NodeFromScratchInstallationInformationInputParams>) {
    if(typeof changes['location'] !== 'undefined') {
        if(!(changes['location'] === value['location'])) {
            value = NodeFromScratchInstallationInformation({
                ...value,
                location: changes['location'],
            });
        }
    }
    if(typeof changes['installRootDirectories'] !== 'undefined') {
        if(!(changes['installRootDirectories'].size === value['installRootDirectories'].size && Array.from(changes['installRootDirectories']).every((__originalItem2,__index2) => (typeof __originalItem2 === 'undefined' ? false : (__item2 => typeof __item2 === 'undefined' ? false : (__originalItem2 === __item2))(Array.from(value['installRootDirectories'])[__index2]))))) {
            value = NodeFromScratchInstallationInformation({
                ...value,
                installRootDirectories: changes['installRootDirectories'],
            });
        }
    }
    return value;
}
export interface NodeVersionInstallationInformationReference  {
    _name: '001.main.NodeVersionInstallationInformationReference';
    name: string;
    version: string;
}
export function isNodeVersionInstallationInformationReference(value: unknown): value is NodeVersionInstallationInformationReference {
    if(!(typeof value === 'object' && value !== null && '_name' in value && typeof value['_name'] === 'string' && value['_name'] === "001.main.NodeVersionInstallationInformationReference")) return false;
    if(!(
        "name" in value && ((__v0) => (typeof __v0 === 'string'))(value['name'])
    )) return false;
    if(!(
        "version" in value && ((__v1) => (typeof __v1 === 'string'))(value['version'])
    )) return false;
    return true;
}
export interface NodeVersionInstallationInformationReferenceInputParams {
    name: string;
    version: string;
}
export function NodeVersionInstallationInformationReference(params: NodeVersionInstallationInformationReferenceInputParams): NodeVersionInstallationInformationReference {
    return {
        _name: '001.main.NodeVersionInstallationInformationReference',
        name: params['name'],
        version: params['version']
    };
}
export function encodeNodeVersionInstallationInformationReference(__s: ISerializer, value: NodeVersionInstallationInformationReference) {
    __s.writeInt32(655918101);
    /**
     * encoding param: name
     */
    const __pv0 = value['name'];
    __s.writeString(__pv0);
    /**
     * encoding param: version
     */
    const __pv1 = value['version'];
    __s.writeString(__pv1);
}
export function decodeNodeVersionInstallationInformationReference(__d: IDeserializer): NodeVersionInstallationInformationReference | null {
    const __id = __d.readInt32();
    /**
     * decode header
     */
    if(__id !== 655918101) return null;
    let name: string;
    let version: string;
    /**
     * decoding param: name
     */
    name = __d.readString();
    /**
     * decoding param: version
     */
    version = __d.readString();
    return {
        _name: '001.main.NodeVersionInstallationInformationReference',
        name,
        version
    };
}
export function defaultNodeVersionInstallationInformationReference(params: Partial<NodeVersionInstallationInformationReferenceInputParams> = {}): NodeVersionInstallationInformationReference {
    return NodeVersionInstallationInformationReference({
        name: "",
        version: "",
        ...params
    });
}
export function compareNodeVersionInstallationInformationReference(__a: NodeVersionInstallationInformationReference, __b: NodeVersionInstallationInformationReference): boolean {
    return (
        /**
         * compare parameter name
         */
        __a['name'] === __b['name'] &&
        /**
         * compare parameter version
         */
        __a['version'] === __b['version']
    );
}
export function updateNodeVersionInstallationInformationReference(value: NodeVersionInstallationInformationReference, changes: Partial<NodeVersionInstallationInformationReferenceInputParams>) {
    if(typeof changes['name'] !== 'undefined') {
        if(!(changes['name'] === value['name'])) {
            value = NodeVersionInstallationInformationReference({
                ...value,
                name: changes['name'],
            });
        }
    }
    if(typeof changes['version'] !== 'undefined') {
        if(!(changes['version'] === value['version'])) {
            value = NodeVersionInstallationInformationReference({
                ...value,
                version: changes['version'],
            });
        }
    }
    return value;
}
