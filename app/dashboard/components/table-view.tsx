import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/interfaces/product.interfaces";
import Image from "next/image";
import { formatPrice } from "../../../actions/format-price";
import { Button } from "@/components/ui/button";
import { LayoutList, SquarePen, Trash2 } from "lucide-react";
import { CreateUpdateItem } from "./create-update-item.form";
import { ConfirmDeletion } from "./confirm-deletion";
import { Skeleton } from "@/components/ui/skeleton";

interface TableViewProps {
  items: Product[];
  getItems: () => Promise<void>;
  deleteItemInDB: (item: Product) => Promise<void>;
  isLoading: boolean;
  getProfits: () => number;
}

export function TableView({
  items,
  getItems,
  deleteItemInDB,
  isLoading,
  getProfits,
}: TableViewProps) {
  return (
    <div className="hidden md:block">
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow className="text-base">
            <TableHead className="w-[100px]">Imagen</TableHead>
            <TableHead>Nombre del producto</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="text-center">Unidades vendidas</TableHead>
            <TableHead className="text-center">Ganancias</TableHead>
            <TableHead className="text-center w-[250px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            items &&
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image
                    src={item.image.url}
                    width={1000}
                    height={1000}
                    alt={item.name}
                    className="object-cover w-10 h-10"
                  />
                </TableCell>
                <TableCell className="w-[550px]">{item.name}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell className="text-center">{item.soldUnits}</TableCell>
                <TableCell className="text-center font-semibold">
                  {formatPrice(item.soldUnits * item.price)}
                </TableCell>
                <TableCell className="text-center">
                  {/* ===== Update ===== */}
                  <CreateUpdateItem getItems={getItems} itemToUpdate={item}>
                    <Button className="text-yellow-500" variant={"ghost"}>
                      <SquarePen />
                    </Button>
                  </CreateUpdateItem>
                  {/* ===== Delete ===== */}
                  <ConfirmDeletion deleteItemInDB={deleteItemInDB} item={item}>
                    <Button className="ml-0 text-red-600" variant={"ghost"}>
                      <Trash2 />
                    </Button>
                  </ConfirmDeletion>
                </TableCell>
              </TableRow>
            ))}
          {/* ===== Skeleton ===== */}
          {isLoading &&
            [1, 1, 1, 1, 1].map((e, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="w-16 h-16 rounded-xl" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-4" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        {/* ==== Footer Table ========== */}
        {!isLoading && items.length !== 0 && (
          <TableFooter>
            <TableRow>
              <TableCell className="text-right text-xl" colSpan={4}>
                Total
              </TableCell>
              <TableCell className="text-center text-xl font-bold">
                {formatPrice(getProfits())}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {/* ===== Template - No Hay Productos */}
      {!isLoading && items.length === 0 && (
        <div className="text-gray-200 my-20">
          <div className="flex justify-center">
            <LayoutList className="w-[120px] h-[120px]" />
          </div>
          <h2 className="text-center"> No hay productos disponibles</h2>
        </div>
      )}
    </div>
  );
}
