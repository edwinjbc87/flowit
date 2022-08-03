import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { ExpressionSchema } from "@/entities/ExpressionSchema"
import { useEffect, useState } from "react"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import { AssignmentOperationSchema } from "@/entities/AssignmentOperationSchema"
import ExpressionInput from "./expression-input"

interface AssignmentActionConfigProps {
    operation?: BaseOperationSchema;
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function AssignmentActionConfig(props: AssignmentActionConfigProps) {
    const intl = useIntl();
    const {handler, currentModuleIndex, program} = useProgram();
    const [operation, setOperation] = useState<AssignmentOperationSchema>({...props.operation} as AssignmentOperationSchema);
    const [variables, setVariables] = useState<string[]>([]);

    const updateOperation = async (operation)=>{
        if(props.onChange){
            props.onChange(operation)
        }
    }

    useEffect(() => {
        if(props.operation){
            setOperation(props.operation as AssignmentOperationSchema)
        }

        setVariables(program.modules[currentModuleIndex].operations.filter(o=>o.order < operation.order && o.type == OperationType.Declaration).map(o => (o as DeclarationOperationSchema).variable.name));
    }, [props.operation])

    return (
    <>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.variableName"})}</label>
            <select title={intl.formatMessage({id: "config.variableName"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.variable} onChange={(ev)=>{updateOperation({...operation, variable: ev.currentTarget.value})}}>
                {variables.map((v, idx)=>(<option key={`asvar-${idx}`} value={v}>{v}</option>))}
            </select>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.expression"})}</label>
            <ExpressionInput title={intl.formatMessage({id: "config.expression"})} expression={operation.expression} onChange={(exp)=>{setOperation({...operation, expression: exp})}}></ExpressionInput>
        </div>
    </>)
}