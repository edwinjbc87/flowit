import User from "@/models/User";
import dbconnect from '@/libs/dbconnection';
import { ApiResponse } from "@/entities/ApiResponse";
import { Profile } from "@/entities/Profile";

export default async function Register(req, res, next){
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    try{
        await dbconnect();

        const user = await User.findOne({email: req.body.email});
        
        if(!user){
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
            });
            await newUser.save();

            res.status(200).send({success: true, value: {name: newUser.name, email: newUser.email, phone: newUser.phoe}} as ApiResponse<Profile>);
        } else {
            throw 'User already exists';
        }
    }catch(err){
        console.log(err);
        res.status(400).send({success: false, message: err+''} as ApiResponse<Profile>);
    }
}