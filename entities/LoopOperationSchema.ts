import { BaseOperationSchema } from "./BaseOperationSchema";
import { ExpressionSchema, VariableSchema } from "./ExpressionSchema";


export interface LoopOperationSchema extends BaseOperationSchema {
    condition: ExpressionSchema;
}