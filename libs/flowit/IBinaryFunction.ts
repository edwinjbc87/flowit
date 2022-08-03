import { ExpressionSchema } from "@/entities/ExpressionSchema";

export default interface IBinaryFunction {
    calculate: (op1:ExpressionSchema, op2:ExpressionSchema, evaluateExpression:(exp:ExpressionSchema)=>any)=>any;
}