import PublicLayout from '@/components/layouts/public-layout';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { FormattedMessage, useIntl } from "react-intl"
import ActionsList from '@/components/flowit/actions-list';
import ProgramDiagram from '@/components/flowit/program-diagram';
import ProgramExecution from '@/components/flowit/program-execution';


const Home: NextPage = () => {
  const intl = useIntl();

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
