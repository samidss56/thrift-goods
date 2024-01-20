import instance from "@/lib/axios/instance";

const userServices = {
  getAllUser: () => instance.get("/api/user"),
};

export default userServices;
