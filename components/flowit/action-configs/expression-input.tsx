import { ExpressionSchema } from "@/entities/ExpressionSchema";
import useProgram from "@/hooks/useProgram";
import { useEffect, useState } from "react";

export default function ExpressionInput({expression, title, onChange}:{expression:ExpressionSchema, title:string, onChange:(expression:ExpressionSchema)=>void}) {
    const {handler, currentModuleIndex, program} = useProgram();
    const [value, setValue] = useState<string>("");
    
    const updateExpression = async (newValue:string)=>{
        try{
            console.log("NewValue", newValue)
            const newExpression = await handler.parseExpression(newValue);
            if(newExpression){
                onChange(newExpression)
            }
        }catch(err){
            console.error("Error parsing expression", err)
        }
    }

    const updateExpressionValue = async ()=>{
        const val = await handler.stringifyExpression(expression)
        setValue(val)
    }

    useEffect(() => {
        updateExpressionValue().catch(err=>{ setValue(""); console.error(err) })
    }, [expression])

    return (
        <input title={title} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={value} onChange={(ev)=>{updateExpression(ev.currentTarget.value)}} type="text" />
    )
}