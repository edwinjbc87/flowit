import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Substraction implements IOperationFunction {
    definition:OperationDefinition = {
        name: "sub",
        returnType: ValueType.Number,
        parameters: [{
            name: "op1",
            type: ValueType.Number
        }, {
            name: "op2",
            type: ValueType.Number
        }],
        description: "Adds two numbers"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return await evaluateExpression(params[0]) - await evaluateExpression(params[1]);
    }
}

export default new Substraction();