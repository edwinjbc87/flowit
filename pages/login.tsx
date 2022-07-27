import { GetServerSideProps } from "next";
import Link from "next/link";
import PublicLayout from "@/components/layouts/public-layout";
import { getProfile } from "@/libs/profile-lib";

const LoginPage = () => {
  return (
    <PublicLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem" }}>Iniciar sesión con Google</h1>
        <Link href="/api/auth/login" passHref>
          <button
            style={{
              border: "1px solid black",
              backgroundColor: "white",
              borderRadius: "10px",
              height: "50px",
              width: "200px",
              cursor: "pointer",
            }}
          >
            Proceed
          </button>
        </Link>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;

export const getServerSideProps:GetServerSideProps = async ({req, res}) => {
  try{
    const profile = await getProfile(req); 
    if(profile){
      return {redirect: {destination: '/myaccount/dashboard', permanent: true}};
    }
    throw "No profile";
  }catch{
      return {props: {}};
  }
}


