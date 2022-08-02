import { NodeType } from "@/entities/Node"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import ActionIcon from "./action-icon";

export default function ActionsList() {
    const intl = useIntl();

    const [actions, setActions] = useState(Object.values(NodeType).map(key => ({type: key, name: intl.formatMessage({id: `actions.${key}`})})));

    return (
        <div>
            {actions.filter(ac => ac.type != NodeType.Start && ac.type != NodeType.End && ac.type != NodeType.Yes && ac.type != NodeType.No).map(ac => (
                <button onClick={()=>alert(ac.name)} key={ac.name} className="flex items-center p-2 rounded-md border border-gray-300 mb-1 w-full hover:bg-gray-100">
                    <ActionIcon className={"mr-3"} type={ac.type} /> <span className="text-gray-500">{ac.name}</span>
                </button>
            ))}
        </div>
    );
}