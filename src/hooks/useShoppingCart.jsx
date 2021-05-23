import { API_PATH } from '../constants/api';
import { requestDeleteItem, requestGetItemList, requestInsertItem } from '../request/request';
import useDialog from './useDialog';
import useSWR from 'swr';
import { ADD_FAILURE, ADD_SUCCESS } from '../components';
import { useState } from 'react';

const getShoppingCartItemList = async () => {
  const shoppingCartItemList = await requestGetItemList(API_PATH.SHOPPING_CART_LIST);

  return shoppingCartItemList.map((item) => ({ ...item, quantity: 1, isChecked: true }));
};

const useShoppingCart = () => {
  const { isDialogOpen, setIsDialogOpen, onConfirm, onCancel, type, setType } = useDialog();
  const {
    data: shoppingCartItemList,
    isLoading,
    mutate,
  } = useSWR(API_PATH.SHOPPING_CART_LIST, getShoppingCartItemList, {
    suspense: true,
    revalidateOnFocus: false,
  });
  const [serverError, setServerError] = useState(null);

  if (serverError) {
    throw new Error(serverError.message);
  }

  const isAllShoppingCartItemChecked =
    shoppingCartItemList.length === shoppingCartItemList.filter((item) => item.isChecked).length;

  const insertShoppingCartItem = async (productId) => {
    const isExistedInShoppingCart = shoppingCartItemList.some(
      (shoppingCartItem) => shoppingCartItem.productId === productId
    );

    if (isExistedInShoppingCart) {
      setType(ADD_FAILURE);
      setIsDialogOpen(true);

      return;
    }

    setType(ADD_SUCCESS);
    setIsDialogOpen(true);

    try {
      await requestInsertItem(API_PATH.SHOPPING_CART_LIST, { productId });
      mutate();
    } catch (error) {
      console.error(error);
      setServerError(error);
    }
  };

  const deleteShoppingCartItem = async (id) => {
    try {
      await requestDeleteItem(API_PATH.SHOPPING_CART_LIST, id);
      mutate();
    } catch (error) {
      console.error(error);
      setServerError(error);
    }
  };

  const deleteCheckedShoppingCartItem = async (checkedItemList) => {
    try {
      await Promise.all(checkedItemList.map(({ cartId }) => requestDeleteItem(API_PATH.SHOPPING_CART_LIST, cartId)));
      mutate();
    } catch (error) {
      console.error(error);
      setServerError(error);
    }
  };

  const toggleShoppingCartItem = (id) => {
    const changedShoppingCartItemList = shoppingCartItemList.map((shoppingCartItem) => {
      if (shoppingCartItem.cartId === id) {
        return {
          ...shoppingCartItem,
          isChecked: !shoppingCartItem.isChecked,
        };
      }

      return shoppingCartItem;
    });

    mutate(changedShoppingCartItemList, false);
  };

  const toggleAllShoppingCartItem = () => {
    const changedShoppingCartItemList = shoppingCartItemList.map((shoppingCartItem) => ({
      ...shoppingCartItem,
      isChecked: !isAllShoppingCartItemChecked,
    }));

    mutate(changedShoppingCartItemList, false);
  };

  const increaseQuantity = (id) => {
    const changedShoppingCartItemList = shoppingCartItemList.map((shoppingCartItem) => {
      if (shoppingCartItem.cartId === id) {
        return {
          ...shoppingCartItem,
          quantity: shoppingCartItem.quantity + 1,
        };
      }
      return shoppingCartItem;
    });

    mutate(changedShoppingCartItemList, false);
  };

  const decreaseQuantity = (id) => {
    const changedShoppingCartItemList = shoppingCartItemList.map((shoppingCartItem) => {
      if (shoppingCartItem.cartId === id) {
        return {
          ...shoppingCartItem,
          quantity: shoppingCartItem.quantity - 1,
        };
      }
      return shoppingCartItem;
    });

    mutate(changedShoppingCartItemList, false);
  };

  return {
    shoppingCartItemList,
    isAllShoppingCartItemChecked,
    insertShoppingCartItem,
    deleteShoppingCartItem,
    deleteCheckedShoppingCartItem,
    toggleShoppingCartItem,
    toggleAllShoppingCartItem,
    increaseQuantity,
    decreaseQuantity,
    isLoading,
    isDialogOpen,
    onConfirm,
    onCancel,
    dialogType: type,
  };
};

export default useShoppingCart;
