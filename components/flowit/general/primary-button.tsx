export interface PrimaryButtonProps {
    text?: string;
    onClick: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export default function PrimaryButton(props: PrimaryButtonProps) {
    const { text, onClick, disabled, children } = props;
    
    return <button type="button" disabled={disabled} onClick={()=>onClick()} className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-1 flex justify-between">{children ?? text}</button>;
}