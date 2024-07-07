import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { responseApiAcessDenied } from "./responseApi";

export const verify = (
  req: NextApiRequest,
  res: NextApiResponse,
  isAdmin: boolean,
  callback: Function
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err: any, decoded: any) => {
        if (decoded && (isAdmin ? decoded.role === "admin" : true)) {
          callback(decoded);
        } else {
          responseApiAcessDenied(res);
        }
      }
    );
  } else {
    responseApiAcessDenied(res);
  }
};
