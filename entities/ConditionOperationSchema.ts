import { BaseOperationSchema } from "./BaseOperationSchema";
import { ExpressionSchema, VariableSchema } from "./ExpressionSchema";


export interface ConditionOperationSchema extends BaseOperationSchema {
    condition: ExpressionSchema;
}