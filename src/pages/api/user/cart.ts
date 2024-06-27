import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveDataById, updateData } from "@/lib/firebase/service";
import { verify } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    verify(req, res, false, async (decoded: { id: string }) => {
      const user: any = await retrieveDataById("users", decoded.id);
      if (user) {
        user.id = decoded.id;
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "success",
          data: user.carts,
        });
      } else {
        res.status(404).json({
          status: false,
          statusCode: 404,
          message: "failed",
          data: [],
        });
      }
    });
  } else if (req.method === "PUT") {
    const { data } = req.body;
    verify(req, res, false, async (decoded: { id: string }) => {
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

export const config = {
  api: {
    externalResolver: true,
  },
};
