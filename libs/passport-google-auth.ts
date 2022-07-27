import { Profile as GoogleProfile, VerifyCallback, Strategy as GoogleStrategy } from "passport-google-oauth20";
import JWT from 'jsonwebtoken';
import passport from "passport";
import User from "@/models/User";
import { Profile } from "entities/Profile";
import dbconnect from '@/libs/dbconnection';

// logic to save your user or check if user exists in your record to proceed.
const getLoginInfo = async (user: GoogleProfile):Promise<any> => {
    try{      
      await dbconnect();
  
      const usr = await User.findOne({email: user._json.email});
      if(usr){        
        const loggedUser = {name: usr.name, email: usr.email, phone: usr.phone};
        let token = await JWT.sign(loggedUser, process.env.JWT_SECRET+'', { expiresIn: "1h" });
        return ({registered: true, token:token+'', user: loggedUser});
      } else {
        throw new Error("User not found");
      }
    }
    catch(err){
      console.log("Mongodb Error", err);
      const googleUser = {name: user.displayName, email: user._json.email+''};
      let token = await JWT.sign(googleUser, process.env.JWT_SECRET+'', { expiresIn: "1h" });
      return ({registered: false, token:token+'', user: googleUser});
    }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/oauth2/redirect/google", // this is the endpoint you registered on google while creating your app. This endpoint would exist on your application for verifying the authentication,           
    },
    async (_accessToken, _refreshToken, profile, done: VerifyCallback) => {
      try {
        const {registered, token, user} = await getLoginInfo(profile);
        
        return done( null, user, { token, refreshToken: _refreshToken, registered });
      } catch (e: any) {
        console.log("Error", e);
        return done(e, undefined, {message: 'Internal error'});
      }
    }
  )
);


// passport.serializeUser stores user object passed in the cb method above in req.session.passport
passport.serializeUser((user, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// passport.deserializeUser stores the user object in req.user
passport.deserializeUser(function (
  user: any,
  cb: (arg0: null, arg1: any) => any
) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// for broader explanation of serializeUser and deserializeUser visit https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

// An article that explains the concept of process.nextTick https://nodejs.dev/learn/understanding-process-nexttick

export default passport;