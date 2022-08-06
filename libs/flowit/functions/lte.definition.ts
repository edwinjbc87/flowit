import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Leq implements IOperationFunction {
    definition:OperationDefinition = {
        name: "lte",
        returnType: ValueType.Boolean,
        unlimitedParameters: {name: "op", type: ValueType.Number} as ParameterDefinition,
        description: "Return true if the first parameter is less than or equal to the second"
    }
    
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return await evaluateExpression(params[0]) <= await evaluateExpression(params[1]);
    }
}

export default new Leq()