import CartView from "@/components/views/cart";
import productServices from "@/services/product";
import userServices from "@/services/user";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";

const CartPage = () => {
  const session: any = useSession();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

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

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <CartView cart={cart} products={products} />
    </>
  );
};

export default CartPage;
