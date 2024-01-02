
import useProgram from "@/hooks/useProgram";
import { BsEraser, BsPlay, BsStop } from "react-icons/bs";
import { useIntl } from "react-intl"
import styles from "@/styles/program-execution.module.css";
import PrimaryButton from "./general/primary-button";
import DefaultButton from "./general/default-button";

export default function ProgramExecution(){
    const intl = useIntl();
    const {execution, handler} = useProgram();


    const runProgram = async () => await handler.runProgram();
    const pauseProgram = async () => await handler.pauseProgram();
    const resumeProgram = async () => await handler.resumeProgram();
    const resetProgram = async () => await handler.resetProgram();

    return (
        <aside className="divide-y h-full">
            <section className="pb-1 flex">
                {!execution.isRunning && <PrimaryButton onClick={()=>runProgram()}>
                    <BsPlay size={16} /> {intl.formatMessage({id: "playground.run"})}
                </PrimaryButton>}
                {execution.isRunning && <PrimaryButton onClick={()=>runProgram()}>
                    <BsStop size={16} /> {intl.formatMessage({id: "playground.stop"})}
                </PrimaryButton>}
                <DefaultButton onClick={()=>resetProgram()}>
                    <BsEraser size={16} /> {intl.formatMessage({id: "playground.reset"})}
                </DefaultButton>
            </section>
            <section className={`grid grid-rows grid-rows-2 ${styles['execution-panel__main']}`}>
                <section className="">
                    <table className="table min-w-full">
                        <thead className="border-b">
                            <tr>
                                <th scope="col" className="text-sm font-medium text-gray-900 px-3 py-4 text-left w-1/3">{intl.formatMessage({id: "playground.variable"})}</th>
                                <th scope="col" className="text-sm font-medium text-gray-900 px-3 py-4 text-left w-2/3">{intl.formatMessage({id: "playground.value"})}</th>
                            </tr>
                        </thead>
                        <tbody className="overflow-y-scroll">
                            {Object.keys(execution.variables).map(key => (
                                <tr key={key} className="border-b">
                                    <td className="px-3 py-4 text-sm font-medium text-gray-900 text-left">{key}</td>
                                    <td className="px-3 py-4 text-sm font-medium text-gray-900 text-left">{execution.variables[key]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section className={`overflow-y-scroll bg-black dark:text-white p-2 ${styles.console}`}>
                    {execution.output.map((line, index) => (<pre key={`o-${index}`}>{line}</pre>))}
                    <pre></pre>
                </section>
            </section>
        </aside>
    );
}