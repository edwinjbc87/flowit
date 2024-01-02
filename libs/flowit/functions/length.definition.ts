import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";
import { Functions } from "../Enums";

class Length implements IOperationFunction {
    definition:OperationDefinition = {
        name: Functions.Length,
        returnType: ValueType.Number,
        parameters: [{
            name: "op",
            type: ValueType.Any
        }],
        description: "Return the array length"
    };
    async calculate(params: ExpressionSchema[]|any, evaluateExpression: (exp: ExpressionSchema) => Promise<any>, variables?: Map<string, any>): Promise<any> {
        let val = await evaluateExpression(params[0]);
        if(Array.isArray(val) || typeof val === "string") {
            return val.length;
        } else {
            return 1;
        }
    }
}

export default new Length();