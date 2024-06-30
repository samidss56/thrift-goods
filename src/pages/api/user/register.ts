import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/services/auth/services";
import {
  responseApiFailed,
  responseApiMethodNotAllowed,
  responseApiSucess,
} from "@/utils/responseApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await signUp(req.body, (status: boolean) => {
      if (status) {
        responseApiSucess(res);
      } else {
        responseApiFailed(res);
      }
    });
  } else {
    responseApiMethodNotAllowed(res);
  }
}
