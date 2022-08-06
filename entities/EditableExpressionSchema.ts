import { ExpressionSchema } from "./ExpressionSchema";

export interface EditableExpressionSchema extends ExpressionSchema {
    stringifiedExpression: string
}