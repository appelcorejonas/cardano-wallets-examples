import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import WalletAction from '../components/WalletAction'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Cardano connector!
        </h1>
        <span id="walletStatus"></span>
        <span id="walletAddress"></span>
        <span id="walletBalance"></span>
        <WalletAction />
        <span id="delagateStatus"></span>
        <span id="delagateTransactionId"></span>
        
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}

export default Home
