import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";
import { Functions } from "../Enums";

class Substraction implements IOperationFunction {
    definition:OperationDefinition = {
        name: Functions.Sub,
        returnType: ValueType.Number,
        parameters: [{
            name: "op1",
            type: ValueType.Number
        }, {
            name: "op2",
            type: ValueType.Number
        }],
        description: "Return the substraction of the second parameter from the first parameter."
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return await evaluateExpression(params[0]) - await evaluateExpression(params[1]);
    }
}

export default new Substraction();