import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { useEffect, useState } from "react"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import { InputOperationSchema } from "@/entities/InputOperationSchema"
import TextField from "../general/textfield"
import Dropdown from "../general/dropdown"

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
        const vars = program.modules[currentModuleIndex].operations.filter(o=>o.type == OperationType.Declaration).map(o => (o as DeclarationOperationSchema).variable.name);
        if(props.operation){
            setOperation({...props.operation, variable: Boolean((props.operation as InputOperationSchema).variable) ? (props.operation as InputOperationSchema).variable : vars[0]} as InputOperationSchema)
        }

        setVariables(vars);
    }, [props.operation])

    return (
    <>
        <div className="mb-4">
            <TextField title={intl.formatMessage({id: "config.message"})} label={intl.formatMessage({id: "config.message"})} value={operation.message} onChange={(ev, value)=>{updateOperation({...operation, message: value})}} />
        </div>
        <div className="mb-4">
            <Dropdown title={intl.formatMessage({id: "config.variableName"})} label={intl.formatMessage({id: "config.variableName"})} selectedKey={operation.variable ?? variables[0]} options={variables.map(v => ({key: v, text: v}))} onChange={(ev, value)=>{updateOperation({...operation, variable: value.key})}} />
        </div>
    </>)
}