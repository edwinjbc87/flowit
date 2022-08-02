import { RootState, useAppDispatch } from "store"
import { useSelector } from "react-redux"
import { Diagram } from "@/entities/Diagram"
import { setDiagram, setProject, setProgram, setCurrentModule, setExecution, addExecutionOutput, setExecutionVariable } from "store/slices/programSlice"
import { Project } from "@/entities/Project"
import { ProgramExecution } from "@/entities/ProgramExecution"
import { ProgramSchema } from "@/entities/ProgramSchema"
import { ModuleSchema } from "@/entities/ModuleSchema"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import { ExpressionSchema, ValueType } from "@/entities/ExpressionSchema"
import { useRef, useState } from "react"
import { OutputOperationSchema } from "@/entities/OutputOperationSchema"
import { InputOperationSchema } from "@/entities/InputOperationSchema"
import { ConditionOperationSchema } from "@/entities/ConditionOperationSchema"
import { LoopOperationSchema } from "@/entities/LoopOperationSchema"

export default function useProgram() {
    const dispatch = useAppDispatch()
    const project = useSelector((state: RootState) => state.program.project)
    const program = useSelector((state: RootState) => state.program.program)
    const currentModuleIndex = useSelector((state: RootState) => state.program.currentModuleIndex)
    const diagram = useSelector<RootState, Diagram>(state => state.program.diagram)
    const execution = useSelector<RootState, ProgramExecution>(state => state.program.execution)

    const _setDiagram = async (diagram: Diagram) => await dispatch(setDiagram(diagram))
    const _setProject = async (project: Project) => await dispatch(setProject(project))
    const _setProgram = async (program: ProgramSchema) => await dispatch(setProgram(program))
    const _setCurrentModule = async (name: string) => await dispatch(setCurrentModule(name))
    const getCurrentModule = () => project.modules[currentModuleIndex]
    const variables = useRef(new Map())

    const evaluateExpression = async (expression: ExpressionSchema) => {
        let val:any = null
        switch (expression.operation) {
            case "sum": {
                const left = await evaluateExpression(expression.left)
                const right = await evaluateExpression(expression.right)
                val = left + right
                break
            }
            case "sub": {
                const left = await evaluateExpression(expression.left)
                const right = await evaluateExpression(expression.right)
                val = left - right
                break
            }
            case "mul": {
                const left = await evaluateExpression(expression.left)
                const right = await evaluateExpression(expression.right)
                val = left * right
                break
            }
            case "div": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left / right;
                break;
            }
            case "and": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left && right;
                break;
            }
            case "or": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left || right;
            }
            case "not": {
                const left = await evaluateExpression(expression.left);
                val = !left;
            }
            case "eq": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left === right;
            }
            case "neq": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left !== right;
            }
            case "lt": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left < right;
            }
            case "gt": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left > right;
            }
            case "le": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left <= right;
            }
            case "ge": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left >= right;
            }
            case "concat": {
                const left = await evaluateExpression(expression.left)
                const right = await evaluateExpression(expression.right)
                val = `${left}${right}`
                break
            }
            case "variable": {
                val = variables.current.get(expression.left)
                console.log(execution.variables)
                break
            }
            default: {
                val = expression.left
            }
        }
        return val
    }

    const runProgram = async () => {
        variables.current.clear()
        await dispatch(setExecution({ isRunning: true, currentNode: 0, variables: {}, output: [] }))
        await runModule(program.modules[currentModuleIndex])
        await dispatch(setExecution({ isRunning: false }))
    }

    const runModule = async (module:ModuleSchema)=>{
        const globalScopeOperations = module.operations.filter(op=>op.level == 0)
        await runScope(globalScopeOperations)
    }

    const getValue = async (name:string, value:any):Promise<any> => {
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

    const runScope = async (operations: BaseOperationSchema[])=>{
        for(let i = 0; i < operations.length; i++) {
            let operation = operations[i]
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
                    
                    let msg = String((operation as InputOperationSchema).message)
                    let variableName = String((operation as InputOperationSchema).variable)
                    let val:any = String(await evaluateExpression((operation as OutputOperationSchema).expression))

                    variables.current.set(variableName, await getValue(variableName, val))
                    await dispatch(setExecutionVariable({ name: variableName, value: variables.current.get(variableName) }))
                    break;
                }
                case OperationType.Input: {
                    
                    let msg = String((operation as InputOperationSchema).message)
                    let variableName = String((operation as InputOperationSchema).variable)
                    let val:any = await prompt(msg)

                    variables.current.set(variableName, await getValue(variableName, {left: val}))
                    
                    await dispatch(setExecutionVariable({ name: variableName, value: variables.current.get(variableName) }))
                    break;
                }
                case OperationType.Condition: {
                    let yesOperations = (operation as ConditionOperationSchema).yes
                    let noOperations = (operation as ConditionOperationSchema).no
                    let condition = (operation as ConditionOperationSchema).condition

                    if(await evaluateExpression(condition)) {
                        await runScope(yesOperations)
                    } else {
                        await runScope(noOperations)
                    }
                    
                    break;
                }
                case OperationType.Loop: {
                    let operations = (operation as LoopOperationSchema).operations
                    let condition = (operation as LoopOperationSchema).condition

                    while(await evaluateExpression(condition)) {
                        await runScope(operations)
                    }
                    
                    break;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    return {program, project, diagram, execution, handler: {setDiagram: _setDiagram, setProject: _setProject, setCurrentModule: _setCurrentModule, setProgram: _setProgram, getCurrentModule, runProgram}}
}