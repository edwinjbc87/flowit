import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Concat implements IOperationFunction {
    definition:OperationDefinition = {
        name: "concat",
        returnType: ValueType.String,
        unlimitedParameters: {name: "op", type: ValueType.Any} as ParameterDefinition,
        description: "Concat mutiple strings"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        let acc = '';
        for(let i=0; i<params.length; i++) {
            acc += '' + (await evaluateExpression(params[i])) as string
        }
        return acc;
    }
}

export default new Concat();