import { useState } from "react";
import styled from "styled-components";
import back from "../image/back.png";

function RegionBottomSheet({ onSelect, onClose }) {
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (address.trim()) {
      onSelect(address.trim());
    }
    onClose();
  };

  const handleBack = () => {
    onClose();
  };
  return (
    <BottomSheetWrapper>
      <BottomSheetBox>
        <Header>
          <Back src={back} onClick={handleBack}></Back>
          <HeaderTitle>사는 곳</HeaderTitle>
        </Header>
        <AddressInput
          type="text"
          placeholder="지역, 동네명을 입력해주세요!"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></AddressInput>
        <SubmitBtn onClick={handleSubmit}>확인</SubmitBtn>
      </BottomSheetBox>
    </BottomSheetWrapper>
  );
}

export default RegionBottomSheet;

export const BottomSheetWrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(49, 49, 49, 0.64);
  z-index: 999;
`;

export const BottomSheetBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 19px 19px 0 0;
  padding: 20px;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 16px;
`;

export const HeaderTitle = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 22px;
  font-weight: 700;
`;

export const Back = styled.img`
  position: absolute;
  left: 5px;
  width: 10px;
  height: 20px;
  cursor: pointer;
`;

export const AddressInput = styled.input`
  width: 100%;
  margin: 20px 0;
  padding: 12px;
  border: 2px solid #808080;
  border-radius: 10px;
  font-size: 16px;
  margin: 40px 0 480px 0;
`;

export const SubmitBtn = styled.div`
  background-color: #d9b5ff;
  color: #ffffff;
  border-radius: 30.5px;
  height: 59px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
