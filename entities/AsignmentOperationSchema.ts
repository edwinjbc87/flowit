import { BaseOperationSchema } from "./BaseOperationSchema";
import { ExpressionSchema } from "./ExpressionSchema";

export interface AsignmentOperationSchema extends BaseOperationSchema {
    variable: string;
    expression: ExpressionSchema;
}