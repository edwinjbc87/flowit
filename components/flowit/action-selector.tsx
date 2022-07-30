import ActionsList from "./actions-list";

export default function ActionSelector({show, onDismiss}: {show: boolean, onDismiss: () => void}) {
    return (
        <div id="defaultModal" aria-hidden="true" className={`${!show?'hidden':''} flex items-center justify-content overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`}>
            <div className="p-4 w-full m-auto flex-1 max-w-2xl h-full md:h-auto">
                <div className="bg-white rounded-lg shadow">
                    <div className="flex justify-between items-start p-4 rounded-t border-b">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Seleccione una acción
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={()=>onDismiss()}>
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <ActionsList></ActionsList>
                    </div>
                </div>
            </div>
        </div>
    );
}