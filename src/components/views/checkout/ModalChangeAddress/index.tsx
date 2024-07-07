import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import styles from "./ModalChangeAddress.module.scss";
import { Dispatch, SetStateAction } from "react";

type Proptypes = {
  address: any;
  setChangeAddress: Dispatch<SetStateAction<boolean>>;
  setSelectedAdress: Dispatch<SetStateAction<number>>;
  selectedAddress: number;
};

const ModalChangeAddress = (props: Proptypes) => {
  const { address, setChangeAddress, setSelectedAdress, selectedAddress } =
    props;

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
      {/* <Button type="button" variant="primary" onClick={() => handleDelete()}>
        {isLoading ? "Deleting..." : "Yes, Delete"}
      </Button> */}
    </Modal>
  );
};

export default ModalChangeAddress;
