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
  profile: any;
  setChangeAddress: Dispatch<SetStateAction<boolean>>;
  setSelectedAdress: Dispatch<SetStateAction<number>>;
  setProfile: Dispatch<SetStateAction<{}>>;
  selectedAddress: number;
};

const ModalChangeAddress = (props: Proptypes) => {
  const {
    profile,
    setProfile,
    setChangeAddress,
    setSelectedAdress,
    selectedAddress,
  } = props;
  const { setToaster } = useContext(ToasterContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      address: [
        ...profile.address,
        {
          recipient: form.recipient.value,
          phone: form.phone.value,
          addressLine: form.addressLine.value,
          note: form.note.value,
          isMain: false,
        },
      ],
    };
    // console.log(data);
    try {
      const result = await userServices.updateProfile(data);
      if (result.status === 200) {
        setIsLoading(false);
        setIsAddNew(false);
        setProfile({
          ...profile,
          address: data.address,
        });
        form.reset();
        setToaster({
          variant: "success",
          message: "Success Add New Address",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Failed Add New Address",
      });
    }
  };

  const handleDeleteAddress = async (id: number) => {
    const address = profile.address;
    address.splice(id, 1);
    const data = {
      address,
    };
    try {
      const result = await userServices.updateProfile(data);
      if (result.status === 200) {
        setIsLoading(false);
        setIsAddNew(false);
        setProfile({
          ...profile,
          address: data.address,
        });
        setToaster({
          variant: "success",
          message: "Success Delete Address",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Failed Delete Address",
      });
    }
  };

  return (
    <Modal onClose={() => setChangeAddress(false)}>
      <h2 className={styles.modal__title}>Change Shipping address ?</h2>
      {profile.address.map((item: any, id: number) => (
        <div
          key={item.addressLine}
          className={`${styles.modal__address} ${
            id === selectedAddress && styles["modal__address--active"]
          }`}
        >
          <div
            className={styles.modal__address__header}
            onClick={() => {
              setSelectedAdress(id);
            }}
          >
            <h4 className={styles.modal__address__header__title}>
              {item.recipient} - {item.phone}
            </h4>
            <Button
              type="button"
              className={styles.modal__address__header__action}
              onClick={() => handleDeleteAddress(id)}
              disabled={isLoading || id === selectedAddress}
            >
              <i className="bx bxs-trash" />
            </Button>
          </div>

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
            onSubmit={handleAddAddress}
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
