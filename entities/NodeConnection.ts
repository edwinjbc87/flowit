import { Node } from "./Node";

export enum NodeConnectionType {
    Default = 'default',
    Yes = 'yes',
    No = 'no',
}

export interface NodeConnection {
    id: string;
    from: number;
    to: number;
    type: NodeConnectionType;
}