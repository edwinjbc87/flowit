import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import JWT from "jsonwebtoken";
import { Profile } from "@/entities/Profile";

export const checkLoggedIn:GetServerSideProps = async ({req}) => {
    try{
        const profile = await getProfile(req);
        if(!profile) throw "Not logged in";
        return {
            props: {
                loggedIn: true,
                profile
            }
        }
    }
    catch(ex){
        console.log(ex);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            }
        }
    }
}

export const getProfile = async (req:any):Promise<Profile|null> => {
    try{
        const token = getCookie("token", {req});
        
        if(!token){ throw "No token"; }
        const profile:any = (await JWT.verify(token+'', process.env.JWT_SECRET+''));
        
        return {name: profile.name, email: profile.email, phone: profile.phone} as Profile;
    }
    catch(ex){
        return null;
    }
}