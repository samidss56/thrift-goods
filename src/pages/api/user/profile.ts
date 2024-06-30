import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveDataById, updateData } from "@/lib/firebase/service";
import { compare, hash } from "bcrypt";
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
      const profile: any = await retrieveDataById("users", decoded.id);
      if (profile) {
        profile.id = decoded.id;
        responseApiSucess(res, profile);
      } else {
        responseApiNotFound(res);
      }
    });
  } else if (req.method === "PUT") {
    const { data } = req.body;
    verify(req, res, false, async (decoded: { id: string }) => {
      if (data.password) {
        const passwordConfirm = await compare(
          data.oldPassword,
          data.encryptedPassword
        );
        if (!passwordConfirm) {
          responseApiFailed(res);
        }
        delete data.oldPassword;
        delete data.encryptedPassword;
        data.password = await hash(data.password, 10);
      }
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
