import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { ExpressionSchema } from "@/entities/ExpressionSchema"
import { useEffect, useState } from "react"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import { InputOperationSchema } from "@/entities/InputOperationSchema"

interface InputActionConfigProps {
    operation?: BaseOperationSchema;
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function InputActionConfig(props: InputActionConfigProps) {
    const intl = useIntl();
    const {handler, currentModuleIndex, program} = useProgram();
    const [operation, setOperation] = useState<InputOperationSchema>({...props.operation} as InputOperationSchema);
    const [variables, setVariables] = useState<string[]>([]);

    const updateOperation = async (operation)=>{
        if(props.onChange){
            props.onChange(operation)
        }
    }

    useEffect(() => {
        if(props.operation){
            setOperation(props.operation as InputOperationSchema)
        }

        setVariables(program.modules[currentModuleIndex].operations.filter(o=>o.order < operation.order && o.type == OperationType.Declaration).map(o => (o as DeclarationOperationSchema).variable.name));
    }, [props.operation])

    return (
    <>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.message"})}</label>
            <input title={intl.formatMessage({id: "config.message"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.message} onChange={(ev)=>{updateOperation({...operation, message: ev.currentTarget.value})}} type="text" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.variableName"})}</label>
            <select title={intl.formatMessage({id: "config.variableName"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.variable} onChange={(ev)=>{updateOperation({...operation, variable: ev.currentTarget.value})}}>
                {variables.map((v, idx)=>(<option key={`invar-${idx}`} value={v}>{v}</option>))}
            </select>
        </div>
    </>)
}