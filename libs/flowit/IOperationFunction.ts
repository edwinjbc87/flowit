import { ExpressionSchema } from "@/entities/ExpressionSchema";
import { OperationDefinition } from "@/entities/OperationDefinition";

export default interface IOperationFunction {
    definition: OperationDefinition;
    calculate: (params: ExpressionSchema[]|any, evaluateExpression:(exp:ExpressionSchema)=>any, variables?: Map<string, any>)=>any;
}