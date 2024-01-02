import * as React from 'react';

export interface IDropdownOption {
    key: string | number;
    text: string;
}

export interface DropdownProps {
    label?: string;
    title?: string;
    selectedKey: string | number;
    options: IDropdownOption[];
    onChange: (ev:React.ChangeEvent<HTMLSelectElement>, value: IDropdownOption) => void;
}


export default function Dropdown(props: DropdownProps) {
    const {title, label, selectedKey, options, onChange} = props;
    const inpPrefix = React.useId();

    return <>
        {label && <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
        <select title={title} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={selectedKey} onChange={(ev)=>onChange(ev, options.find(v => String(v.key) == String(ev.currentTarget.value)) as IDropdownOption)}>
            {options.map((v, i) => <option key={`${inpPrefix}-${v.key}`} value={v.key}>{v.text}</option>)}
        </select>
    </>;
}