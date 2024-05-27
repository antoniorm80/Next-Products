"use client";

import {
  CircleUserRound,
  Cloud,
  CreditCard,
  Github,
  ImagePlus,
  Keyboard,
  LifeBuoy,
  LoaderCircle,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { fileToBase64 } from "@/actions/convert-file-to-base64";
import toast from "react-hot-toast";
import { signOutAccount, updateDocument, uploadBase64 } from "@/lib/firebase";
import Image from "next/image";
import { setInLocalStorage } from "@/actions/set-in-localstorage";

export function ProfileDropdown() {
  let user = useUser();
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ===== Choose a profile image =====
  const chooseImage = async (event: any) => {
    const file = event.target.files[0];
    console.log(file);

    setIsLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const imagePath = `${user?.uid}/profile`;

      const imageUrl = await uploadBase64(imagePath, base64);
      await updateDocument(`users/${user?.uid}`, { iamge: imageUrl });

      setImage(imageUrl);

      if(user) {
        user.image = imageUrl;
        setInLocalStorage('user', user);
      }

      toast.success("Se ha subido exitosamente!");
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
   if (user?.image) setImage(user.image);
  }, [user])
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="mr-2">Cuenta</span>
          {image  ? 
                <Image 
                  src={image}
                  width={1000}
                  height={1000}
                  alt="user-img"
                  className="object-cover w-6 h-6 rounded-full m-auto"
                /> : 
                  <CircleUserRound className="m-auto w-6 h-6" />
               }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center p-5">
          {isLoading ? (
            <LoaderCircle className="w-14 h-14 animate-spin m-auto mb-3" />
          ) : (
            <>
              {image  ? 
                <Image 
                  src={image}
                  width={1000}
                  height={1000}
                  alt="user-img"
                  className="object-cover w-20 h-20 rounded-full m-auto"
                /> : 
                  <CircleUserRound className="m-auto w-20 h-20" />
               }
              <div className="flex justify-center relative bottom-2 mb-3">
                <div>
                  <input
                    id="files"
                    type="file"
                    className="hidden"
                    accept="image/png, image/webp, image/jpeg"
                    onChange={(event) => chooseImage(event)}
                  />
                  <label htmlFor="files">
                    <div className="w-[40px] h-[28px] cursor-pointer rounded-lg text-white bg-slate-950 hover:bg-slate-800 flex justify-center items-center">
                      <ImagePlus className="w-[18px] h-[18px]" />
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          <div> {user?.name} </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOutAccount()} >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
