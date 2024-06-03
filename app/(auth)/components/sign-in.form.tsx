"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { singIn } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const SingInForm = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    email: z
      .string()
      .email("El correo electrónico es inválido. Por ejemplo; user@mail.com")
      .min(6, {
        message: "Este campo es requerido",
      }),
    password: z.string().min(6, {
      message: "La contraseña debe contener al menos 6 caractéres",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  //   Sing in

  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    // console.log(user);
    setIsLoading(true);
    try {
      let res = await singIn(user);
      // console.log(res);

    } catch (error: any) {
      // console.log(error);
      toast.error(error.message, { duration: 2500});
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold"> Iniciar Sesión</h1>

        <p className="text-sm text-muted-foreground">          
          Introduce tu correo electrónico y contraseña para accesar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
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
          {/* Password */}
          <div className="mb-3">
            <Label htmlFor="password" className="text-1xl font-semibold">
              Contraseña
            </Label>
            <Input
              {...register("password")}
              id="password"
              placeholder="******"
              type="password"
              className="mt-1"
            />
            <p className="form-error">{errors.password?.message}</p>
          </div>

          <Link
            href="/forgot-password"
            className="underline text-muted-foreground underline-offset-4 hover:text-primary mb-6 text-sm text-end"
          >
            ¿ Olvidé mi contraseña ?
          </Link>

          {/* Submit  */}
          <Button type="submit" disabled={isLoading}         
          className="text-1xl"> 
           { isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
          )}
          Accesar</Button>
        </div>
      </form>

      {/* Sing Up */}
      <p className="text-center text-sm text-muted-foreground">
        {"¿No tiene una cuenta? "}
        <Link
          href="/sign-up"
          className="underline underline-offset-4 hover:text-primary"
        >
          Regístrate !
        </Link>
      </p>
    </>
  );
};

export default SingInForm;
