import { Diagram } from "./Diagram";
import { VariableSchema, ValueType } from "./ExpressionSchema";

export interface Module {
    name: string
    diagram: Diagram
    type: string  
}

export interface Project{
    modules: Module[]
    main: string
}