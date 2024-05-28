'use client'

import { useUser } from "@/hooks/use-user";
import { CreateUpdateItem } from "./create-update-item.form";
import { getcollection } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { TableView } from "./table-view";
import { Product } from "@/interfaces/product.interfaces";
import { Button } from "@/components/ui/button";
import { CirclePlus } from 'lucide-react';
import { orderBy, query } from "firebase/firestore";


const Items = () => {

  const user = useUser();
  const [items, setItems] = useState<Product[]>([]);

  const getItems = async () => {

    const path = `users/${user?.uid}/products`;
    const query = [
      orderBy('createdAt', 'desc')
    ]

    try {
      
      const res = await getcollection(path, query) as Product[];
      console.log(res);

      setItems(res);

    } catch (error: any) {
      
    }
    
  }

   // ===== Delete item from Firebase Database =====
  //  const deleteItemInDB = async (item: Product) => {
  //   const path = `users/${user?.uid}/products/${item.id}`;
  //   setIsLoading(true);

  //   try {
      
     

  //     await updateDocument(path, item);

  //     toast.success("Producto actualizado exitosamente!");
  //     getItems();
  //     setOpen(false);
  //     form.reset();

  //   } catch (error: any) {
  //     toast.error(error.message, { duration: 2500 });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  
  useEffect(() => {
    if (user) getItems();
  }, [user])
  
 


  return (
    <>
      <div className="flex justify-between items-center m-4 mb-8">
        <h1 className="text-2xl ml-1"> Mis Productos</h1>
         <CreateUpdateItem getItems={getItems}>
          <Button variant="outline">
            Crear
            <CirclePlus className="ml-2 w-[20px]" />
          </Button>
         </CreateUpdateItem>
      </div>

      <TableView getItems={getItems} items={items}/>
    </>
  );
};

export default Items;
