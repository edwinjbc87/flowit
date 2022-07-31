import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema";
import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema";
import { ModuleSchema } from "@/entities/ModuleSchema";

const runModule = async (module:ModuleSchema)=>{
    const globalScopeOperations = module.operations.filter(op=>op.level == 0);
    await runScope(globalScopeOperations);
}

const runScope = async (operations: BaseOperationSchema[])=>{
    for(let i = 0; i < operations.length; i++) {
        let operation = operations[i];
        switch(operation.type) {
            case OperationType.Declaration: {
                let variable = (operation as DeclarationOperationSchema).variable;
                switch(variable.type) {
                    case "number": {
                        let value = Number(variable.value);
                        
                        break;
                    }
                }
                break;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
}

export {runModule, runScope}