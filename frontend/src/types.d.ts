import { JwtPayload } from "jwt-decode";

declare module "jwt-decode" {
  export interface JwtPayload {
    userId?: string; // Add the userId property
  }
}
