import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {
  ProductCartPageWrapper,
  HeaderWrapper,
  CheckBoxWrapper,
  ListHeaderWrapper,
  CartListWrapper,
  SelectDeleteWrapper,
  CartInfoWrapper,
  SelectCartWrapper,
} from 'page/ProductCartPage/style';

import CheckBox from 'component/common/CheckBox';
import AmountBox from 'component/AmountBox';
import Button from 'component/common/Button';

import CartItem from 'component/CartItem';

export default function ProductCartPage() {
  const cartItem = useSelector((state) => state.cartReducer.cart);

  const {totalCount, totalPrice} = cartItem.reduce(
    (prev, cur) => {
      return {
        totalCount: cur.count + prev.totalCount,
        totalPrice: cur.itemPrice * cur.count + prev.totalPrice,
      };
    },
    {totalCount: 0, totalPrice: 0},
  );

  return (
    <ProductCartPageWrapper>
      <HeaderWrapper>장바구니</HeaderWrapper>
      <CartInfoWrapper>
        <SelectCartWrapper>
          <SelectDeleteWrapper>
            <CheckBoxWrapper>
              <CheckBox />
              선택해제
            </CheckBoxWrapper>
            <Button>상품삭제</Button>
          </SelectDeleteWrapper>

          <ListHeaderWrapper>든든배송 상품 (개)</ListHeaderWrapper>
          <CartListWrapper>
            {cartItem.map(({itemImgURL, itemName, itemPrice, count, id}) => (
              <React.Fragment key={id}>
                <CartItem
                  itemImgURL={itemImgURL}
                  itemName={itemName}
                  itemPrice={itemPrice}
                  count={count}
                  id={id}
                />
                <hr />
              </React.Fragment>
            ))}
          </CartListWrapper>
        </SelectCartWrapper>

        <AmountBox type="expect" totalCount={totalCount} totalPrice={totalPrice} />
      </CartInfoWrapper>
    </ProductCartPageWrapper>
  );
}

ProductCartPage.propTypes = {
  itemImgURL: PropTypes.string,
  itemName: PropTypes.string,
  itemPrice: PropTypes.string,
};