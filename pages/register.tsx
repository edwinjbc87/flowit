import PublicLayout from '@/components/layouts/public-layout';
import { getProfile } from '@/libs/profile-lib';
import { GetServerSideProps } from 'next';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useAuth from "@/hooks/useAuth";
import { ApiResponse } from '@/entities/ApiResponse';
import { Profile } from '@/entities/Profile';
import Router from 'next/router'

export default function Register(props: any) {
  const methods = useForm({mode: 'onTouched'});
  const { register, handleSubmit, formState: { errors } } = methods;
  const {registerUser} = useAuth();
  const onSubmit = async data => {    
    console.log("Registrar",data);
    const resp:ApiResponse<Profile> = await registerUser(data);
    console.log("Registrado", resp);
    if(resp.success){
      Router.push('/myaccount/dashboard');
    } else {
      console.log("Error", resp.message);
      alert(resp.message);
    }
  }
  
  
  return (
    <PublicLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" value={props.profile.email} placeholder="Email" {...register("email", {required: 'write an e-mail', pattern: /^\S+@\S+$/i})} /><br />
          <input type="password" placeholder="Password" {...register("password", {required: 'Write password'})} /><br />
          <hr />
          <input type="text" value={props.profile.name} placeholder="Nombre" {...register("name", {required: 'Write the name', maxLength: 100})} /><br />
          <input type="tel" placeholder="Teléfono" {...register("phone", {minLength: 6, maxLength: 12})} /><br />

          <input type="submit" value='Guardar' />
        </form>
      </FormProvider>
    </PublicLayout>
  );
}


export const getServerSideProps:GetServerSideProps = async (context)=>{
  try{
    const profile = await getProfile(context.req);
    if(!profile){ throw new Error("No profile"); }
    console.log("Profile", profile);
    
    return {props: {profile}};
  }catch{
    return {props: {profile: {}}};
  }
};
