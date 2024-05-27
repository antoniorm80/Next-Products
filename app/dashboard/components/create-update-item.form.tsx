"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDocument, uploadBase64 } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ItemImage } from "@/interfaces/item-image.interface";
import DragAndDropImage from "@/components/drag-and-drop-image";
import { useUser } from "@/hooks/use-user";
import { Product } from "@/interfaces/product.interfaces";

export function CreateUpdateItem() {
  const user = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    image: z.object({
      path: z.string(),
      url: z.string()
    }),    
    name: z.string().min(4, {
      message: "Este campo debe contener al menos 4 caractéres",
    }),
    price: z.coerce.number().gte(0, "The minimum value must be 0"),
    soldUnits: z.coerce.number().gte(0, "The minimum value must be 0")
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: {} as ItemImage,
      name: "",
      price: undefined,
      soldUnits: undefined,
    },
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  // ===== Update the image value =====
  const handleImage = (url: string) => {
    let path = `${user?.uid}/${Date.now()}`;
    setValue('image', {url, path});
  }
   
  // ===== Submit: create or update item  =====
  const onSubmit = async (item: z.infer<typeof formSchema>) => {
     console.log(item);
     createItemInDB(item);
    // setIsLoading(true);
    // try {
    //   let res = await createUser(user);
    //   await updateUser({ displayName: user.name });

    //   user.uid = res.user.uid;

    //   await createUserInDB(user as User);
    // } catch (error: any) {
    //   // console.log(error);
    //   toast.error(error.message, { duration: 2500 });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // ===== Create item in Firebase Database =====
  const createItemInDB = async (item: Product) => {
    const path = `users/${user?.uid}/products`;
    setIsLoading(true);

    try {
      
      // ===== Upload image and get url  =====
      const base64 = item.image.url;
      const imagePath = item.image.path;
      const imageUrl = await uploadBase64(imagePath, base64);
      
      item.image.url = imageUrl;

      await addDocument(path, item);

      toast.success("Artículo creado exitosamente!");
      setOpen(false);
      form.reset();

    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Crear
          <CirclePlus className="ml-2 w-[20px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
          <DialogDescription>            
            Administra tus productos con la siguiente información.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            {/* Image */}
            <div className="mb-3">
              <Label htmlFor="image" className="text-1xl font-semibold">
                Imagen
              </Label>             
              <DragAndDropImage handleImage={handleImage}/>
            </div>

            {/* Name */}
            <div className="mb-3">
              <Label htmlFor="name" className="text-1xl font-semibold">
                Nombre del producto
              </Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="Nombre del producto"
                type="text"
                autoComplete="name"
                className="mt-1"
              />
              <p className="form-error">{errors.name?.message}</p>
            </div>

            {/* Price */}
            <div className="mb-3">
              <Label htmlFor="price" className="text-1xl font-semibold">
                Precio
              </Label>
              <Input
                {...register("price")}
                id="price"
                placeholder="0.00"
                type="number"
                step="0.01"                
                className="mt-1"
              />
              <p className="form-error">{errors.price?.message}</p>
            </div>

           {/* SoldUnits */}
           <div className="mb-3">
              <Label htmlFor="soldUnits" className="text-1xl font-semibold">
                Unidades vendidas
              </Label>
              <Input
                {...register("soldUnits")}
                id="soldUnits"
                placeholder="0"
                type="number"
                step="1"                
                className="mt-1"
              />
              <p className="form-error">{errors.soldUnits?.message}</p>
            </div>

            {/* Submit  */}
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="text-1xl">
                {isLoading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
