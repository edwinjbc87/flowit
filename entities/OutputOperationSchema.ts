import { BaseOperationSchema } from "./BaseOperationSchema";
import { ExpressionSchema } from "./ExpressionSchema";

export interface OutputOperationSchema extends BaseOperationSchema {
    expression: ExpressionSchema;
}