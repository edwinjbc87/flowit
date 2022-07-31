
import { BaseOperationSchema } from "@/entities/BaseOperationSchema";
import useProgram from "@/hooks/useProgram";
import { BsPlay } from "react-icons/bs";
import { FormattedMessage, useIntl } from "react-intl"
import { ProgramSchema } from "@/entities/ProgramSchema";
import { useEffect, useState } from "react";
const programSchema = require("@/data/program") as ProgramSchema;
import styles from "@/styles/program-execution.module.css";

export default function ProgramExecution(){
    const intl = useIntl();
    const {project, execution, handler} = useProgram();
    const [program, setProgram] = useState<ProgramSchema>();

    const loadProgram = async () => {
        setProgram(programSchema as ProgramSchema);
    }

    const runProgram = async () => {
        await handler.runProgram();
    }

    useEffect(() => {
        loadProgram().catch(er => console.error(er));
    }, [])

    return (
        <aside className="divide-y h-full">
            <section className="pb-1">
                <button className={`inline-block px-6 pt-2.5 pb-2 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex disabled:opacity-50`} disabled={execution.isRunning} onClick={()=>runProgram()}><BsPlay size={16} /> {execution.isRunning ? intl.formatMessage({id: "playground.running"}) : intl.formatMessage({id: "playground.run"})}</button>
            </section>
            <section className={`grid grid-rows grid-rows-2 ${styles['execution-panel__main']}`}>
                <section className="">
                    <table className="table min-w-full">
                        <thead className="border-b">
                            <tr>
                                <th scope="col" className="text-sm font-medium text-gray-900 px-3 py-4 text-left w-1/3">Variable</th>
                                <th scope="col" className="text-sm font-medium text-gray-900 px-3 py-4 text-left w-2/3">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="overflow-y-scroll">
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className={`overflow-y-scroll bg-black dark:text-white p-2 ${styles.console}`}>
                    <pre>Prueba</pre>
                </section>
            </section>
        </aside>
    );
}