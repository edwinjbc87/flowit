import useProgram from "@/hooks/useProgram";
import {MdOutlineClose} from "react-icons/md";
import { useIntl } from "react-intl";
import React, {useEffect, useState} from "react";
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema";
import { ExpressionSchema } from "@/entities/ExpressionSchema";
import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema";
import DeclarationActionConfig from "./declaration-action-config";
import InputActionConfig from "./input-action-config";
import OutputActionConfig from "./output-action-config";
import AssignmentActionConfig from "./asignment-action-config";
import ConditionActionConfig from "./condition-action-config";
import LoopActionConfig from "./loop-action-config";

interface BaseActionConfigProps {
    operation: BaseOperationSchema,
    onDismiss: () => void,
    onSave: (operation: BaseOperationSchema) => void,
    onRemove: (id: number) => void,
}

export default function BaseActionConfig(props: BaseActionConfigProps) {
    const intl = useIntl();
    const {onDismiss} = props;
    const {program, handler} = useProgram();
    const [operation, setOperation] = useState<BaseOperationSchema>({...props.operation});

    const updateOperation = (operation)=>{
        setOperation(operation);
    }

    const saveOperation = async ()=>{
        await props.onSave(operation);
    }

    const removeOperation = async ()=>{
        await props.onRemove(operation.id);
        onDismiss();
    }

    return (
        <section id="defaultConfigOperationModal" aria-hidden="true" className={`flex items-center justify-content overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`}>
            <div className="fixed w-full h-full bg-blue-100 opacity-80"></div>
            <div className="p-4 w-full m-auto flex-1 max-w-2xl h-full md:h-auto z-10">
                <div className="bg-white rounded-lg shadow">
                    <div className="flex justify-between items-start p-4 rounded-t border-b">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {intl.formatMessage({id: "config.operationConfiguration"})}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={()=>onDismiss()}>
                            <MdOutlineClose />
                            <span className="sr-only">{intl.formatMessage({id: "general.cancel"})}</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {intl.formatMessage({id: "config.operationName"})}
                            </label>
                            <input title={intl.formatMessage({id: "config.operationName"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.name} onChange={(ev)=>{updateOperation({...operation, name: ev.currentTarget.value})}} type="text" />
                        </div>
                        {operation.type == OperationType.Declaration && <DeclarationActionConfig {...{operation, onChange: updateOperation}}></DeclarationActionConfig>}
                        {operation.type == OperationType.Input && <InputActionConfig {...{operation, onChange: updateOperation}}></InputActionConfig>}
                        {operation.type == OperationType.Output && <OutputActionConfig {...{operation, onChange: updateOperation}}></OutputActionConfig>}
                        {operation.type == OperationType.Assignment && <AssignmentActionConfig {...{operation, onChange: updateOperation}}></AssignmentActionConfig>}
                        {operation.type == OperationType.Condition && <ConditionActionConfig {...{operation, onChange: updateOperation}}></ConditionActionConfig>}
                        {operation.type == OperationType.Loop && <LoopActionConfig {...{operation, onChange: updateOperation}}></LoopActionConfig>}
                    </div>
                    <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-between p-4 border-t border-gray-200 rounded-b-md">
                        {operation.id && ![OperationType.Start, OperationType.End].includes(operation.type) && <div>
                            <button type="button" onClick={()=>removeOperation()} className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-1">{intl.formatMessage({id: "general.delete"})}</button>
                        </div>}
                        <div className={`flex flex-shrink-0 flex-wrap items-center justify-end flex-1 ${!operation.id || [OperationType.Start, OperationType.End].includes(operation.type) ? 'w-full': ''}`}>
                            <button type="button" onClick={()=>saveOperation()} className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-1">{intl.formatMessage({id: "general.save"})}</button>
                            <button type="button" onClick={()=>onDismiss()} className="inline-block border px-6 py-2.5 border-blue-400 font-medium text-xs leading-tight uppercase rounded shadow-md hover:text-white hover:border-transparent hover:bg-blue-700 hover:shadow-lg focus:text-white focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:text-white active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">{intl.formatMessage({id: "general.cancel"})}</button>
                        </div>                        
                    </div>
                </div>
            </div>
        </section>
    );
}