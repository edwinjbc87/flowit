import { NodeType } from "@/entities/Node";
import ActionIcon from "./action-icon";

export default function ActionNode({type, text, id, onClick}: {type: NodeType, text: string, id: string, onClick: () => void}) {
    return (
        <button onClick={onClick} key={id} className="flex items-center p-2 mb-1 w-full">
            <ActionIcon className={"mr-2"} type={type} /> {text}
        </button>
    );
}