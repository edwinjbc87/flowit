import {Profile} from '@/entities/Profile';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

export interface IPublicUserBox{
    user?: Profile;    
}

export default function PublicUserBox(props:IPublicUserBox&HTMLAttributes<HTMLDivElement>){
    return (
        <div>
            {props.user ? 
                (<div>
                    <strong>{props.user.name}</strong>
                </div>)
                :
                (<div>
                    <Link href='/login' passHref>Iniciar Sesión</Link>
                </div>)
            }
        </div>
    );
}