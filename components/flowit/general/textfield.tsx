import * as React from 'react';

export interface TextFieldProps {
    label?: string;
    title?: string;
    value: string;
    onChange: (ev:React.ChangeEvent<HTMLInputElement>, value: string) => void;
}


export default function TextField(props: TextFieldProps) {
    const {title, label, value, onChange} = props;

    return <>
        {label && <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
        <input type="text" title={title} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={value} onChange={(ev)=>onChange(ev, ev.currentTarget.value)} />
    </>
}