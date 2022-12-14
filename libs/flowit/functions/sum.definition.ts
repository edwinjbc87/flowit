import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Addition implements IOperationFunction {
    definition:OperationDefinition = {
        name: "sum",
        returnType: ValueType.Number,
        unlimitedParameters: {name: "op", type: ValueType.Number} as ParameterDefinition,
        description: "Adds two numbers"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        let acc = 0;
        for(let i=0; i<params.length; i++) {
            acc += (await evaluateExpression(params[i])) as number;
        }
        return acc;
    }
}

export default new Addition();