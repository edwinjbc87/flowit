import { BaseOperationSchema } from "@/entities/BaseOperationSchema";
import { ModuleSchema } from "@/entities/ModuleSchema";

const runModule = async (module:ModuleSchema)=>{
    const globalScopeOperations = module.operations.filter(op=>op.level == 0);
    runScope(globalScopeOperations);
}

const runScope = (operations: BaseOperationSchema[])=>{
    
}

export {runModule, runScope}