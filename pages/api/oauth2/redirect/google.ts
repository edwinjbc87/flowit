import { setCookies } from "cookies-next";
import passport from "@/libs/passport-google-auth";

export default async function GoogleCallback(req, res, next) {    
    passport.authenticate("google", {}, (err, user, info) => {
        try{
            if(err){
                console.log("GoogleCallback",err);
                return res.status(500).send(err);
            }
    
            if (user){            
                setCookies("token", info.token, {req, res});
                setCookies("refreshToken", info.refreshToken, {req, res});            
    
                if(info.registered){
                    res.redirect("/myaccount/dashboard");
                } else {
                    res.redirect("/register");                    
                }
            } else {
                res.redirect("/login-failed");
            }
        }catch(err2){
            console.error("Error en GoogleCallback", err);
        }
    })(req, res, next);
}