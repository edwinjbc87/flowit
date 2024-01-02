import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";
import { Functions } from "../Enums";

class Average implements IOperationFunction {
    definition:OperationDefinition = {
        name: Functions.Avg,
        returnType: ValueType.Number,
        unlimitedParameters: {name: "op", type: ValueType.Number} as ParameterDefinition,
        description: "Average of many numbers"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        if(params.length <= 0) {
            return 0
        }
        let acc = 0
        for(let i=0; i<params.length; i++) {
            acc += (await evaluateExpression(params[i])) as number
        }
        return acc / params.length;
    }
}

export default new Average();