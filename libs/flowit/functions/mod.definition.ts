import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Module implements IOperationFunction {
    definition:OperationDefinition = {
        name: "mod",
        returnType: ValueType.Number,
        parameters: [{
            name: "op1",
            type: ValueType.Number
        }, {
            name: "op2",
            type: ValueType.Number
        }],
        description: "Module of division of two numbers"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return await evaluateExpression(params[0]) % await evaluateExpression(params[1]);
    }
}

export default new Module();