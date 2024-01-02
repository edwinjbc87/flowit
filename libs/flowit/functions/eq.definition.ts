import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";
import { Functions } from "../Enums";

class Eq implements IOperationFunction {
    definition:OperationDefinition = {
        name: Functions.Eq,
        returnType: ValueType.Boolean,
        parameters: [
            {name: "op1", type: ValueType.Any},
            {name: "op2", type: ValueType.Any}
        ],
        description: "Return true if the first parameter is equal than the second"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return await evaluateExpression(params[0]) == await evaluateExpression(params[1]);
    }
}

export default new Eq();