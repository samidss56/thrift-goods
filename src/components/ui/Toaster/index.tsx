import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Toaster.module.scss";
import { ToasterContext } from "@/contexts/ToasterContext";
import { ToasterType } from "@/types/toaster.type";

const toasterVariant: any = {
  success: {
    title: "Success",
    icon: "bx-check-circle",
    backgroundColor: "#22ca28",
    timerBackColor: "#21a725",
    barColor: "#fff",
  },
  danger: {
    title: "Error",
    icon: "bx-x-circle",
    backgroundColor: "#db1414",
    timerBackColor: "#b91b1b",
    barColor: "#fff",
  },
  warning: {
    title: "Warning",
    icon: "bx-error-circle",
    backgroundColor: "#febc22",
    timerBackColor: "#ebad1f",
    barColor: "#fff",
  },
};

const Toaster = () => {
  const { toaster, setToaster }: ToasterType = useContext(ToasterContext);
  const [lengthBar, setLengthBar] = useState(100);
  const timerRef = useRef<any>(null);

  const timerStart = () => {
    timerRef.current = setInterval(() => {
      setLengthBar((prevLength) => prevLength - 0.14);
    }, 1);
  };

  useEffect(() => {
    timerStart();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (lengthBar < 0) {
      setToaster({});
    }
  }, [lengthBar, setToaster]);

  return (
    <div
      className={`${styles.toaster} ${styles[`toaster--${toaster.variant}`]}`}
      style={{
        backgroundColor: toasterVariant[`${toaster.variant}`].backgroundColor,
      }}
    >
      <div className={styles.toaster__main}>
        <div className={styles.toaster__main__icon}>
          <i
            className={`bx ${toasterVariant[`${toaster.variant}`].icon}`}
            style={{ color: toasterVariant[`${toaster.variant}`].barColor }}
          />
        </div>
        <div className={styles.toaster__main__divider} />
        <div className={styles.toaster__main__text}>
          <p
            className={styles.toaster__main__text__title}
            style={{ color: toasterVariant[`${toaster.variant}`].barColor }}
          >
            {toasterVariant[`${toaster.variant}`].title}
          </p>
          <p
            className={styles.toaster__main__text__message}
            style={{ color: toasterVariant[`${toaster.variant}`].barColor }}
          >
            {toaster.message}
          </p>
        </div>
        <i
          className={`bx bx-x ${styles.toaster__main__close}`}
          onClick={() => setToaster({})}
        />
      </div>
      <div
        className={`${styles.toaster__timer}`}
        style={{
          backgroundColor: toasterVariant[`${toaster.variant}`].timerBackColor,
        }}
      >
        <div
          style={{
            width: `${lengthBar}%`,
            height: "100%",
            backgroundColor: toasterVariant[`${toaster.variant}`].barColor,
          }}
        />
      </div>
    </div>
  );
};

export default Toaster;
