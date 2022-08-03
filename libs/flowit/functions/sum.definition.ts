import { ExpressionSchema } from "@/entities/ExpressionSchema";
import IBinaryFunction from "../IBinaryFunction";

export class BinarySum implements IBinaryFunction {
    async calculate(op1: ExpressionSchema, op2: ExpressionSchema, evaluateExpression: (exp: ExpressionSchema) => Promise<any>): Promise<any> {
        return await evaluateExpression(op1) + await evaluateExpression(op2);
    }
}