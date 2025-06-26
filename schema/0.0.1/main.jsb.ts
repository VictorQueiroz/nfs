import { ISerializer } from "../__types__";
import { IDeserializer } from "../__types__";
import JSBI from "jsbi";
export interface NodeVersionInstallationInformation  {
    _name: '001.main.NodeVersionInstallationInformation';
    name: string | null;
    version: string;
    location: string;
    buildInformation: Readonly<NodeVersionInstallationBuildInformation>;
}
export function isNodeVersionInstallationInformation(value: unknown): value is NodeVersionInstallationInformation {
    if(!(typeof value === 'object' && value !== null && '_name' in value && typeof value['_name'] === 'string' && value['_name'] === "001.main.NodeVersionInstallationInformation")) return false;
    if(!(
        "name" in value && ((__v0) => (__v0 === null ? true : ((x) => (typeof x === 'string'))(__v0)))(value['name'])
    )) return false;
    if(!(
        "version" in value && ((__v2) => (typeof __v2 === 'string'))(value['version'])
    )) return false;
    if(!(
        "location" in value && ((__v3) => (typeof __v3 === 'string'))(value['location'])
    )) return false;
    if(!(
        "buildInformation" in value && ((__v4) => (isNodeVersionInstallationBuildInformation(__v4)))(value['buildInformation'])
    )) return false;
    return true;
}
export interface NodeVersionInstallationInformationInputParams {
    name: string | null;
    version: string;
    location: string;
    buildInformation: Readonly<NodeVersionInstallationBuildInformation>;
}
export function NodeVersionInstallationInformation(params: NodeVersionInstallationInformationInputParams): NodeVersionInstallationInformation {
    return {
        _name: '001.main.NodeVersionInstallationInformation',
        name: params['name'],
        version: params['version'],
        location: params['location'],
        buildInformation: params['buildInformation']
    };
}
export function encodeNodeVersionInstallationInformation(__s: ISerializer, value: NodeVersionInstallationInformation) {
    __s.writeInt32(-1603961224);
    /**
     * encoding param: name
     */
    const __pv0 = value['name'];
    if(__pv0 === null) {
        __s.writeUint8(0);
    } else {
        __s.writeUint8(1);
        __s.writeString(__pv0);
    }
    /**
     * encoding param: version
     */
    const __pv2 = value['version'];
    __s.writeString(__pv2);
    /**
     * encoding param: location
     */
    const __pv3 = value['location'];
    __s.writeString(__pv3);
    /**
     * encoding param: buildInformation
     */
    const __pv4 = value['buildInformation'];
    encodeNodeVersionInstallationBuildInformation(__s,__pv4);
}
export function decodeNodeVersionInstallationInformation(__d: IDeserializer): NodeVersionInstallationInformation | null {
    const __id = __d.readInt32();
    /**
     * decode header
     */
    if(__id !== -1603961224) return null;
    let name: string | null;
    let version: string;
    let location: string;
    let buildInformation: NodeVersionInstallationBuildInformation;
    /**
     * decoding param: name
     */
    if(__d.readUint8() === 1) {
        name = __d.readString();
    } else {
        name = null;
    }
    /**
     * decoding param: version
     */
    version = __d.readString();
    /**
     * decoding param: location
     */
    location = __d.readString();
    /**
     * decoding param: buildInformation
     */
    const __tmp5 = decodeNodeVersionInstallationBuildInformation(__d);
    if(__tmp5 === null) return null;
    buildInformation = __tmp5;
    return {
        _name: '001.main.NodeVersionInstallationInformation',
        name,
        version,
        location,
        buildInformation
    };
}
export function defaultNodeVersionInstallationInformation(params: Partial<NodeVersionInstallationInformationInputParams> = {}): NodeVersionInstallationInformation {
    return NodeVersionInstallationInformation({
        name: null,
        version: "",
        location: "",
        buildInformation: defaultNodeVersionInstallationBuildInformation(),
        ...params
    });
}
export function compareNodeVersionInstallationInformation(__a: NodeVersionInstallationInformation, __b: NodeVersionInstallationInformation): boolean {
    return (
        /**
         * compare parameter name
         */
        ((__dp01, __dp02) => __dp01 !== null && __dp02 !== null ? __dp01 === __dp02 : __dp01 === __dp02)(__a['name'],__b['name']) &&
        /**
         * compare parameter version
         */
        __a['version'] === __b['version'] &&
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
    if(typeof changes['name'] !== 'undefined') {
        if(!(((__dp11, __dp12) => __dp11 !== null && __dp12 !== null ? __dp11 === __dp12 : __dp11 === __dp12)(changes['name'],value['name']))) {
            value = NodeVersionInstallationInformation({
                ...value,
                name: changes['name'],
            });
        }
    }
    if(typeof changes['version'] !== 'undefined') {
        if(!(changes['version'] === value['version'])) {
            value = NodeVersionInstallationInformation({
                ...value,
                version: changes['version'],
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
export interface NodeFromScratchInstallationInformation  {
    _name: '001.main.NodeFromScratchInstallationInformation';
    date: number;
    rootDirectories: ReadonlySet<string>;
}
export function isNodeFromScratchInstallationInformation(value: unknown): value is NodeFromScratchInstallationInformation {
    if(!(typeof value === 'object' && value !== null && '_name' in value && typeof value['_name'] === 'string' && value['_name'] === "001.main.NodeFromScratchInstallationInformation")) return false;
    if(!(
        "date" in value && ((__v0) => (typeof __v0 === 'number' && JSBI.equal(JSBI.BigInt(__v0),JSBI.BigInt(__v0)) && JSBI.greaterThanOrEqual(JSBI.BigInt(__v0),JSBI.BigInt("-2147483648")) && JSBI.lessThanOrEqual(JSBI.BigInt(__v0),JSBI.BigInt("2147483647"))))(value['date'])
    )) return false;
    if(!(
        "rootDirectories" in value && ((__v1) => ((Array.isArray(__v1) || __v1 instanceof Set) && Array.from(__v1).every(p => (typeof p === 'string'))))(value['rootDirectories'])
    )) return false;
    return true;
}
export interface NodeFromScratchInstallationInformationInputParams {
    date: number;
    rootDirectories: ReadonlySet<string>;
}
export function NodeFromScratchInstallationInformation(params: NodeFromScratchInstallationInformationInputParams): NodeFromScratchInstallationInformation {
    return {
        _name: '001.main.NodeFromScratchInstallationInformation',
        date: params['date'],
        rootDirectories: params['rootDirectories']
    };
}
export function encodeNodeFromScratchInstallationInformation(__s: ISerializer, value: NodeFromScratchInstallationInformation) {
    __s.writeInt32(1569429326);
    /**
     * encoding param: date
     */
    const __pv0 = value['date'];
    __s.writeInt32(__pv0);
    /**
     * encoding param: rootDirectories
     */
    const __pv1 = value['rootDirectories'];
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
    if(__id !== 1569429326) return null;
    let date: number;
    let rootDirectories: Set<string>;
    /**
     * decoding param: date
     */
    date = __d.readInt32();
    /**
     * decoding param: rootDirectories
     */
    let __tmp2: string;
    const __l2 = __d.readUint32();
    const __o2 = new Set<string>();
    rootDirectories = __o2;
    for(let __i2 = 0; __i2 < __l2; __i2++) {
        __tmp2 = __d.readString();
        __o2.add(__tmp2);
    }
    return {
        _name: '001.main.NodeFromScratchInstallationInformation',
        date,
        rootDirectories
    };
}
export function defaultNodeFromScratchInstallationInformation(params: Partial<NodeFromScratchInstallationInformationInputParams> = {}): NodeFromScratchInstallationInformation {
    return NodeFromScratchInstallationInformation({
        date: 0,
        rootDirectories: new Set<string>(),
        ...params
    });
}
export function compareNodeFromScratchInstallationInformation(__a: NodeFromScratchInstallationInformation, __b: NodeFromScratchInstallationInformation): boolean {
    return (
        /**
         * compare parameter date
         */
        __a['date'] === __b['date'] &&
        /**
         * compare parameter rootDirectories
         */
        __a['rootDirectories'].size === __b['rootDirectories'].size && Array.from(__a['rootDirectories']).every((__originalItem1,__index1) => (typeof __originalItem1 === 'undefined' ? false : (__item1 => typeof __item1 === 'undefined' ? false : (__originalItem1 === __item1))(Array.from(__b['rootDirectories'])[__index1])))
    );
}
export function updateNodeFromScratchInstallationInformation(value: NodeFromScratchInstallationInformation, changes: Partial<NodeFromScratchInstallationInformationInputParams>) {
    if(typeof changes['date'] !== 'undefined') {
        if(!(changes['date'] === value['date'])) {
            value = NodeFromScratchInstallationInformation({
                ...value,
                date: changes['date'],
            });
        }
    }
    if(typeof changes['rootDirectories'] !== 'undefined') {
        if(!(changes['rootDirectories'].size === value['rootDirectories'].size && Array.from(changes['rootDirectories']).every((__originalItem2,__index2) => (typeof __originalItem2 === 'undefined' ? false : (__item2 => typeof __item2 === 'undefined' ? false : (__originalItem2 === __item2))(Array.from(value['rootDirectories'])[__index2]))))) {
            value = NodeFromScratchInstallationInformation({
                ...value,
                rootDirectories: changes['rootDirectories'],
            });
        }
    }
    return value;
}
