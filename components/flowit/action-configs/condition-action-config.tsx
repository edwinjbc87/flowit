import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { ExpressionSchema } from "@/entities/ExpressionSchema"
import { useEffect, useState } from "react"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import { ConditionOperationSchema } from "@/entities/ConditionOperationSchema"
import ExpressionInput from "./expression-input"

interface ConditionActionConfigProps {
    operation?: BaseOperationSchema;
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function ConditionActionConfig(props: ConditionActionConfigProps) {
    const intl = useIntl();
    const {handler, currentModuleIndex, program} = useProgram();
    const [operation, setOperation] = useState<ConditionOperationSchema>({...props.operation} as ConditionOperationSchema);
    const [variables, setVariables] = useState<string[]>([]);

    const updateOperation = async (operation)=>{
        if(props.onChange){
            props.onChange(operation)
        }
    }

    useEffect(() => {
        if(props.operation){
            setOperation(props.operation as ConditionOperationSchema)
        }

        setVariables(program.modules[currentModuleIndex].operations.filter(o=>o.type == OperationType.Declaration).map(o => (o as DeclarationOperationSchema).variable.name));
    }, [props.operation])

    return (
    <>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.condition"})}</label>
            <ExpressionInput valueType={ValueType.Boolean} title={intl.formatMessage({id: "config.condition"})} expression={operation.condition} onChange={(exp)=>{updateOperation({...operation, condition: exp})}}></ExpressionInput>
        </div>
    </>)
}