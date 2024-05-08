import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { Dispatch, FormEvent, SetStateAction, useContext, useState } from "react";
import { User } from "@/types/user.type";
import styles from "./ModalUpdateUser.module.scss";
import { ToasterContext } from "@/contexts/ToasterContext";

type Proptypes = {
  setUsersData: Dispatch<SetStateAction<User[]>>;
  updatedUser: User | any;
  setUpdatedUser: Dispatch<SetStateAction<{}>>;
};

const ModalUpdateUser = (props: Proptypes) => {
  const {setToaster} = useContext(ToasterContext);
  const { updatedUser, setUpdatedUser, setUsersData } =
    props;
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      role: form.role.value,
    };

    const result = await userServices.updateUser(
      updatedUser.id,
      data,
    );

    if (result.status === 200) {
      form.reset();
      setIsLoading(false);
      setUpdatedUser({});
      const { data } = await userServices.getAllUser();
      setUsersData(data.data);
      setToaster({
        variant: "success",
        message: "Success Update User",
      });
    } else {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Failed Update User",
      });
    }
  };
  return (
    <Modal onClose={() => setUpdatedUser({})}>
      <h1>Update User</h1>
      <form onSubmit={handleUpdateUser} className={styles.form}>
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={updatedUser.email}
          disabled
          className={styles.form__input}
        />
        <Input
          label="Fullname"
          name="fullname"
          type="text"
          defaultValue={updatedUser.fullname}
          disabled
          className={styles.form__input}
        />
        <Input
          label="Phone"
          name="phone"
          type="number"
          defaultValue={updatedUser.phone}
          disabled
          className={styles.form__input}
        />
        <Select
          label="Role"
          name="role"
          defaultValue={updatedUser.role}
          className={styles.form__input}
          options={[
            { label: "Member", value: "member" },
            { label: "Admin", value: "admin" },
          ]}
        />
        <Button type="submit" variant="primary">
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUser;
