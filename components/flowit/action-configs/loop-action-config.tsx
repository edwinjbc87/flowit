import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { ExpressionSchema } from "@/entities/ExpressionSchema"
import { useEffect, useState } from "react"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import { LoopOperationSchema } from "@/entities/LoopOperationSchema"
import ExpressionInput from "./expression-input"

interface LoopActionConfigProps {
    operation?: BaseOperationSchema;
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function LoopActionConfig(props: LoopActionConfigProps) {
    const intl = useIntl()
    const {handler, currentModuleIndex, program} = useProgram()
    const [operation, setOperation] = useState<LoopOperationSchema>({...props.operation} as LoopOperationSchema)
    const [variables, setVariables] = useState<string[]>([])

    const updateOperation = async (operation)=>{
        if(props.onChange){
            props.onChange(operation)
        }
    }

    useEffect(() => {
        if(props.operation){
            setOperation(props.operation as LoopOperationSchema)
        }

        setVariables(program.modules[currentModuleIndex].operations.filter(o=>o.order < operation.order && o.type == OperationType.Declaration).map(o => (o as DeclarationOperationSchema).variable.name));
    }, [props.operation])

    return (
    <>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.condition"})}</label>
            <ExpressionInput title={intl.formatMessage({id: "config.condition"})} expression={operation.condition} onChange={(exp)=>{setOperation({...operation, condition: exp})}}></ExpressionInput>
        </div>
    </>)
}