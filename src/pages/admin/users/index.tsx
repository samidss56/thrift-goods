import UsersAdminView from "@/components/views/admin/Users";
import userServices from "@/services/user";
import { useEffect, useState } from "react";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getAllUser = async () => {
      const { data } = await userServices.getAllUser();
      setUsers(data.data);
    };
    getAllUser();
  }, []);

  return (
    <>
      <UsersAdminView users={users} />
    </>
  );
};

export default AdminUsersPage;
