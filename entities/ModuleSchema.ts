import { BaseOperationSchema } from "./BaseOperationSchema";

export interface ModuleSchema{
    name: string;
    type: string;
    operations: BaseOperationSchema[];
}