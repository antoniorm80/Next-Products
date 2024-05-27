"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUser, setDocument, singIn, updateUser } from "@/lib/firebase";
import { useState } from "react";
import { Award, Icon, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interface";

const SingUpForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    uid: z.string(),
    name: z.string().min(4, {
      message: "Este campo debe contener al menos 4 caractéres",
    }),
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
      uid: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // ===== Sign in Firebase Database =====
  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    // console.log(user);
    setIsLoading(true);
    try {
      let res = await createUser(user);
      await updateUser({ displayName: user.name });

      user.uid = res.user.uid;

      await createUserInDB(user as User);

    } catch (error: any) {
      // console.log(error);
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Create user in Firebase Database =====
  const createUserInDB = async (user: User) => {
    const path = `users/${user.uid}`;
    setIsLoading(true);
    try {
      delete user.password;
      await setDocument(path, user);
      toast(`¡Bienvenido!, ${user.name}`, {icon: '👏'})
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold"> Regístrarse</h1>

        <p className="text-sm text-muted-foreground">
          Introduce la inforación siguiente para crear una cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {/* Name */}
          <div className="mb-3">
            <Label htmlFor="name" className="text-1xl font-semibold">
              Nombre
            </Label>
            <Input
              {...register("name")}
              id="name"
              placeholder="Juan Pérez"
              type="text"
              autoComplete="name"
              className="mt-1"
            />
            <p className="form-error">{errors.name?.message}</p>
          </div>

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

          {/* Submit  */}
          <Button type="submit" disabled={isLoading} className="text-1xl">
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Crear
          </Button>
        </div>
      </form>

      {/* Sing Up */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?,{" "}
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Iniciar Sesión
        </Link>
      </p>
    </>
  );
};

export default SingUpForm;
