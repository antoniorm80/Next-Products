"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendResetEmail } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RecoverPasswordFrom = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const formSchema = z.object({
    email: z
      .string()
      .email("El correo electrónico es inválido. Por ejemplo; user@mail.com")
      .min(6, {
        message: "Este campo es requerido",
      })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""    
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  //   Sing in

  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    // console.log(user);
    setIsLoading(true);
    try {
  
      await sendResetEmail(user.email);
      toast.success("¡Correo electrónico enviado exitosamente!");
      router.push("/");


    } catch (error: any) {
      // console.log(error);
      toast.error(error.message, { duration: 2500});
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[530px] md:border border-solid border-gray-300 rounded p-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold"> Recuperar Contraseña</h1>

        <p className="text-sm text-muted-foreground">          
          Te enviarémos un correo electrónico para recuperar tu contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2 mt-5">
          {/* Email */}
          <div className="mb-3">
            <Label htmlFor="email" className="text-1xl font-semibold">
              Correo electrónico
            </Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              className="mt-1"
            />
            <p className="form-error">{errors.email?.message}</p>
          </div>
         

          {/* Submit  */}
          <Button type="submit" disabled={isLoading}         
          className="text-1xl"> 
           { isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
          )}
          Recuperar contraseña</Button>
        </div>
      </form>

      {/* Sing Up */}
      <p className="text-center text-sm text-muted-foreground mt-3">        
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          {"<- Ir Atrás"}
        </Link>
      </p>
    </div>
  );
};

export default RecoverPasswordFrom;
