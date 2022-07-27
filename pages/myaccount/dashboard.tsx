import { GetServerSideProps } from 'next'
import {checkLoggedIn} from '@/libs/profile-lib';
import Link from "next/link";

interface IDashboardProps {
    profile: any;
}

const Dashboard = (props:IDashboardProps) => {
    return (<div>
        <h1>Dashboard</h1>
        <pre>{JSON.stringify(props.profile)}</pre>
        
        <Link href='/api/auth/logout' passHref>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log out</button>
        </Link>
    </div>);
}

export default Dashboard;

export const getServerSideProps:GetServerSideProps = (context)=>checkLoggedIn(context);