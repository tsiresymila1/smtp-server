import { AuthState } from "../slice/authSlice";

export type AuthContextType = AuthState
export type AuthUserInput = {
    email: string;
    password:string;
}
