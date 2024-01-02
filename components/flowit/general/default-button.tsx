export interface DefaultButtonProps {
    text?: string;
    onClick: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export default function DefaultButton(props: DefaultButtonProps) {
    const { text, children, onClick, disabled } = props;
    
    return <button type="button" onClick={()=>onClick()} className="border px-6 py-2.5 border-blue-400 font-medium text-xs leading-tight uppercase rounded shadow-md hover:text-white hover:border-transparent hover:bg-blue-700 hover:shadow-lg focus:text-white focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:text-white active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex justify-between">{children ?? text}</button>
}