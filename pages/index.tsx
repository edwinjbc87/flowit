import PublicLayout from '@/components/layouts/public-layout';
import type { NextPage } from 'next'
import { FormattedMessage, useIntl } from "react-intl"
import ProgramDiagram from '@/components/flowit/program-diagram';
import ProgramExecution from '@/components/flowit/program-execution';
import { ProgramSchema } from '@/entities/ProgramSchema';
import useProgram from '@/hooks/useProgram';
import { useEffect } from 'react';

const Home: NextPage = () => {  
  const intl = useIntl();
  const {handler} = useProgram()

  const loadProgram = async () => {
    let program = {} as ProgramSchema;
    let lang = intl.formatMessage({id: "lang"});
    if(lang == "es") program = require(`@/data/defaultProgram.es`) as ProgramSchema;
    else program = require(`@/data/defaultProgram.en`) as ProgramSchema;
    await handler.setProgram(program);
}

  useEffect(() => {
      loadProgram().catch(er => console.error(er));
  }, [])

  return (
    <PublicLayout>
      <div className={'canvas grid grid-cols-4 w-full divide divide-x'}>
        <section className='col-span-3 p-1'>
          <ProgramDiagram />
        </section>
        <section className='p-1'>
          <ProgramExecution />
        </section>
      </div>
    </PublicLayout>
  );
}

export default Home;
