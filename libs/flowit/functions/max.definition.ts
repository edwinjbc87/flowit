import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";
import { Functions } from "../Enums";

class Max implements IOperationFunction {
    definition:OperationDefinition = {
        name: Functions.Max,
        returnType: ValueType.Number,
        unlimitedParameters: {name: "op", type: ValueType.Number} as ParameterDefinition,
        description: "Return the maximum value from many numbers"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        let acc = Number.NEGATIVE_INFINITY;
        for(let i=0; i<params.length; i++) {
            let val = await evaluateExpression(params[i]) as number;
            if(val > acc) {
                acc = val;
            }
        }
        return acc;
    }
}

export default new Max();