import { ExpressionSchema } from '@/entities/ExpressionSchema';
import useProgram from '@/hooks/useProgram';
import * as React from 'react';
import Dropdown from '../general/dropdown';
import { useIntl } from 'react-intl';
import { Functions } from '@/libs/flowit/Enums';
import TextField from '../general/textfield';
import styles from "@/styles/expression-input.module.css";
import { OperationDefinition, ParameterDefinition } from '@/entities/OperationDefinition';

interface ExpressionBuilderProps {
    variables: string[];
    onChange: (expression: ExpressionSchema|any) => void;
    value?: ExpressionSchema|any;
    removable?: boolean;
    onRemove?: (paramIndex: number) => void;
}

export default function ExpressionBuilder(props: ExpressionBuilderProps) {
    const {variables, onChange, value, onRemove, removable} = props;
    const { handler } = useProgram();
    const intl = useIntl();
    const [exp, setExp] = React.useState<ExpressionSchema|any>(value);
    const [opDefinition, setOpDefinition] = React.useState<OperationDefinition>();

    const operationLabel = React.useMemo(()=> intl.formatMessage({id: `operations.${exp ? (exp as ExpressionSchema).operation : Functions.Value}`}), [exp]);
    const isSingleLine = React.useMemo(()=> !opDefinition || opDefinition.name == Functions.Var, [opDefinition]);
    const varsOptions = React.useMemo(()=> [{key: '', text: 'Select'}].concat(variables.map(v => ({key: v, text: v}))), [variables]);

    React.useEffect(() => {
        if(value){
            setExp(value);
        }
    }, [value]);

    const updateExpression = (_exp: ExpressionSchema|number|string|boolean|any[]) => {
        onChange(_exp);
    }

    const removeParam = (idx: number) => {
        updateExpression({...exp, params: (exp.params as (ExpressionSchema|any)[]).filter((p, i) => i != idx)});
    }

    const updateParamExpression = (_exp: ExpressionSchema|any, idx: number) => {
        const _params = [...(exp.params as (ExpressionSchema|any)[])];
        _params[idx] = _exp;
        updateExpression({...exp, params: _params});
    }

    const addParam = () => {
        updateExpression({...exp, params: [...(exp.params as (ExpressionSchema|any)[]), ""]});
    }

    const onChangeOperation = async (op: string) => {
        const opDef = await handler.getExpressionDefinition(op as Functions);
        if(opDef){
            setOpDefinition(opDef);

            let _params = opDef.parameters?.map(p => ({operation: p.name, params: []})) ?? [];
            if(opDef.parameters && opDef.parameters.length < _params.length){
                _params = _params.slice(0, opDef.parameters?.length);
            }

            updateExpression({operation: op, params: opDef.parameters?.map(p => ({operation: p.name, params: []})) ?? []});
        } else {
            updateExpression("");
        }
    }

    const showParametersBox = ()=>{
        if(opDefinition){
            if(opDefinition.parameters){
                return (<div>{exp.params && (exp.params as (ExpressionSchema|any)[]).map((p, idx)=>(<ExpressionBuilder key={`param-${idx}`} variables={variables} value={p} onChange={(ev)=>updateParamExpression(ev, idx)} />))}</div>)
            } else if(opDefinition.unlimitedParameters){
                return (
                <div>
                    {exp.params && (exp.params as (ExpressionSchema|any)[]).map((p, idx)=>(<ExpressionBuilder removable={idx>1} variables={variables} onRemove={()=>idx>1?(removeParam(idx)):false} key={`param-${idx}`} value={p} onChange={(ev)=>updateParamExpression(ev, idx)} />))}
                    
                    <button className="hover:bg-emerald-100 w-full background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=>addParam()}>
                        <i className="fas fa-plus text-emerald-500"></i> {intl.formatMessage({id: "config.addParam"})}
                    </button>
                </div>)
            }
        } else {
            return (<div></div>)
        }
    }

    return <div className={styles["expression-input"]}>
        <div className={`${styles["expression-input__selector"]} flex`}>
            <Dropdown title={operationLabel} selectedKey={(exp as ExpressionSchema).operation ?? Functions.Value} options={Object.values(Functions).map((o, idx)=>({key: o, text: intl.formatMessage({id: "operations."+o})}))} onChange={(ev, value)=>{onChangeOperation(String(value.key))}} />
            {isSingleLine && (
                (!opDefinition && <TextField title={intl.formatMessage({id: "config.expression"})} value={exp} onChange={(ev, v)=>{updateExpression(v)}} />) ||
                (opDefinition?.name == Functions.Var && <Dropdown selectedKey={exp.operation} options={varsOptions} onChange={(ev, v) => updateParamExpression({operation: Functions.Var, value: v}, 0)} />)
            )}
        </div>        
        {opDefinition?.name == Functions.Var && (
        <div className={styles["expression-input__params"]}>
            {showParametersBox()}
        </div>)}
    </div>;
}