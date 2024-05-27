import Logo from "@/components/logo";
import { Metadata } from "next";
import RecoverPasswordFrom from "./components/recover-password.form";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "We will send you an email so you can revoer your password",
};


const ForgotPassword = () => {
    return (
      <>
          {/* Form */}
        <div className = "pt-10 lg:p-8 flex items-center md:h-[70vh]" >
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <RecoverPasswordFrom />
            </div>
        </div>
      </>
    );
}
 
export default ForgotPassword;