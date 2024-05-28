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
import { SquarePen, Trash2 } from "lucide-react";
import { CreateUpdateItem } from "./create-update-item.form";
import { ConfirmDeletion } from "./confirm-deletion";

export function TableView({
  items,
  getItems,
}: {
  items: Product[];
  getItems: () => Promise<void>;
}) {
  return (
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
        {items.map((item) => (
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
              <CreateUpdateItem getItems={getItems} itemToUpdate={item}>
                <Button className="text-yellow-500" variant={"ghost"}>
                  <SquarePen />
                </Button>
              </CreateUpdateItem>
              <ConfirmDeletion>
                <Button className="ml-0 text-red-600" variant={"ghost"}>
                  <Trash2 />
                </Button>
              </ConfirmDeletion>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right text-xl" colSpan={4}>
            Total
          </TableCell>
          <TableCell className="text-center text-xl font-bold">
            $11,510.00
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
