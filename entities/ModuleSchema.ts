import { BaseOperationSchema } from "./BaseOperationSchema";
import { Diagram } from "./Diagram";

export interface ModuleSchema{
    name: string;
    type: string;
    operations: BaseOperationSchema[];
    diagram: Diagram;
}