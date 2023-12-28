import { Node } from "./Node";

export enum NodeConnectionType {
    Default = 'default',
    Yes = 'yes',
    No = 'no',
}

export interface NodeConnection {
    id: String;
    from: String;
    to: String;
    type: NodeConnectionType;
    zIndex: number;
}