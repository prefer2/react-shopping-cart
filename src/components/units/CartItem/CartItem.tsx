import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import Styled from './CartItem.styles';
import { ReactComponent as DeleteIcon } from '../../../assets/images/delete.svg';
import Checkbox from '../../shared/Checkbox/Checkbox';
import QuantityInput from '../../shared/QuantityInput/QuantityInput';
import noImageURL from '../../../assets/images/no_image.jpg';
import * as T from '../../../types';
import { updateQuantityRequest } from '../../../modules/cartItems/actions';
import CART_ITEM_QUANTITY from '../../../constants/cart';
import { toPriceFormat } from '../../../utils';

interface IProps {
  cartItem: T.CartItem;
  onCheck: (id: number, isChecked: boolean) => void;
  onDelete: (id: T.CartItem['id']) => void;
}

const CartItem = (props: IProps): ReactElement => {
  const { cartItem, onCheck, onDelete } = props;
  const { id, product, quantity, checked } = cartItem;
  const { name, image, price } = product;

  const dispatch = useDispatch();

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = event.target.valueAsNumber;

    if (newQuantity <= CART_ITEM_QUANTITY.MIN || Number.isNaN(newQuantity)) {
      dispatch(updateQuantityRequest(id, CART_ITEM_QUANTITY.MIN));
      return;
    }

    if (newQuantity >= CART_ITEM_QUANTITY.MAX) {
      dispatch(updateQuantityRequest(id, CART_ITEM_QUANTITY.MAX));
      return;
    }

    dispatch(updateQuantityRequest(id, newQuantity));
  };

  const handleIncrement = () => {
    if (quantity >= CART_ITEM_QUANTITY.MAX) return;

    dispatch(updateQuantityRequest(id, quantity + 1));
  };

  const handleDecrement = () => {
    if (quantity <= CART_ITEM_QUANTITY.MIN) return;

    dispatch(updateQuantityRequest(id, quantity - 1));
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    onCheck(id, isChecked);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const totalPrice = price * quantity;

  return (
    <Styled.Root>
      <Checkbox checked={checked} onChange={handleCheck} />
      <Styled.Image src={image || noImageURL} alt={name} />
      <Styled.Title>{name}</Styled.Title>
      <Styled.Option>
        <Styled.Delete onClick={handleDelete}>
          <DeleteIcon />
        </Styled.Delete>
        <Styled.QuantityInputWrapper>
          <QuantityInput
            value={quantity}
            min={1}
            max={99}
            onChangeInput={handleChangeInput}
            onIncrease={handleIncrement}
            onDecrease={handleDecrement}
          />
        </Styled.QuantityInputWrapper>
        <Styled.Price>{toPriceFormat(totalPrice)} 원</Styled.Price>
      </Styled.Option>
    </Styled.Root>
  );
};

export default CartItem;