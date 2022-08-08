import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Variable implements IOperationFunction {
    definition:OperationDefinition = {
        name: "var",
        returnType: ValueType.Any,
        parameters: [{
            name: "op",
            type: ValueType.String
        }],
        description: "Return the value of the variable"
    };
    async calculate(params: ExpressionSchema[]|any, evaluateExpression: (exp: ExpressionSchema) => Promise<any>, variables?: Map<string, any>): Promise<any> {
        return variables?.get(params[0] as string);
    }
}

export default new Variable();