import React, { useState } from "react";
import styled from "styled-components";
import back from "../image/back.png";

function CategoryBottomSheet({ onSelect, onClose }) {
  const categories = [
    "IT/코딩",
    "디자인",
    "음악",
    "외국어",
    "학습 멘토링",
    "경제 기초",
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onSelect(selectedCategory);
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
          <HeaderTitle>학습 분야</HeaderTitle>
        </Header>
        <Categories>
          {categories.map((category) => (
            <Category
              key={category}
              selected={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Category>
          ))}
        </Categories>
        <SubmitBtn onClick={handleSubmit}>확인</SubmitBtn>
      </BottomSheetBox>
    </BottomSheetWrapper>
  );
}

export default CategoryBottomSheet;

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

export const Categories = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin: 40px 0 450px 0;
`;

export const Category = styled.div`
  background-color: ${(props) => (props.selected ? "#D3A9FF" : "#eeeeee")};
  color: ${(props) => (props.selected ? "#ffffff" : "#8e8e8e")};
  border-radius: 22px;
  height: 33px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  font-size: 15px;
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
