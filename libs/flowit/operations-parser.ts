import { Diagram } from "@/entities/Diagram";
import { Node } from "@/entities/Node";
import { NodeConnection, NodeConnectionType } from "@/entities/NodeConnection";

export function parseDiagram(diagram:Diagram): string {
    return diagram.nodes.map((node, idx) => `op${idx}:${node.type}`).join('\n\r') + "\n\r\n\r" + diagram.connections.map((con, idx) => `${diagram.nodes.find(n=>con.from == n.id)?.name}${(con.type!=NodeConnectionType.Default?(`(${con.type})`):'')}->${diagram.nodes.find(n=>con.to == n.id)?.name}`).join('\n\r');
}