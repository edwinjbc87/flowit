import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";
import { Functions } from "../Enums";

class Not implements IOperationFunction {
    definition:OperationDefinition = {
        name: Functions.Not,
        returnType: ValueType.Boolean,
        parameters: [
            {name: "op1", type: ValueType.Any}
        ],
        description: "Return true if the first parameter is false, otherwise return false."
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return !(await evaluateExpression(params[0]));
    }
}

export default new Not();