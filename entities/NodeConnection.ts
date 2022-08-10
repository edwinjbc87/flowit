import { Node } from "./Node";

export enum NodeConnectionType {
    Default = 'default',
    Yes = 'yes',
    No = 'no',
}

export interface NodeConnection {
    id: String;
    from: number;
    to: number;
    type: NodeConnectionType;
    zIndex: number;
}