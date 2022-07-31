import { ModuleSchema } from "./ModuleSchema";

export interface ProgramSchema {
    main: string;
    modules: ModuleSchema[];
}