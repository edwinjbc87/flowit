import { Dimension } from "./Dimension";
import { Node } from "./Node";
import { NodeConnection } from "./NodeConnection";

export interface Diagram{
    nodes: Node[];
    connections: NodeConnection[];
    dimension: Dimension;
}