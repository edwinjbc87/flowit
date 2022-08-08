import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Lt implements IOperationFunction {
    definition:OperationDefinition = {
        name: "lt",
        returnType: ValueType.Boolean,
        parameters: [
            {name: "op1", type: ValueType.Number},
            {name: "op2", type: ValueType.Number}
        ],
        description: "Return true if the first parameter is less than the second"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return await evaluateExpression(params[0]) < await evaluateExpression(params[1]);
    }
}

export default new Lt();