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

    const parseExpression = async (expressionString: string):Promise<ExpressionSchema|any> => {
        const parsedExp = {} as ExpressionSchema

        let token = "";
        for(let i=0; i<expressionString.length; i++) {
            const char = expressionString[i]
            if(char == " ") {
                continue
            } else {
                token += char
            }
        }

        const iniParamsIndex = expressionString.indexOf("(")
        const endParamsIndex = expressionString.lastIndexOf(")")

        console.log(`(:${iniParamsIndex},):${endParamsIndex}`)

        if(iniParamsIndex >= 0 && endParamsIndex >= 0) {
            parsedExp.operation = expressionString.substring(0, iniParamsIndex)
            console.log("Params", expressionString.substring(iniParamsIndex+1, endParamsIndex))
            parsedExp.params = await parseParams(expressionString.substring(iniParamsIndex+1, endParamsIndex))
        } else {
            try{
                console.log(`Parsing simple expression: ${expressionString}`)
                return JSON.parse(expressionString)
            }catch{
                throw new Error("Invalid expression");
            }
        }

        return parsedExp
    }

    const parseParams = async (paramsString: string):Promise<ExpressionSchema[]> => {
        return Promise.all(paramsString.split(",").map((paramString) => parseExpression(paramString.trim())))
    }

    function isExpression(expression: any): expression is ExpressionSchema {
        return expression.operation != undefined && expression.params != undefined
    }

    const evaluateExpression = async (expression: ExpressionSchema|any) => {
        let val:any = null

        if(isExpression(expression)) {
            const operator:IOperationFunction = (await import(`@/libs/flowit/functions/${expression.operation}.definition.ts`)).default as IOperationFunction
            console.log("Operator", operator)
            val = operator.calculate(expression.params, evaluateExpression, variables.current)
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

    const runScope = async (operations: BaseOperationSchema[], parentId?:string)=>{
        const opers = operations.filter(op=> (!op.parent && !parent) || (op.parent == parentId))
        console.log("Parent:", parentId, "Operations:", operations, "FilteredOpers:", opers)

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
                    
                    let msg = String((operation as InputOperationSchema).message)
                    let variableName = String((operation as InputOperationSchema).variable)
                    let val:any = String(await evaluateExpression((operation as OutputOperationSchema).expression))

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

    return {program, project, diagram, currentModuleIndex, execution, handler: {setDiagram: _setDiagram, setProject: _setProject, setCurrentModule: _setCurrentModule, setProgram: _setProgram, getCurrentModule, runProgram, renameOperation, updateOperation: findAndUpdateOperation, saveOperation, getOperation: findOperation, parseExpression, isExpression, getExpressionDefinition}}
}