import { ApiResponse } from "@/entities/ApiResponse";
import { Profile } from "@/entities/Profile";

export default function useAuth(){
    const registerUser = async (user:any) => {
        try{
            const registeredUserResponse:ApiResponse<Profile> = await fetch(`${process.env.API_URL}/auth/register`, {headers: {'Content-Type': 'application/json'},body: JSON.stringify(user), method: 'POST'}).then(r=>r.json());
            //if(registeredUserResponse.success){
                return registeredUserResponse;
            //}
        }catch(ex){
            return {success: false, message: 'Network Error'} as ApiResponse<Profile>;
        }
    }

    return {registerUser};
}