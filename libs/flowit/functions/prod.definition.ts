import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";
import { Functions } from "../Enums";

class Product implements IOperationFunction {
    definition:OperationDefinition = {
        name: Functions.Prod,
        returnType: ValueType.Number,
        unlimitedParameters: {name: "op", type: ValueType.Number} as ParameterDefinition,
        description: "Multiply many numbers"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        let acc = 1;
        for(let i=0; i<params.length; i++) {
            acc *= (await evaluateExpression(params[i])) as number;
        }
        return acc;
    }
}

export default new Product();