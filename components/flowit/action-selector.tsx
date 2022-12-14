import ActionsList from "./actions-list";
import {MdOutlineClose} from "react-icons/md";
import { useIntl } from "react-intl";
import { NodeType } from "@/entities/Node";

export default function ActionSelector({onDismiss, onSelectedOperation}: {onDismiss: () => void, onSelectedOperation: (operation: NodeType) => void}) {
    const intl = useIntl();

    return (
        <div id="defaultModal" aria-hidden="true" className={`flex items-center justify-content overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`}>
            <div className="p-4 w-full m-auto flex-1 max-w-2xl h-full md:h-auto">
                <div className="bg-white rounded-lg shadow">
                    <div className="flex justify-between items-start p-4 rounded-t border-b">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {intl.formatMessage({id: "playground.pickanaction"})}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={()=>onDismiss()}>
                            <MdOutlineClose />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <ActionsList onSelected={(sel)=>onSelectedOperation(sel)}></ActionsList>
                    </div>
                </div>
            </div>
        </div>
    );
}