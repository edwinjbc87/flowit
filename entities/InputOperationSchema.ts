import { BaseOperationSchema } from "./BaseOperationSchema";
import { VariableSchema } from "./ExpressionSchema";


export interface InputOperationSchema extends BaseOperationSchema {
    message: string;
    variable: string;
}