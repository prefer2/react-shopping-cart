import { css, Theme } from '@emotion/react';
import styled from '@emotion/styled';

const Styled = {
  Page: styled.div`
    padding-top: 80px;
  `,
};

export const globalStyle = css`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

export const theme: Theme = {
  bgColor: {
    primary: '#2AC1BC',
  },
  color: {
    defaultBlack: '#333333',
  },
  textColor: {
    defaultWhite: '#FFFFFF',
  },
  borderColor: {
    darkGrey: '#aaaaaa',
    lightGrey: '#dddddd',
  },
};

export default Styled;
