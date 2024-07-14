import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import styles from "./ModalChangeAddress.module.scss";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";

type Proptypes = {
  address: any;
  setChangeAddress: Dispatch<SetStateAction<boolean>>;
  setSelectedAdress: Dispatch<SetStateAction<number>>;
  selectedAddress: number;
};

const ModalChangeAddress = (props: Proptypes) => {
  const { address, setChangeAddress, setSelectedAdress, selectedAddress } =
    props;

  const handleChangeAddress = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      recipient: form.recipient.value,
      phone: form.phone.value,
      addressLine: form.addressLine.value,
      note: form.note.value,
    };
    console.log(data);
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
        onClick={() => setChangeAddress(true)}
        type="button"
      >
        Add New Address
      </Button>
      <div className={styles.modal__form}>
        <form onSubmit={handleChangeAddress}>
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
          <TextArea name="note" label="Note" placeholder="Insert note" />
          <Button className={styles.modal__button} type="submit">
            Save
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalChangeAddress;
