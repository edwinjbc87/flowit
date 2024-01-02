import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import {  VariableSchema } from "@/entities/ExpressionSchema"
import { useCallback, useEffect, useRef, useState } from "react"
import { BaseOperationSchema } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import ExpressionInput from "./expression-input"
import TextField from "../general/textfield"
import Dropdown from "../general/dropdown"
import ExpressionBuilder from "./expression-builder"

interface DeclarationActionConfigProps {
    operation?: BaseOperationSchema;
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function DeclarationActionConfig(props: DeclarationActionConfigProps) {
    const intl = useIntl();
    const [operation, setOperation] = useState<DeclarationOperationSchema>();
    
    const updateOperation = async (_operation)=>{
        if(props.onChange){
            props.onChange({..._operation})
        }
    }


    const patchVariable = useCallback((_variable:VariableSchema) => {
        setOperation({...operation, variable: {...operation?.variable, ..._variable}} as DeclarationOperationSchema);    
    }, [operation])

    const loadOperation = async (_operation: BaseOperationSchema)=>{
        if(_operation){
            setOperation(_operation as DeclarationOperationSchema)
        }
    }

    useEffect(() => {
        if(props.operation) loadOperation(props.operation).catch(err=>console.error(err))
    }, [props.operation])

    return operation ? <>
        <div className="mb-4">
            <TextField title={intl.formatMessage({id: "config.variableName"})} label={intl.formatMessage({id: "config.variableName"})} value={operation.variable.name} onChange={(ev, value)=>{updateOperation({...operation, variable: {...operation.variable, name: value}})}} />
        </div>
        <div className="mb-4">
            <Dropdown title={intl.formatMessage({id: "config.variableType"})} label={intl.formatMessage({id: "config.variableType"})} selectedKey={operation.variable.type} options={Object.values(ValueType).map(v => ({key: v, text: intl.formatMessage({id: `types.${v}`})}))} onChange={(ev, value)=>{updateOperation({...operation, variable: {...operation.variable, type: value.key}})}} />            
        </div>
        <div className="mb-4">
            <TextField title={intl.formatMessage({id: "operations.value"})} label={intl.formatMessage({id: "operations.value"})} value={operation.variable.value} onChange={(ev, value)=>{updateOperation({...operation, variable: {...operation.variable, value: value}})}} />
        </div>
    </> : null;
}