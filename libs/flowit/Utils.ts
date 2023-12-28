import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema";
import { ConditionOperationSchema } from "@/entities/ConditionOperationSchema";
import { LoopOperationSchema } from "@/entities/LoopOperationSchema";

export const findOperation = (id: number, opers?: BaseOperationSchema[]): BaseOperationSchema|null => {
    let op = (opers ?? [])?.find(op => op.id === id) ?? null;
    if(!op) {
        const scopeOps = (opers ?? [])?.filter(op => op.type === OperationType.Condition || op.type === OperationType.Loop) ?? [];
        for(let i = 0; i < scopeOps.length; i++) {
            if(scopeOps[i].type === OperationType.Condition){
                op = findOperation(id, (scopeOps[i] as ConditionOperationSchema).yesOperations);
                if(!op){
                    op = findOperation(id, (scopeOps[i] as ConditionOperationSchema).noOperations);
                }
            }
            else if(scopeOps[i].type === OperationType.Loop){
                op = findOperation(id, (scopeOps[i] as LoopOperationSchema).yesOperations);
            }

            if(Boolean(op)) {
                break;
            }
        }
    }

    return op;
}