import { ExpressionSchema, ExpressionValue, ValueType } from "@/entities/ExpressionSchema";
import useProgram from "@/hooks/useProgram";
import { useEffect, useState } from "react";
import { Functions } from "@/libs/flowit/Functions";
import { useIntl } from "react-intl";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import styles from "@/styles/expression-input.module.css";

export default function ExpressionInput({expression, title, valueType, onChange}:{expression:ExpressionSchema|any, title?: string, valueType:ValueType, onChange:(expression:ExpressionSchema|ExpressionValue)=>void}) {
    const {handler, currentModuleIndex, program} = useProgram();
    const [expDefinition, setExpDefinition] = useState<OperationDefinition|null>({} as OperationDefinition);
    const [parameters, setParameters] = useState<(ExpressionSchema|ExpressionValue)[]>([]);
    const intl = useIntl();
    
    const updateExpression = async (newValue:ExpressionSchema|any)=>{
        try{
            if(handler.isExpression(newValue)){
                onChange(newValue)
            } else {
                onChange(castValueFromString(newValue, valueType??ValueType.String))
            }
        }catch(err){
            console.error("Error parsing expression", err)
        }
    }

    const getDefaultValue = (type:ValueType):any=>{
        switch(type){
            case ValueType.String: {
                return ""
                break
            }
            case ValueType.Number: {
                return 0.0
                break
            }
            case ValueType.Integer: {
                return 0
                break
            }
            case ValueType.Boolean: {
                return true
                break
            }
            case ValueType.Array: {
                return []
                break
            }
            default: {
                return ""
            }
        }
    }

    const castValueFromString = (val:string, type:ValueType):any => {
        console.log("casting value", val, type)
        switch(type){
            case ValueType.String: {
                return String(val)
                break
            }
            case ValueType.Number: {
                return !isNaN(parseFloat(val)) ? parseFloat(val) : 0.0;
                break
            }
            case ValueType.Integer: {
                return !isNaN(parseInt(val)) ? parseInt(val) : 0;
                break
            }
            case ValueType.Boolean: {
                return !!val
                break
            }
            case ValueType.Array: {
                try{
                    const vAr = JSON.parse(val)
                    if(Array.isArray(vAr)){
                        return vAr
                    } else {
                        return []
                    }
                }catch{
                    return []
                }
                break
            }
            default: {
                return ""
            }
        }
    }

    const updateParamExpression = async (newValue:ExpressionSchema|any, index:number)=>{
        try{
            const _params = [...expression.params]
            _params[index] = newValue
            const newExpression = {...expression, params: _params}
            setParameters(_params)
            updateExpression(newExpression)
        }catch(err){
            console.error("Error parsing expression", err)
        }
    }

    const getParam = (index:number)=>{
        return (expression.params.length>index)? expression.params[index] : null
    }

    const addParam = ()=>{
        const _params = [...expression.params] as (ExpressionSchema|any)[]
        const paramType = expDefinition?.unlimitedParameters?.type
        _params.push(paramType?getDefaultValue(paramType): "");
        
        const newExpression = {...expression, params: _params}
        setParameters(_params)
        updateExpression(newExpression)
    }

    const loadDefinition = async ()=>{
        setParameters(expression?.params)
        setExpDefinition(handler.isExpression(expression)? await handler.getExpressionDefinition(expression.operation as Functions) : null)
    }

    useEffect(() => {
        loadDefinition().catch(err=>console.error("Error loading expression definition", err))
    }, [expression])

    const showParametersBox = ()=>{
        if(expDefinition){
            if(expDefinition.parameters){
                return (<div>{parameters && (parameters as (ExpressionSchema|any)[]).map((p, idx)=>(<ExpressionInput valueType={p.type?p.type:ValueType.Any} key={`param-${idx}`} expression={p} title={((expDefinition.parameters?expDefinition.parameters[idx]:{}) as ParameterDefinition).name} onChange={(ev)=>updateParamExpression(ev, idx)} />))}</div>)
            } else if(expDefinition.unlimitedParameters){
                return (
                <div>
                    {parameters && (parameters as (ExpressionSchema|any)[]).map((p, idx)=>(<ExpressionInput valueType={expDefinition.unlimitedParameters?.type??ValueType.Any}  key={`param-${idx}`} expression={p} title={String(expDefinition.unlimitedParameters?.name)} onChange={(ev)=>updateParamExpression(ev, idx)} />))}
                    <button className="btn btn-primary" onClick={addParam}>{intl.formatMessage({id: "config.addParam"})}</button>
                </div>)
            }
        } else {
            return (<div></div>)
        }
    }

    const changeOperation = async (operation:Functions)=>{
        let newExp = handler.isExpression(expression)? {...expression} : expression;
        if(operation && operation !== Functions.Value){
            const def = await handler.getExpressionDefinition(operation)
            console.log(def)
            const _params:(ExpressionSchema|ExpressionValue)[] = []; 

            if(def?.parameters){
                if(parameters && parameters.length>0){
                    _params.push(...parameters)
                    for(let i=_params.length-1; i>=def.parameters.length; i++){
                        _params.pop()
                    }
                } else {
                    for(let i=0; i<def.parameters.length; i++){
                        _params.push(getDefaultValue(def.parameters[i].type))
                    }
                }
                
            } else if(def?.unlimitedParameters) {
                for(let i=0; i< 2; i++){
                    _params.push(getDefaultValue(def.unlimitedParameters.type))
                }
            }
            setParameters(_params)
            setExpDefinition(def)

            //newExp = {...newExp, operation, params: _params}
            onChange({...newExp, operation, params: _params})
        } else {
            setParameters([])
            setExpDefinition(null)
            onChange("")
        }
    }

    return (
        <div className={styles["expression-input"]}>
            <div className={`${styles["expression-input__selector"]} flex`}>
                <select title={intl.formatMessage({id: "config.expression"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={expression?expression.operation:Functions.Value} onChange={(ev)=>{changeOperation(ev.currentTarget.value as Functions)}}>
                    {Object.values(Functions).map((f, idx)=>(<option key={`func-${f}`} value={f}>{intl.formatMessage({id: "operations."+f})}</option>))}
                </select>
                {!expression?.operation && <input type="text" title={intl.formatMessage({id: "operations.value"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={expression} onChange={(ev)=>updateExpression(ev.currentTarget.value)} />}
            </div>
            <div className={styles["expression-input__params"]}>
                {showParametersBox()}
            </div>
        </div>
    )
}