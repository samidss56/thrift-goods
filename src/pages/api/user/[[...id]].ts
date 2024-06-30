import { deleteData, retrieveData, updateData } from "@/lib/firebase/service";
import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "@/utils/verifyToken";
import {
  responseApiFailed,
  responseApiMethodNotAllowed,
  responseApiSucess,
} from "@/utils/responseApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    verify(req, res, true, async () => {
      const users = await retrieveData("users");
      const data = users.map((user: any) => {
        delete user.password;
        return user;
      });
      responseApiSucess(res, data);
    });
  } else if (req.method === "PUT") {
    verify(req, res, true, async () => {
      const { id } = req.query;
      const { data } = req.body;
      await updateData("users", `${id}`, data, (result: boolean) => {
        if (result) {
          responseApiSucess(res);
        } else {
          responseApiFailed(res);
        }
      });
    });
  } else if (req.method === "DELETE") {
    verify(req, res, true, async () => {
      const { id } = req.query;
      await deleteData("users", `${id}`, (result: boolean) => {
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
