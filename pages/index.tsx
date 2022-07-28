import PublicLayout from '@/components/layouts/public-layout';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { FormattedMessage, useIntl } from "react-intl"

const Home: NextPage = () => {
  const intl = useIntl();

  return (
    <PublicLayout>
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://nextjs.org">Flow:t!</a>
        </h1>

        <div className={'canvas'}>
          <section className='col-span-4'>

          </section>
          <section className='col-auto'>

          </section>
        </div>

        <p className={styles.description}>
          {intl.formatMessage({id: 'pages.index.subtitle'})}
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
    </PublicLayout>
  );
}

export default Home;
