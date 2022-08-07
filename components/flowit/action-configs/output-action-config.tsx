import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { useIntl } from "react-intl"
import useProgram from "@/hooks/useProgram"
import { ExpressionSchema } from "@/entities/ExpressionSchema"
import { useEffect, useRef, useState } from "react"
import { BaseOperationSchema } from "@/entities/BaseOperationSchema"
import {ValueType} from "@/entities/ExpressionSchema"
import ExpressionInput from "./expression-input"
import { OutputOperationSchema } from "@/entities/OutputOperationSchema"

interface OutputActionConfigProps {
    operation?: BaseOperationSchema;
    onChange?: (operation: BaseOperationSchema) => void;
}

export default function OutputActionConfig(props: OutputActionConfigProps) {
    const intl = useIntl();
    const {handler} = useProgram();
    const [operation, setOperation] = useState<OutputOperationSchema>({...props.operation} as OutputOperationSchema);
    const [expression, setExpression] = useState<ExpressionSchema|any>();
    const expBuilder = useRef<any>();

    const updateOperation = async (operation)=>{
        const _exp = expBuilder.current?.getExpression();
        if(props.onChange){
            props.onChange(operation)
        }
    }
    
    useEffect(() => {
        if(props.operation){
            setOperation(props.operation as OutputOperationSchema)
        }
    }, [props.operation])

    return (
    <>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{intl.formatMessage({id: "config.expression"})}</label>
            <ExpressionInput ref={expBuilder} title={intl.formatMessage({id: "config.expression"})} valueType={ValueType.String} expression={operation.expression} onChange={(exp)=>{updateOperation({...operation, expression: exp})}}></ExpressionInput>
        </div>
    </>)
}