import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema";
import { useIntl } from "react-intl";
import useProgram from "@/hooks/useProgram";
import { ExpressionSchema } from "@/entities/ExpressionSchema";

export default function DeclarationActionConfig({operation}: {operation: DeclarationOperationSchema}) {
    const intl = useIntl();
    const {handler} = useProgram();

    const updateOperation = (operation)=>{

    }

    const getExpressionValue = (expression: ExpressionSchema):string=>{
        return expression.left+'';
    }

    return (<div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Nombre de Paso
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.name} onChange={(ev)=>{updateOperation({...operation, name: ev.currentTarget.value})}} type="text" placeholder="Nombre de operación" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Nombre de Variable
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={operation.variable.name} onChange={(ev)=>{updateOperation({...operation, variable: {...operation.variable, name: ev.currentTarget.value}})}} type="text" placeholder="Nombre de variable" />
        </div>
    </div>)
}