import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import IOperationFunction from "../IOperationFunction";

class Or implements IOperationFunction {
    definition:OperationDefinition = {
        name: "or",
        returnType: ValueType.Boolean,
        unlimitedParameters: {name: "op", type: ValueType.Boolean} as ParameterDefinition,
        description: "Return true if any of the parameters is true"
    };
    async calculate(params: ExpressionSchema[], evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        let acc = true;
        for(let i=0; i<params.length; i++) {
            acc ||= (await evaluateExpression(params[i])) as boolean;
        }
        return acc;
    }
}

export default new Or();