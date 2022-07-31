import { RootState, useAppDispatch } from "store"
import { useSelector } from "react-redux"
import { Diagram } from "@/entities/Diagram"
import { setDiagram, setProject, setProgram, setCurrentModule, setExecution } from "store/slices/programSlice"
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

export default function useProgram() {
    const dispatch = useAppDispatch();
    const project = useSelector((state: RootState) => state.program.project);
    const program = useSelector((state: RootState) => state.program.program);
    const currentModuleIndex = useSelector((state: RootState) => state.program.currentModuleIndex);
    const diagram = useSelector<RootState, Diagram>(state => state.program.diagram)
    const execution = useSelector<RootState, ProgramExecution>(state => state.program.execution)

    const _setDiagram = async (diagram: Diagram) => await dispatch(setDiagram(diagram));
    const _setProject = async (project: Project) => await dispatch(setProject(project));
    const _setProgram = async (program: ProgramSchema) => await dispatch(setProgram(program));
    const _setCurrentModule = async (name: string) => await dispatch(setCurrentModule(name));
    const getCurrentModule = () => project.modules[currentModuleIndex];
    const variables = useRef(new Map());

    const evaluateExpression = async (expression: ExpressionSchema) => {
        let val:any = null;
        switch (expression.operation) {
            case "sum": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left + right;
                break;
            }
            case "sub": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left - right;
                break;
            }
            case "mul": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left * right;
                break;
            }
            case "div": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = left / right;
                break;
            }
            case "concat": {
                const left = await evaluateExpression(expression.left);
                const right = await evaluateExpression(expression.right);
                val = `${left}${right}`;
                break;
            }
            case "variable": {
                val = variables.current.get(expression.left);
                break;
            }
        }
        console.log(`Evaluated expression: ${expression.operation} = ${val}`);
        return val;
    }

    const runProgram = async () => {
        variables.current.clear();
        await dispatch(setExecution({ isRunning: true, currentNode: 0, variables: {}, output: [] }));
        await runModule(program.modules[currentModuleIndex])
        await dispatch(setExecution({ isRunning: false }))
    }

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
                    let val = variable.value;
                    switch(variable.type) {
                        case ValueType.Number: {
                            val = parseInt(variable.value);
                            break;
                        }
                        case ValueType.String: {
                            val = variable.value;
                            break;
                        }
                        case ValueType.Boolean: {
                            val = !!variable.value;
                            break;
                        }
                        case ValueType.Array: {
                            val = JSON.parse(variable.value);
                            break;
                        }
                    }
                    variables.current.set(variable.name, val);

                    await dispatch(setExecution({ variables: Object.fromEntries(variables.current) }))
                    break;
                }
                case OperationType.Output: {
                    
                    let val = String(await evaluateExpression((operation as OutputOperationSchema).expression));
                    
                    await dispatch(setExecution({ output: [...execution.output, val] }))
                    break;
                }
                case OperationType.Input: {
                    
                    let msg = String((operation as InputOperationSchema).message);
                    let variableName = String((operation as InputOperationSchema).variable);
                    let val:any = await prompt(msg);

                    const varSchema = (program.modules[currentModuleIndex].operations.find(op=>op.type == OperationType.Declaration && (op as DeclarationOperationSchema).variable.name == variableName) as DeclarationOperationSchema)?.variable;
                    switch(varSchema.type) {
                        case ValueType.Number: {
                            val = parseInt(val);
                            break;
                        }
                        case ValueType.String: {
                            val = varSchema.value;
                            break;
                        }
                        case ValueType.Boolean: {
                            val = !!varSchema.value;
                            break;
                        }
                        case ValueType.Array: {
                            val = JSON.parse(varSchema.value);
                            break;
                        }
                    }

                    variables.current.set(variableName, val);
                    
                    await dispatch(setExecution({ variables: Object.fromEntries(variables.current) }))
                    break;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    return {program, project, diagram, execution, handler: {setDiagram: _setDiagram, setProject: _setProject, setCurrentModule: _setCurrentModule, setProgram: _setProgram, getCurrentModule, runProgram}}
}