import { RootState, useAppDispatch } from "store"
import { useSelector } from "react-redux"
import { Diagram } from "@/entities/Diagram"
import { setDiagram, setProject, setProgram, setCurrentModule, setExecution, addExecutionOutput, setExecutionVariable, setOperationName } from "store/slices/programSlice"
import { Project } from "@/entities/Project"
import { ProgramExecution } from "@/entities/ProgramExecution"
import { ProgramSchema } from "@/entities/ProgramSchema"
import { ModuleSchema } from "@/entities/ModuleSchema"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { AssignmentOperationSchema } from "@/entities/AssignmentOperationSchema"
import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema"
import { useRef, useState } from "react"
import { OutputOperationSchema } from "@/entities/OutputOperationSchema"
import { InputOperationSchema } from "@/entities/InputOperationSchema"
import { ConditionOperationSchema } from "@/entities/ConditionOperationSchema"
import { LoopOperationSchema } from "@/entities/LoopOperationSchema"
import { useProgramParser } from "hooks/useProgramParser"
import IOperationFunction from "@/libs/flowit/IOperationFunction"
import { Functions } from "@/libs/flowit/Functions"

export default function useProgram() {
    const dispatch = useAppDispatch()
    const project = useSelector((state: RootState) => state.program.project)
    const program = useSelector((state: RootState) => state.program.program)
    const currentModuleIndex = useSelector((state: RootState) => state.program.currentModuleIndex)
    const diagram = useSelector<RootState, Diagram>(state => state.program.diagram)
    const execution = useSelector<RootState, ProgramExecution>(state => state.program.execution)
    const { parseSchema } = useProgramParser()

    const _setDiagram = async (diagram: Diagram) => await dispatch(setDiagram(diagram))
    const _setProject = async (project: Project) => await dispatch(setProject(project))
    const _setProgram = async (_program: ProgramSchema) => {
        const _project = parseSchema(_program)
        await dispatch(setProgram(_program))
        await dispatch(setProject(_project))
    }
    const _setCurrentModule = async (name: string) => await dispatch(setCurrentModule(name))
    const getCurrentModule = () => project.modules[currentModuleIndex]
    
    const variables = useRef(new Map<string, any>())

    const renameOperation = async (id: string, name: string) => {
        await dispatch(setOperationName({id, name}));
    }

    const saveOperation = async (operation: BaseOperationSchema) => {
        await findAndUpdateOperation(String(operation.id), operation, program.modules[currentModuleIndex].operations)
    }

    const addOperation = async (operation: BaseOperationSchema, previousId: String) => {
        const _program = JSON.parse(JSON.stringify(program));
        const prevOper = _program.modules[currentModuleIndex].operations.find(op => String(op.id) == String(previousId));
        if(!prevOper) {
            throw new Error("Previous operation not found")
        }
        const postOpers = _program.modules[currentModuleIndex].operations.filter(op => op.order > prevOper.order);
        for(const op of postOpers) {
            op.order += 1;
        }
        _program.modules[currentModuleIndex].operations.push({...operation, order: prevOper.order + 1});
        const _project = await parseSchema(_program)

        await dispatch(setProgram(_program))
        await dispatch(setProject(_project))
    }

    const findOperation = (id: string) => {
        return program.modules[currentModuleIndex].operations.find(op => String(op.id) == String(id))
    }

    const findAndUpdateOperation = async (id: string, operation: BaseOperationSchema, operations:BaseOperationSchema[]) => {
        const _program = JSON.parse(JSON.stringify(program));
        const operIndex = _program.modules[currentModuleIndex].operations.findIndex(op => String(op.id) == String(id))
        if(operIndex >= 0) {
            _program.modules[currentModuleIndex].operations[operIndex] = operation
            const _project = parseSchema(_program)
            await dispatch(setProgram(_program))
            await dispatch(setProject(_project))
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

    const getDefaultOperation = async (operation:OperationType, order?:number):Promise<BaseOperationSchema> => {
        const _program = JSON.parse(JSON.stringify(program));
        const lastOp = (_program.modules[currentModuleIndex].operations.sort((a,b) => b.id - a.id) as BaseOperationSchema[])[0]

        const newOperation = {id: lastOp.id + 1, name: "", type: operation, order}
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
        }
        return newOperation as BaseOperationSchema
    }

    const runScope = async (operations: BaseOperationSchema[], parentId?:string)=>{
        const opers = JSON.parse(JSON.stringify(operations)).filter(op=> (!op.parent && !parent) || (op.parent == parentId)).sort((a,b) => a.order - b.order) as BaseOperationSchema[]

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
                        await runScope(operations, String(operation.id+'_yes'))
                    } else {
                        await runScope(operations, String(operation.id+'_no'))
                    }
                    
                    break
                }
                case OperationType.Loop: {
                    //let operations = (operation as LoopOperationSchema).operations
                    let condition = (operation as LoopOperationSchema).condition

                    while(await evaluateExpression(condition)) {
                        await runScope(operations, String(operation.id))
                    }
                    
                    break
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    return {program, project, diagram, currentModuleIndex, execution, handler: {setDiagram: _setDiagram, setProject: _setProject, setCurrentModule: _setCurrentModule, setProgram: _setProgram, getCurrentModule, runProgram, renameOperation, updateOperation: findAndUpdateOperation, saveOperation, getOperation: findOperation, isExpression, getExpressionDefinition, addOperation, getDefaultOperation}}
}