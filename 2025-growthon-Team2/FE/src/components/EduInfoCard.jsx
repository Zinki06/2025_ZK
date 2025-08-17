import styled from "styled-components";
import applyUsers from "../image/ApplyUsers.png";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const koreanHours = date.getUTCHours() + 9;
  const koreanDate = new Date(date);
  koreanDate.setUTCHours(koreanHours);

  const year = koreanDate.getUTCFullYear();
  const month = koreanDate.getUTCMonth() + 1;
  const day = koreanDate.getUTCDate();
  const hours = koreanDate.getUTCHours();
  const ampm = hours >= 12 ? "오후" : "오전";
  const hour = hours % 12 || 12;

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[koreanDate.getUTCDay()];

  return `${year}년 ${month}월 ${day}일(${weekday}) ${ampm} ${hour}시 이후`;
};

function EduInfoCard({
  id,
  nickname,
  title,
  subTitle,
  category,
  address,
  teachAt,
  userImg,
  appliedTalents,
}) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/edu/matching/${id}`);
  }, [navigate, id]);

  return (
    <EduBox>
      <EduProfile>
        <ProfileImage src={userImg}></ProfileImage>
      </EduProfile>
      <EduDes>
        <EduTop>
          <EduName>{nickname} 님</EduName>
          <EduAddress>{address}</EduAddress>
        </EduTop>
        <EduMid>
          <EduCategoryTitle>교육 분야</EduCategoryTitle>
          <EduCategoryContent>{category}</EduCategoryContent>
        </EduMid>
        <EduBottom>
          <EduTitle>{title}</EduTitle>
          <EduSubTitle>{subTitle}</EduSubTitle>
        </EduBottom>
        <EduTime>
          <EduTimeTitle>교육 시간</EduTimeTitle>
          <EduTimeDes>{formatDate(teachAt)}</EduTimeDes>
        </EduTime>
      </EduDes>
      {appliedTalents > 0 && (
        <ApplyList id={id} onClick={handleClick}>
          <ApplyUsers src={applyUsers} />
          <ApplyUsersNum>+{appliedTalents}</ApplyUsersNum>
        </ApplyList>
      )}
    </EduBox>
  );
}

export default EduInfoCard;

export const EduBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 10px 15px 45px 15px;
  border-radius: 20px;
  background-color: #f9fafb;
`;

export const EduProfile = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px 10px 15px 15px;
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
  padding: 17px 15px 15px 0;
`;

export const EduTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
  font-size: 15px;
  font-weight: 600;
`;

export const EduName = styled.div`
  margin-right: 5px;
`;

export const EduAddress = styled.div`
  color: #aaaaaa;
`;

export const EduMid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
`;

export const EduCategoryTitle = styled.div`
  margin-right: 5px;
`;

export const EduCategoryContent = styled.div`
  color: #c48dff;
`;

export const EduBottom = styled.div`
  margin: 20px 0;
`;

export const EduTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 3px;
`;

export const EduSubTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

export const EduTime = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 10px;
`;

export const EduTimeTitle = styled.div`
  font-weight: 800;
  margin-right: 10px;
`;

export const EduTimeDes = styled.div`
  font-weight: 500;
`;

export const ApplyList = styled.div`
  position: absolute;
  background-color: #cccaca;
  padding: 5px 10px 5px 5px;
  border-radius: 40px;
  bottom: -30px;
  right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ApplyUsers = styled.img`
  width: 57px;
  height: 30px;
`;

export const ApplyUsersNum = styled.div`
  color: #ffffff;
  font-size: 13px;
  margin-left: 8px;
`;
