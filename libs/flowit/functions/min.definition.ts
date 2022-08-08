import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Min implements IOperationFunction {
    definition:OperationDefinition = {
        name: "min",
        returnType: ValueType.Number,
        unlimitedParameters: {name: "op", type: ValueType.Number} as ParameterDefinition,
        description: "Return the minimum value from many numbers"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        let acc = Number.POSITIVE_INFINITY;
        for(let i=0; i<params.length; i++) {
            let val = await evaluateExpression(params[i]) as number;
            if(val < acc) {
                acc = val;
            }
        }
        return acc;
    }
}

export default new Min();