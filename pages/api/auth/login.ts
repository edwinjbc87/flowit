import passport from "@/libs/passport-google-auth";

export default async function Login(req, res, next) {
  console.log("Authenticate");
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
}