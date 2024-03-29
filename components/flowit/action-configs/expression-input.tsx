import { ExpressionSchema, ExpressionValue, ValueType } from "@/entities/ExpressionSchema";
import useProgram from "@/hooks/useProgram";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Functions } from "@/libs/flowit/Enums";
import { useIntl } from "react-intl";
import { OperationDefinition, ParameterDefinition } from "@/entities/OperationDefinition";
import styles from "@/styles/expression-input.module.css";

const ExpressionInput = forwardRef(function ExpressionInputBase({expression, title, removable, valueType, onChange, onRemove}:{expression:ExpressionSchema|any, title?: string, removable?:boolean, valueType:ValueType, onChange:(expression:ExpressionSchema|ExpressionValue)=>void, onRemove?: ()=>void}, ref){
    const {handler, currentModuleIndex, program} = useProgram();
    const [exp, setExp] = useState(expression);
    const [expDefinition, setExpDefinition] = useState<OperationDefinition|null>({} as OperationDefinition);
    const [parameters, setParameters] = useState<(ExpressionSchema|ExpressionValue)[]>([]);
    const paramsRefs = useRef<any[]>([]);
    const intl = useIntl();

    useImperativeHandle(ref, () => ({
        getExpression: () => {
            if(handler.isExpression(exp)){
                const _params = paramsRefs.current.map(_ref => _ref.current.getExpression())
                
                return {...exp, params: _params};
            } else {
                return exp;
            }
        },
    }));
    
    const updateExpression = async (newValue:ExpressionSchema|any)=>{
        try{
            if(handler.isExpression(newValue)){
                setExp(newValue)
                onChange(newValue)
            } else {
                setExp(castValueFromString(newValue, valueType??ValueType.String))
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
                return val
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

    const addParam = ()=>{
        const _params = [...expression.params] as (ExpressionSchema|any)[]
        const paramType = expDefinition?.unlimitedParameters?.type
        _params.push(paramType?getDefaultValue(paramType): "");
        
        const newExpression = {...expression, params: _params}
        setParameters(_params)
        updateExpression(newExpression)
    }

    const removeParam = (idx:number)=>{
        const _params = [...expression.params] as (ExpressionSchema|any)[]
        _params.splice(idx, 1)

        const newExpression = {...expression, params: _params}
        setParameters(_params)
        updateExpression(newExpression)
    }

    const loadDefinition = async ()=>{
        setExp(expression)
        setParameters(expression?.params)
        setExpDefinition(handler.isExpression(expression)? await handler.getExpressionDefinition(expression.operation as Functions) : null)
    }

    useEffect(() => {
        loadDefinition().catch(err=>console.error("Error loading expression definition", err))
    }, [])

    const changeOperation = async (operation:Functions)=>{
        let newExp = handler.isExpression(exp)? {...exp} : exp;
        if(operation && operation !== Functions.Value){
            const def = await handler.getExpressionDefinition(operation)
            
            const _params:(ExpressionSchema|ExpressionValue)[] = []; 

            if(def?.parameters){
                if(parameters && parameters.length>0){
                    _params.push(...parameters)
                    for(let i=_params.length-1; i>=def.parameters.length; i--){
                        _params.pop()
                        paramsRefs.current.pop()
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

    //const debouncedUpdateExpression = useMemo(()=>debounce(updateExpression, 500), [])


    const showParametersBox = ()=>{
        if(expDefinition){
            if(expDefinition.parameters){
                return (<div>{parameters && (parameters as (ExpressionSchema|any)[]).map((p, idx)=>(<ExpressionInput  ref={paramsRefs.current[idx]} valueType={p.type?p.type:ValueType.Any} key={`param-${idx}`} expression={p} title={((expDefinition.parameters?expDefinition.parameters[idx]:{}) as ParameterDefinition).name} onChange={(ev)=>updateParamExpression(ev, idx)} />))}</div>)
            } else if(expDefinition.unlimitedParameters){
                return (
                <div>
                    {parameters && (parameters as (ExpressionSchema|any)[]).map((p, idx)=>(<ExpressionInput ref={paramsRefs.current[idx]} removable={idx>1} onRemove={()=>idx>1?removeParam(idx):false} valueType={expDefinition.unlimitedParameters?.type??ValueType.Any}  key={`param-${idx}`} expression={p} title={String(expDefinition.unlimitedParameters?.name)} onChange={(ev)=>updateParamExpression(ev, idx)} />))}
                    
                    <button className="hover:bg-emerald-100 w-full background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=>addParam()}>
                        <i className="fas fa-plus text-emerald-500"></i> {intl.formatMessage({id: "config.addParam"})}
                    </button>
                </div>)
            }
        } else {
            return (<div></div>)
        }
    }

    return (
        <div className={styles["expression-input"]}>
            <div className={`${styles["expression-input__selector"]} flex`}>
                <select title={intl.formatMessage({id: "operations."+(handler.isExpression(expression)?expression.operation:Functions.Value)})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={handler.isExpression(expression)?expression.operation:Functions.Value} onChange={(ev)=>{changeOperation(ev.currentTarget.value as Functions)}}>
                    {Object.values(Functions).map((f, idx)=>(<option key={`func-${f}`} value={f}>{intl.formatMessage({id: "operations."+f})}</option>))}
                </select>
                {!expression?.operation && <input type="text" title={intl.formatMessage({id: "operations.value"})} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={exp} onChange={(ev)=>updateExpression(ev.currentTarget.value)} />}
                {removable && <button title={intl.formatMessage({id: "config.removeParam"})} className="hover:bg-red-100 w-32 background-transparent font-bold uppercase text-center py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150" onClick={onRemove}><i className="fas fa-remove text-red-500"></i></button>}
            </div>
            <div className={styles["expression-input__params"]}>
                {showParametersBox()}
            </div>
        </div>
    )
})

export default ExpressionInput