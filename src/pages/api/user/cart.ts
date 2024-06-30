import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveDataById, updateData } from "@/lib/firebase/service";
import { verify } from "@/utils/verifyToken";
import {
  responseApiFailed,
  responseApiMethodNotAllowed,
  responseApiNotFound,
  responseApiSucess,
} from "@/utils/responseApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    verify(req, res, false, async (decoded: { id: string }) => {
      const user: any = await retrieveDataById("users", decoded.id);
      if (user) {
        user.id = decoded.id;
        responseApiSucess(res, user.carts);
      } else {
        responseApiNotFound(res);
      }
    });
  } else if (req.method === "PUT") {
    const { data } = req.body;
    verify(req, res, false, async (decoded: { id: string }) => {
      await updateData("users", decoded.id, data, (result: boolean) => {
        if (result) {
          responseApiSucess(res);
        } else {
          responseApiFailed(res);
        }
      });
    });
  } else {
    responseApiMethodNotAllowed(res);
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
