import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useState } from "react";

const navItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Products",
    url: "/products",
  },
];

const Navbar = () => {
  const { data }: any = useSession();
  const { pathname, push } = useRouter();
  const [dropdownUser, setDropdownUser] = useState(false);

  return (
    <div className={styles.navbar}>
      <h1 className={styles.navbar__logo} onClick={() => push("/")}>
        Thrift Goods
      </h1>
      <div className={styles.navbar__nav}>
        {navItems.map((item) => (
          <Link
            key={`nav-${item.title}`}
            href={item.url}
            className={`${styles.navbar__nav__item} ${
              pathname === item.url && styles["navbar__nav__item--active"]
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>
      {data ? (
        <div className={styles.navbar__user}>
          <div className={styles.navbar__user__cart}>
            <Link href={"/cart"}>
              <i
                className={`bx bxs-cart-alt ${styles.navbar__user__cart__icon}`}
              />
            </Link>
          </div>
          <p>Hello, {data?.user.fullname}</p>
          <div className={styles.navbar__user__profile}>
            <Image
              src={data?.user.image}
              alt={data?.user.fullname}
              width={40}
              height={40}
              className={styles.navbar__user__profile__image}
              onClick={() => setDropdownUser(!dropdownUser)}
            />
            <div
              className={`${styles.navbar__user__profile__dropdown} ${
                dropdownUser &&
                styles["navbar__user__profile__dropdown--active"]
              }`}
            >
              <button
                className={styles.navbar__user__profile__dropdown__item}
                onClick={() => push("/member/profile")}
              >
                Profile
              </button>
              <button
                className={styles.navbar__user__profile__dropdown__item}
                onClick={() => signOut()}
              >
                {data ? "Sign Out" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          className={styles.navbar__button}
          onClick={() => signIn()}
        >
          Login
        </Button>
      )}
    </div>
  );
};

export default Navbar;
