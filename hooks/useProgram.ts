import { RootState, useAppDispatch } from "store"
import { useSelector } from "react-redux"
import { Diagram } from "@/entities/Diagram"
import { setProgram, setCurrentModule, setExecution, addExecutionOutput, setExecutionVariable, setOperationName } from "store/slices/programSlice"
import { Project } from "@/entities/Project"
import { ProgramExecution } from "@/entities/ProgramExecution"
import { ProgramSchema } from "@/entities/ProgramSchema"
import { ModuleSchema } from "@/entities/ModuleSchema"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { AssignmentOperationSchema } from "@/entities/AssignmentOperationSchema"
import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema"
import { useEffect, useRef, useState } from "react"
import { OutputOperationSchema } from "@/entities/OutputOperationSchema"
import { InputOperationSchema } from "@/entities/InputOperationSchema"
import { ConditionOperationSchema } from "@/entities/ConditionOperationSchema"
import { LoopOperationSchema } from "@/entities/LoopOperationSchema"
import { useProgramParser } from "hooks/useProgramParser"
import IOperationFunction from "@/libs/flowit/IOperationFunction"
import { Functions } from "@/libs/flowit/Enums"
import { findOperation } from "@/libs/flowit/Utils"

export default function useProgram() {
    const dispatch = useAppDispatch()
    const program = useSelector((state: RootState) => state.program.program)
    const currentModuleIndex = useSelector((state: RootState) => state.program.currentModuleIndex)
    const diagram = useSelector<RootState, Diagram>(state => state.program.program.modules[currentModuleIndex]?.diagram)
    const execution = useSelector<RootState, ProgramExecution>(state => state.program.execution)
    const { parseModule } = useProgramParser()

    // const _setDiagram = async (diagram: Diagram) => await dispatch(setDiagram(diagram))
    // const _setProject = async (project: Project) => await dispatch(setProject(project))
    const _setProgram = async (_program: ProgramSchema) => {                
        await dispatch(setProgram({..._program, modules: _program.modules.map(module => ({...module, diagram: parseModule(module)} as ModuleSchema))}))
    }
    const _setCurrentModule = async (name: string) => await dispatch(setCurrentModule(name))
    const getCurrentModule = () => program.modules[currentModuleIndex]
    
    const variables = useRef(new Map<string, any>())

    const renameOperation = async (id: string, name: string) => {
        await dispatch(setOperationName({id, name}));
    }

    const saveOperation = async (operation: BaseOperationSchema) => {
        await findAndUpdateOperation(String(operation.id), operation, program.modules[currentModuleIndex].operations)
    }

    const patchOperation = (operation: BaseOperationSchema, operations: BaseOperationSchema[], previousId: number): BaseOperationSchema[] => {
        for(let i = 0; i < operations.length; i++) {
            if(operations[i].id == previousId) {
                operations.splice(i+1, 0, operation);
                break;
            } else if(operations[i].type == OperationType.Loop) {
                const loop = operations[i] as LoopOperationSchema;
                loop.yesOperations = patchOperation(operation, [...loop.yesOperations], previousId);
            } else if(operations[i].type == OperationType.Condition) {
                const condition = operations[i] as ConditionOperationSchema;
                condition.yesOperations = patchOperation(operation, [...condition.yesOperations], previousId);
                condition.noOperations = patchOperation(operation, [...condition.noOperations], previousId);
            }
        }

        return operations;
    }

    const addOperation = async (operation: BaseOperationSchema, previousId: number) => {
        const baseId = new Date().getTime();
        const _program:ProgramSchema = JSON.parse(JSON.stringify(program));
        //const prevOper = _program.modules[currentModuleIndex].operations.find(op => String(op.id) == String(previousId));
        // const prevIndex = _program.modules[currentModuleIndex].operations.findIndex(op => (op.id) == (previousId));

        // if(prevIndex < 0) {
        //     throw new Error("Previous operation not found")
        // }

        let op = {...operation, id: baseId};

        if(operation.type == OperationType.Loop) {
            op = {...(await getDefaultOperation(OperationType.Loop)), ...op,
                id: op.id, 
                level: op.level,
                yesOperations: [
                    {...(await getDefaultOperation(OperationType.Start)), parent: op.id, name: "Inicio", id: op.id + 1, level: op.level + 1},
                    {...(await getDefaultOperation(OperationType.End)), parent: op.id, name: "Fin", id: op.id + 2, level: op.level + 1}
                ],
            } as LoopOperationSchema;
        } else if(operation.type == OperationType.Condition) {
            op = {...(await getDefaultOperation(OperationType.Condition)), ...op,
                level: op.level,
                yesOperations: [
                    {...(await getDefaultOperation(OperationType.Start)), parent: op.id, name: "Inicio", id: op.id + 1, level: op.level + 1},
                    {...(await getDefaultOperation(OperationType.End)), parent: op.id, name: "Fin", id: op.id + 2, level: op.level + 1}
                ],
                noOperations: [
                    {...(await getDefaultOperation(OperationType.Start)), parent: op.id, name: "Inicio", id: op.id + 3, level: op.level + 1},
                    {...(await getDefaultOperation(OperationType.End)), parent: op.id, name: "Fin", id: op.id + 4, level: op.level + 1}
                ],
            } as ConditionOperationSchema;
        } 
        
        _program.modules[currentModuleIndex].operations = patchOperation(op, _program.modules[currentModuleIndex].operations, previousId);

        await _setProgram(_program);
    }

    const _findOperation = (id: number, opers?: BaseOperationSchema[]): BaseOperationSchema|null => {
        return findOperation(id, opers ?? program.modules[currentModuleIndex].operations);
    }

    const findAndUpdateOperation = async (id: string, operation: BaseOperationSchema, operations:BaseOperationSchema[]) => {
        const _program = JSON.parse(JSON.stringify(program));
        const operIndex = _program.modules[currentModuleIndex].operations.findIndex(op => String(op.id) == String(id))
        if(operIndex >= 0) {
            _program.modules[currentModuleIndex].operations[operIndex] = operation
            
            await dispatch(setProgram({..._program, modules: _program.modules.map(module => ({...module, diagram: parseModule(module)} as ModuleSchema))}))
        }
    }

    function isExpression(expression: any): expression is ExpressionSchema {
        return expression != undefined && expression.operation != undefined && expression.params != undefined
    }

    const evaluateExpression = async (expression: ExpressionSchema|any) => {
        let val:any = null

        if(isExpression(expression)) {
            const operator:IOperationFunction = (await import(`@/libs/flowit/functions/${expression.operation}.definition.ts`)).default as IOperationFunction
            console.log("Operator", operator)

            val = await operator.calculate(expression.params, evaluateExpression, variables.current)
            switch(operator.definition.returnType) {
                case ValueType.Integer: {
                    val = parseInt(val)
                    break
                }
                case ValueType.Number: {
                    val = parseFloat(val)
                    break
                }
                case ValueType.String: {
                    val = String(val)
                    break
                }
                case ValueType.Boolean: {
                    val = !!val
                    break
                }
                case ValueType.Array: {
                    val = JSON.parse(val)
                    break
                }
            }
        } else {
            val = expression
        }

        return val
    }

    const getExpressionDefinition = async (operation: Functions) => {
        const operator:IOperationFunction = (await import(`@/libs/flowit/functions/${operation}.definition.ts`)).default as IOperationFunction
        return operator.definition
        
    }

    const runProgram = async () => {
        variables.current.clear()
        await dispatch(setExecution({ isRunning: true, currentNode: 0, variables: {}, output: [] }))
        await runModule(program.modules[currentModuleIndex])
        await dispatch(setExecution({ isRunning: false }))
    }

    const runModule = async (module:ModuleSchema)=>{
        await runScope(module.operations)
    }

    const getValue = async (name:string, value:ExpressionSchema):Promise<any> => {
        const varSchema = (program.modules[currentModuleIndex].operations.find(op=>op.type == OperationType.Declaration && (op as DeclarationOperationSchema).variable.name == name) as DeclarationOperationSchema)?.variable
        let val:any = await evaluateExpression(value)

        switch(varSchema.type) {
            case ValueType.Integer: {
                val = parseInt(val)
                break
            }
            case ValueType.Number: {
                val = parseFloat(val)
                break
            }
            case ValueType.String: {
                val = String(val)
                break
            }
            case ValueType.Boolean: {
                val = !!val
                break
            }
            case ValueType.Array: {
                val = JSON.parse(val)
                break
            }
        }

        return val
    }

    const getDefaultOperation = async (operation:OperationType):Promise<BaseOperationSchema> => {
        const newOperation = {id: new Date().getTime(), name: "", type: operation, level: 0}
        switch(operation) {
            case OperationType.Declaration: {
                return {...newOperation, variable: {name: "", type: ValueType.String}} as DeclarationOperationSchema
            }
            case OperationType.Assignment: {
                return {...newOperation, variable: "", expression: ""} as AssignmentOperationSchema
            }
            case OperationType.Condition: {
                return {...newOperation, condition: true} as ConditionOperationSchema
            }
            case OperationType.Loop: {
                return {...newOperation, condition: true} as LoopOperationSchema
            }
            case OperationType.Input: {
                return {...newOperation, variable: ""} as InputOperationSchema
            }
            case OperationType.Output: {
                return {...newOperation, expression: ""} as OutputOperationSchema
            }
            case OperationType.Start: {
                return {...newOperation} as BaseOperationSchema
            }
            case OperationType.End: {
                return {...newOperation} as BaseOperationSchema
            }
        }
        return newOperation as BaseOperationSchema
    }

    const runScope = async (operations: BaseOperationSchema[], parentId?:string)=>{
        const opers = operations as BaseOperationSchema[]

        for(let i = 0; i < opers.length; i++) {
            let operation = opers[i]
            switch(operation.type) {
                case OperationType.Declaration: {
                    let variable = (operation as DeclarationOperationSchema).variable
                    let val = variable.value;
                    
                    variables.current.set(variable.name, await getValue(variable.name, val))
                    await dispatch(setExecutionVariable({ name: variable.name, value: variables.current.get(variable.name) }))
                    break
                }
                case OperationType.Output: {
                    let val = String(await evaluateExpression((operation as OutputOperationSchema).expression))
                    
                    await dispatch(addExecutionOutput(val))
                    break
                }
                case OperationType.Assignment: {
                    
                    let variableName = String((operation as AssignmentOperationSchema).variable)
                    let val:any = String(await evaluateExpression((operation as AssignmentOperationSchema).expression))

                    variables.current.set(variableName, await getValue(variableName, val))
                    await dispatch(setExecutionVariable({ name: variableName, value: variables.current.get(variableName) }))
                    break
                }
                case OperationType.Input: {
                    
                    let msg = String((operation as InputOperationSchema).message)
                    let variableName = String((operation as InputOperationSchema).variable)
                    let val:any = await prompt(msg)

                    variables.current.set(variableName, await getValue(variableName, val))
                    
                    await dispatch(setExecutionVariable({ name: variableName, value: variables.current.get(variableName) }))
                    break
                }
                case OperationType.Condition: {
                    //let yesOperations = (operation as ConditionOperationSchema).yes
                    //let noOperations = (operation as ConditionOperationSchema).no
                    let condition = (operation as ConditionOperationSchema).condition
                    
                    if(await evaluateExpression(condition)) {
                        await runScope((operation as ConditionOperationSchema).yesOperations)
                    } else {
                        await runScope((operation as ConditionOperationSchema).noOperations)
                    }
                    
                    break
                }
                case OperationType.Loop: {
                    //let operations = (operation as LoopOperationSchema).operations
                    let condition = (operation as LoopOperationSchema).condition

                    while(await evaluateExpression(condition)) {
                        await runScope((operation as ConditionOperationSchema).yesOperations)
                    }
                    
                    break
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    // useEffect(() => {
    //     const proy:Project = parseSchema(program);
    //     _setProject(proy).catch(console.error);
    // }, [program]);

    return {program, diagram, currentModuleIndex, execution, handler: {setCurrentModule: _setCurrentModule, setProgram: _setProgram, getCurrentModule, runProgram, renameOperation, updateOperation: findAndUpdateOperation, saveOperation, getOperation: _findOperation, isExpression, getExpressionDefinition, addOperation, getDefaultOperation}}
}