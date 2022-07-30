import { RootState, useAppDispatch } from "store"
import { useSelector } from "react-redux"
import { Diagram } from "@/entities/Diagram"
import { NodeType } from "@/entities/Node"
import { NodeConnectionType } from "@/entities/NodeConnection"
import { setDiagram } from "store/slices/programSlice"
import { FormattedMessage, useIntl } from "react-intl"

export default function useProgram() {
    const intl = useIntl();
    const dispatch = useAppDispatch();
    const diagram = useSelector<RootState, Diagram>(state => state.program.diagram)

    const initDiagram = async () => {
        await dispatch(setDiagram({
            nodes: [{
                id: 0,
                name: "op0",
                text: intl.formatMessage({ id: "playground.start" }),
                type: NodeType.Start
            },{
                id: 1,
                name: "op1",
                text: intl.formatMessage({ id: "playground.end" }),
                type: NodeType.End
            }],
            connections: [{
                id: "0",
                from: 0,
                to: 1,
                type: NodeConnectionType.Default
            }]
        } as Diagram))
    }

    return {diagram, handler: {initDiagram}}
}