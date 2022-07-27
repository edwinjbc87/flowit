import passport from "@/libs/passport-google-auth";
import nextConnect from "next-connect";
import { removeCookies } from 'cookies-next'


export default async function Logout(req, res, next) {
    //passport.(req, res, next);
    removeCookies("token", {req, res});
    removeCookies("refreshToken", {req, res});
    res.redirect("/");
}