import { auth, getDocument } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user.interface";
import { DocumentData } from "firebase/firestore";
import { setInLocalStorage } from "@/actions/set-in-localstorage";
import { getFromLocalStorage } from "@/actions/get-from-localstorage";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useUser = () => {
  const [user, setUser] = useState<User | undefined | DocumentData>(undefined);

  const pathName = usePathname();
  const router = useRouter();

  const protectedRoutes = ["/dashboard"];
  const isInProtectedRoute = protectedRoutes.includes(pathName);

  const getUserFromDB = async (uid: string) => {
    const path = `users/${uid}`;

    try {
      let res = await getDocument(path);
      setUser(res);

      setInLocalStorage("user", res);
    } catch (error: any) {
        toast.error(error.message, { duration: 2500 });
    }
  };

  useEffect(() => {
    return onAuthStateChanged(auth, async (authUser) => {
      //   ===== Exist auth user =====
      if (authUser) {
        const userInLocal = getFromLocalStorage('user');

        if (userInLocal) {
          setUser(userInLocal);
        } else {
          getUserFromDB(authUser.uid);
        }
      }
      //   ===== Doesn't exist auth user =====
      else {
        if (isInProtectedRoute) router.push("/");
      }
    });
  }, []);

  return user;
};
