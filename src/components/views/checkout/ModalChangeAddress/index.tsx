import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import styles from "./ModalChangeAddress.module.scss";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import userServices from "@/services/user";
import { ToasterContext } from "@/contexts/ToasterContext";

type Proptypes = {
  address: any;
  setChangeAddress: Dispatch<SetStateAction<boolean>>;
  setSelectedAdress: Dispatch<SetStateAction<number>>;
  selectedAddress: number;
};

const ModalChangeAddress = (props: Proptypes) => {
  const { address, setChangeAddress, setSelectedAdress, selectedAddress } =
    props;
  const { setToaster } = useContext(ToasterContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);

  const handleChangeAddress = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      recipient: form.recipient.value,
      phone: form.phone.value,
      addressLine: form.addressLine.value,
      note: form.note.value,
    };
    console.log(data);
    try {
      const result = await userServices.updateProfile(data);
      if (result.status === 200) {
        setIsLoading(false);
        form.reset();
        setToaster({
          variant: "success",
          message: "Success Change Password",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Failed Change Password",
      });
    }
  };

  return (
    <Modal onClose={() => setChangeAddress(false)}>
      <h2 className={styles.modal__title}>Change Shipping address ?</h2>
      {address.map((item: any, id: number) => (
        <div
          key={item.addressLine}
          className={`${styles.modal__address} ${
            id === selectedAddress && styles["modal__address--active"]
          }`}
          onClick={() => setSelectedAdress(id)}
        >
          <h4 className={styles.modal__address__title}>
            {item.recipient} - {item.phone}
          </h4>
          <p className={styles.modal__address__address}>{item.addressLine}</p>
          <p className={styles.modal__address__note}>Note : {item.note}</p>
        </div>
      ))}
      <Button
        className={styles.modal__button}
        onClick={() => setIsAddNew(!isAddNew)}
        type="button"
      >
        {isAddNew ? "Cancel" : "Add New Address"}
      </Button>
      {isAddNew && (
        <div className={styles.modal__form}>
          <form
            className={styles.modal__form__group}
            onSubmit={handleChangeAddress}
          >
            <Input
              type="text"
              name="recipient"
              label="Recipient"
              placeholder="Insert recipient"
            />
            <Input
              type="text"
              name="phone"
              label="Recipient phone"
              placeholder="Insert recipient phone"
            />
            <TextArea
              name="addressLine"
              label="Address Line"
              placeholder="Insert address line"
            />
            <Input
              type="text"
              name="note"
              label="Note"
              placeholder="Insert note"
            />
            <Button
              className={styles.modal__button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default ModalChangeAddress;
