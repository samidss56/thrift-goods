import { Product } from "@/types/product.type";
import styles from "./Checkout.module.scss";
import Image from "next/image";
import { convertIDR } from "@/utils/currency";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { Fragment, useContext, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import userServices from "@/services/user";
import { ToasterContext } from "@/contexts/ToasterContext";
import { useSession } from "next-auth/react";
import productServices from "@/services/product";

const CheckoutView = () => {
  const { setToaster } = useContext(ToasterContext);

  const session: any = useSession();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState<Product[]>([]);

  const getCart = async (token: string) => {
    const { data } = await userServices.getCart();
    setCart(data.data);
  };

  const getAllProducts = async () => {
    const { data } = await productServices.getAllProducts();
    setProducts(data.data);
  };

  useEffect(() => {
    if (session.data?.accessToken) {
      getCart(session.data?.accessToken);
    }
  }, [session]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getProduct = (id: string) => {
    const product: any = products.find((product: Product) => product.id === id);
    return product;
  };

  const getSizeOptions = (id: string, selected: string) => {
    const product = products.find((product: Product) => product.id === id);
    const options = product?.stock.map(
      (stock: { size: string; qty: number }) => {
        if (stock.qty > 0) {
          return {
            label: stock.size,
            value: stock.size,
            selected: stock.size === selected,
          };
        }
      }
    );
    const data = options?.filter((option) => option !== undefined);
    return data;
  };

  const getTotalPrice = () => {
    const total = cart.reduce(
      (acc: number, item: { id: string; size: string; qty: number }) => {
        const product: any = getProduct(item.id);
        return (acc += parseInt(product?.price) * item.qty);
      },
      0
    );

    return total;
  };

  const handleDeleteCart = async (id: string, size: string) => {
    const newCart = cart.filter((item: { id: string; size: string }) => {
      return item.id !== id || item.size !== size;
    });

    try {
      const result = await userServices.addToCart({
        carts: newCart,
      });
      if (result.status === 200) {
        setCart(newCart);
        setToaster({
          variant: "success",
          message: "Success Delete Item from Cart",
        });
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Failed Delete Item from Cart",
      });
    }
  };

  return (
    <div className={styles.checkout}>
      <div className={styles.checkout__main}>
        <h1 className={styles.checkout__main__title}>Checkout</h1>
        {cart.length > 0 ? (
          <div className={styles.checkout__main__list}>
            {cart.map((item: { id: string; size: string; qty: number }) => (
              <Fragment key={`${item.id}-${item.size}`}>
                <div className={styles.checkout__main__list__item}>
                  {getProduct(item.id)?.image && (
                    <Image
                      src={`${getProduct(item.id)?.image}`}
                      width={150}
                      height={150}
                      alt={`${item.id}-${item.size}`}
                      className={styles.checkout__main__list__item__image}
                    />
                  )}
                  <div className={styles.checkout__main__list__item__info}>
                    <h4
                      className={styles.checkout__main__list__item__info__title}
                    >
                      {getProduct(item.id)?.name}
                    </h4>
                    <div
                      className={styles.checkout__main__list__item__info__data}
                    >
                      <label
                        className={
                          styles.checkout__main__list__item__info__data__size
                        }
                      >
                        Size {item.size}
                      </label>
                      <label
                        className={
                          styles.checkout__main__list__item__info__data__qty
                        }
                      >
                        Quantity {item.qty}
                      </label>
                    </div>
                  </div>
                  <h4 className={styles.checkout__main__list__item__price}>
                    {convertIDR(getProduct(item.id)?.price)}
                  </h4>
                </div>
                <hr className={styles.checkout__main__list__divider} />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className={styles.checkout__main__empty}>
            <h1 className={styles.checkout__main__title}>Your cart is empty</h1>
          </div>
        )}
      </div>
      <div className={styles.checkout__sumarry}>
        <h1 className={styles.checkout__sumarry__title}>Summary</h1>
        <div className={styles.checkout__sumarry__item}>
          <h4>Subtotal</h4>
          <p>{convertIDR(getTotalPrice())}</p>
        </div>
        <div className={styles.checkout__sumarry__item}>
          <h4>Delivery</h4>
          <p>{convertIDR(0)}</p>
        </div>
        <div className={styles.checkout__sumarry__item}>
          <h4>Tax</h4>
          <p>{convertIDR(0)}</p>
        </div>
        <hr />
        <div className={styles.checkout__sumarry__item}>
          <h4>Total</h4>
          <p>{convertIDR(getTotalPrice())}</p>
        </div>
        <hr />
        <Button
          variant="primary"
          type="button"
          className={styles.checkout__sumarry__button}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CheckoutView;
