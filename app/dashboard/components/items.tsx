'use client'

import { useUser } from "@/hooks/use-user";
import { CreateUpdateItem } from "./create-update-item.form";
import { deleteDocument, getcollection } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { TableView } from "./table-view";
import { Product } from "@/interfaces/product.interfaces";
import { Button } from "@/components/ui/button";
import { CirclePlus } from 'lucide-react';
import { orderBy, query } from "firebase/firestore";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/actions/format-price";
import ListView from "./List-view";


const Items = () => {

  const user = useUser();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getItems = async () => {

    const path = `users/${user?.uid}/products`;
    const query = [
      orderBy('createdAt', 'desc')
    ]

    setIsLoading(true);
    try {
      
      const res = await getcollection(path, query) as Product[];
      console.log(res);

      setItems(res);

    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
    
  }

   // ===== Delete item from Firebase Database =====
   const deleteItemInDB = async (item: Product) => {

    const path = `users/${user?.uid}/products/${item.id}`;
    setIsLoading(true);
    try {
          
      await deleteDocument(path);

      toast.error("Producto eliminado correctamente!");

      const newItems = items.filter(i => i.id !== item.id);
      setItems(newItems);

    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getProfits = () => {
    return  items.reduce((index, item) => index + item.price * item.soldUnits, 0);
  };

  useEffect(() => {
    if (user) getItems();
  }, [user]);

  return (
    <>
      <div className="flex justify-between items-center m-4 mb-8">
        <div>
          <h1 className="text-2xl ml-1"> Mis Productos</h1>
          {items.length > 0 && (
            <Badge className="mt-2 text-[14px]" variant={"outline"}>
              Ganancias: {formatPrice(getProfits())}
            </Badge>
          )}
        </div>

        <CreateUpdateItem getItems={getItems}>
          <Button variant="outline">
            Crear
            <CirclePlus className="ml-2 w-[20px]" />
          </Button>
        </CreateUpdateItem>
      </div>

      <TableView
        getItems={getItems}
        deleteItemInDB={deleteItemInDB}
        items={items}
        isLoading={isLoading}
        getProfits={getProfits}
      />

      <ListView
        getItems={getItems}
        deleteItemInDB={deleteItemInDB}
        items={items}
        isLoading={isLoading}
        getProfits={getProfits}
      />
    </>
  );
};

export default Items;
