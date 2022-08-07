import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { ExpressionSchema } from "@/entities/ExpressionSchema"
import { useEffect, useRef, useState } from "react"
import { BaseOperationSchema } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import ExpressionInput from "./expression-input"

interface DeclarationActionConfigProps {
    operation?: BaseOperationSchema;
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function DeclarationActionConfig(props: DeclarationActionConfigProps) {
    const intl = useIntl();
    const {handler} = useProgram();
    const [operation, setOperation] = useState<DeclarationOperationSchema>({...props.operation} as DeclarationOperationSchema);
    const [expression, setExpression] = useState<ExpressionSchema|any>();
    const expBuilder = useRef<any>();
    
    const updateOperation = async (operation)=>{
        if(props.onChange){
            props.onChange(operation)
        }
    }

    const loadOperation = async (_operation: BaseOperationSchema)=>{
        if(_operation){
            setOperation(props.operation as DeclarationOperationSchema)
        }
    } 

    const updateExpression = async (_expression:ExpressionSchema|any)=>{
        const _var =(props.operation as DeclarationOperationSchema).variable;
        const _exp = expBuilder.current?.getExpression();
        console.log("Declaration:", _exp)

        if(handler.isExpression(_expression)){
            setExpression({..._expression} as ExpressionSchema)
        } else {
            setExpression(_expression)
        }
        updateOperation({...operation, variable: {...operation.variable, value: _expression}})
    }

    useEffect(() => {
        if(props.operation) loadOperation(props.operation).catch(err=>console.error(err))
    }, [props.operation])

    return (
    <>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.variableName"})}</label>
            <input title={intl.formatMessage({id: "config.variableName"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.variable.name} onChange={(ev)=>{updateOperation({...operation, variable: {...operation.variable, name: ev.currentTarget.value}})}} type="text" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.variableType"})}</label>
            <select title={intl.formatMessage({id: "config.variableName"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.variable.type} onChange={(ev)=>{updateOperation({...operation, variable: {...operation.variable, type: ev.currentTarget.value}})}}>
                {Object.values(ValueType).map((v, idx)=>(<option key={`vartype-${v}`} value={v}>{intl.formatMessage({id: "types."+v})}</option>))}
            </select>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.expression"})}</label>
            <ExpressionInput ref={expBuilder} expression={operation.variable.value} valueType={operation.variable.type} title={intl.formatMessage({id: "config.expression"})} onChange={updateExpression} />
        </div>
    </>)
}