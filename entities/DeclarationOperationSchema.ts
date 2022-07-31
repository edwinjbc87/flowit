import { BaseOperationSchema } from "./BaseOperationSchema";
import { VariableSchema } from "./ExpressionSchema";


export interface DeclarationOperationSchema extends BaseOperationSchema {
    variable: VariableSchema;
}