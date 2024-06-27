import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveDataById, updateData } from "@/lib/firebase/service";
import { compare, hash } from "bcrypt";
import { verify } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    verify(req, res, false, async (decoded: { id: string }) => {
      const profile: any = await retrieveDataById("users", decoded.id);
      if (profile) {
        profile.id = decoded.id;
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "success",
          data: profile,
        });
      } else {
        res.status(404).json({
          status: false,
          statusCode: 404,
          message: "failed",
          data: {},
        });
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
          res.status(400).json({
            status: false,
            statusCode: 400,
            message: "failed",
          });
        }
        delete data.oldPassword;
        delete data.encryptedPassword;
        data.password = await hash(data.password, 10);
      }
      await updateData("users", decoded.id, data, (result: boolean) => {
        if (result) {
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "success",
          });
        } else {
          res.status(400).json({
            status: false,
            statusCode: 400,
            message: "failed",
          });
        }
      });
    });
  }
}
