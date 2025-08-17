import styled from "styled-components";
import userImg from "../image/userImg.png";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

function EducationApplyCard({
  id,
  writerId,
  title,
  subTitle,
  category,
  teachAt,
  createdAt,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/edu/apply/${id}`);
  };

  // 재능기부자 이름 불러오기
  const [writerName, setWriterName] = useState("");

  const fetchWriterInfo = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER}api/user/${writerId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.nickname) {
        console.log("재능 기부자 정보:", response.data);
        setWriterName(response.data.nickname);
      } else {
        console.warn("예상치 못한 응답 형식입니다:", response.data);
      }
    } catch (error) {
      console.error("재능기부자 정보 불러오는 중 오류 발생:", error);
    }
  }, []);

  useEffect(() => {
    fetchWriterInfo();
  }, [fetchWriterInfo]);

  // 교육 날짜 format
  const formatTeachAt = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed
    const day = date.getDate();

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = weekDays[date.getDay()];

    let hours = date.getHours();
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12 || 12;

    return `${year}년 ${month}월 ${day}일(${dayOfWeek}) ${ampm} ${hours}시`;
  };

  // 날짜 비교 로직
  const formatAgo = (isoString) => {
    const createdDate = new Date(isoString);
    const today = new Date();

    const created = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      createdDate.getDate()
    );
    const now = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const diffTime = now - created;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "오늘";
    } else {
      return `${diffDays}일 전`;
    }
  };

  return (
    <EduBox onClick={handleClick}>
      <EduProfile>
        <ProfileImage src={userImg}></ProfileImage>
      </EduProfile>
      <EduDes>
        <EduTop>
          <EduTag>{category}</EduTag>
          <EduAgo>{formatAgo(createdAt)}</EduAgo>
        </EduTop>
        <EduMid>
          <EduTitle>{title}</EduTitle>
          <EduSubtitle>{subTitle}</EduSubtitle>
          <EduDonator>{writerName}</EduDonator>
        </EduMid>
        <EduBottom>{formatTeachAt(teachAt)}</EduBottom>
      </EduDes>
    </EduBox>
  );
}

export default EducationApplyCard;

export const EduBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 10px 15px 20px 15px;
  border-bottom: 1px solid #ececec;
  border-top: 1px solid #ececec;
`;

export const EduProfile = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px 10px 0 0;
`;

export const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

export const EduDes = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const EduTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 0 10px 0;
`;

export const EduTag = styled.div`
  background-color: #ececec;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  padding: 3px 8px;
`;

export const EduAgo = styled.div`
  color: #898989;
  font-size: 13px;
  margin-right: 5px;
`;

export const EduMid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const EduTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 4px;
`;

export const EduSubtitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
`;

export const EduDonator = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

export const EduBottom = styled.div`
  font-size: 12px;
  font-weight: 700;
`;
