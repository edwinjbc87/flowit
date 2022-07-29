import { Node } from "./Node";
import { NodeConnection } from "./NodeConnection";

export interface Diagram{
    nodes: Node[];
    connections: NodeConnection[];
}