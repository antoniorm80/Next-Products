import { Timestamp } from "firebase/firestore";

// ? No es requerido.... 
export interface User {
    uid: string;
    image?: string;
    name: string;
    email: string;
    password?: string;
    createdAt: Timestamp;
}