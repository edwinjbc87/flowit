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
import PrimaryButton from "../general/primary-button";
import DefaultButton from "../general/default-button";
import TextField from "../general/textfield";

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
                            {intl.formatMessage({id: "config.operationConfiguration"})} - {intl.formatMessage({id: `actions.${operation.type}`})}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={()=>onDismiss()}>
                            <MdOutlineClose />
                            <span className="sr-only">{intl.formatMessage({id: "general.cancel"})}</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="mb-4">
                            <TextField title={intl.formatMessage({id: "config.operationName"})} label={intl.formatMessage({id: "config.operationName"})} value={operation.name} onChange={(ev, value)=>{updateOperation({...operation, name: value})}} />
                        </div>
                        {operation.type == OperationType.Declaration && <DeclarationActionConfig {...{operation, onChange: updateOperation}} />}
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
                            <PrimaryButton text={intl.formatMessage({id: "general.save"})} onClick={()=>saveOperation()}></PrimaryButton>
                            <DefaultButton text={intl.formatMessage({id: "general.cancel"})} onClick={()=>onDismiss()}></DefaultButton>
                        </div>                        
                    </div>
                </div>
            </div>
        </section>
    );
}