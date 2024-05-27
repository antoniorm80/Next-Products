'use client'

import { useUser } from "@/hooks/use-user";
import { CreateUpdateItem } from "./create-update-item.form";
import { getcollection } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { TableView } from "./table-view";
import { Product } from "@/interfaces/product.interfaces";


const Items = () => {

  const user = useUser();
  const [items, setItems] = useState<Product[]>([]);

  const getItems = async () => {
    const path = `users/${user?.uid}/products`;

    try {
      
      const res = await getcollection(path) as Product[];
      console.log(res);

      setItems(res);

    } catch (error: any) {
      
    }
    
  }

  useEffect(() => {
    if (user) getItems();
  }, [user])
  
 


  return (
    <>
      <div className="flex justify-between items-center m-4 mb-8">
        <h1 className="text-2xl ml-1"> Mis Productos</h1>
         <CreateUpdateItem/>
      </div>

      <TableView items={items}/>
    </>
  );
};

export default Items;
