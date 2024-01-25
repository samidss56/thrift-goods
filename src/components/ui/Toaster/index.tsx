import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./Toaster.module.scss";

type PropTypes = {
  variant: string;
  message?: string;
  setToaster: Dispatch<SetStateAction<{}>>;
};

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

const Toaster = (props: PropTypes) => {
  const { variant = "danger", message, setToaster } = props;
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

  return (
    <div
      className={`${styles.toaster} ${styles[`toaster--${variant}`]}`}
      style={{ backgroundColor: toasterVariant[variant].backgroundColor }}
    >
      <div className={styles.toaster__main}>
        <div className={styles.toaster__main__icon}>
          <i
            className={`bx ${toasterVariant[variant].icon}`}
            style={{ color: toasterVariant[variant].barColor }}
          />
        </div>
        <div className={styles.toaster__main__divider} />
        <div className={styles.toaster__main__text}>
          <p
            className={styles.toaster__main__text__title}
            style={{ color: toasterVariant[variant].barColor }}
          >
            {toasterVariant[variant].title}
          </p>
          <p
            className={styles.toaster__main__text__message}
            style={{ color: toasterVariant[variant].barColor }}
          >
            {message}
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
          backgroundColor: toasterVariant[variant].timerBackColor,
        }}
      >
        <div
          style={{
            width: `${lengthBar}%`,
            height: "100%",
            backgroundColor: toasterVariant[variant].barColor,
          }}
        />
      </div>
    </div>
  );
};

export default Toaster;
