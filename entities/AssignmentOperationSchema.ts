import { BaseOperationSchema } from "./BaseOperationSchema";
import { ExpressionSchema } from "./ExpressionSchema";

export interface AssignmentOperationSchema extends BaseOperationSchema {
    variable: string;
    expression: ExpressionSchema|any;
}