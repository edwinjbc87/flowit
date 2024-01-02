import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { ExpressionSchema } from "@/entities/ExpressionSchema"
import { useEffect, useRef, useState } from "react"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import { AssignmentOperationSchema } from "@/entities/AssignmentOperationSchema"
import ExpressionInput from "./expression-input"
import Dropdown from "../general/dropdown"
import ExpressionBuilder from "./expression-builder"

interface AssignmentActionConfigProps {
    operation?: BaseOperationSchema;
    variables?: string[];
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function AssignmentActionConfig(props: AssignmentActionConfigProps) {
    const intl = useIntl();
    const {handler, currentModuleIndex, program} = useProgram();
    const [operation, setOperation] = useState<AssignmentOperationSchema>({...props.operation} as AssignmentOperationSchema);
    const [variables, setVariables] = useState<string[]>([]);

    const updateOperation = async (_operation)=>{
        if(props.onChange){
            props.onChange(_operation)
        }
    }

    useEffect(() => {
        const _vars = program.modules[currentModuleIndex].operations.filter(o=>o.type == OperationType.Declaration).map(o => (o as DeclarationOperationSchema).variable.name)
        
        setVariables(_vars);
        const oper = props.operation as AssignmentOperationSchema;
        setOperation({...props.operation, variable: _vars.length > 0 ? (oper.variable ? oper.variable : _vars[0]) : ""} as AssignmentOperationSchema)
    }, [props.operation])


    return (
    <>
        <div className="mb-4">
            <Dropdown title={intl.formatMessage({id: "config.variableName"})} label={intl.formatMessage({id: "config.variableName"})} selectedKey={operation.variable ?? variables[0]} options={variables.map(v => ({key: v, text: v}))} onChange={(ev, value)=>{updateOperation({...operation, variable: value.key})}} />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.expression"})}</label>
            <ExpressionBuilder variables={variables} value={operation.expression} onChange={(_exp)=>updateOperation({...operation, expression: _exp})} />
        </div>
    </>)
}