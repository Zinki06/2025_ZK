import styled from "styled-components";
import { getAccessToken } from "../utils/getAccessToken";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

function MatchingList() {
  const { id } = useParams();

  // 신청한 유저 리스트
  const [appliedUsers, setAppliedUsers] = useState([]);

  const fetchsetAppliedUsers = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER}api/post/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.appliedTalents) {
        console.log("신청한 유저 정보:", response.data.appliedTalents);
        setAppliedUsers(response.data.appliedTalents);
      } else {
        console.warn("예상치 못한 응답 형식입니다:", response.data);
      }
    } catch (error) {
      console.error("신청한 유저 정보 불러오는 중 오류 발생:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchsetAppliedUsers();
  }, [fetchsetAppliedUsers]);

  // 매칭하기
  const fetchEduMatching = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();

      const matchingData = appliedUsers.map((user) => ({
        userId: user.userId,
      }));

      console.log("matchingData:", matchingData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER}api/post/${id}/match`,
        matchingData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        alert("매칭이 완료되었습니다!");
      }
    } catch (error) {
      console.error("매칭 중 오류 발생:", error);
    }
  }, [id, appliedUsers]);

  return (
    <PageWrapper>
      <ApplyUserBox>
        {appliedUsers.map((user) => (
          <ApplyUser key={user.userId}>
            <ApplyUserImg src={user.profileimage}></ApplyUserImg>
            <ApplyUserInfo>
              <ApplyUserName>{user.nickname}</ApplyUserName>
              <ApplyUserEmail>{user.email}</ApplyUserEmail>
            </ApplyUserInfo>
          </ApplyUser>
        ))}
      </ApplyUserBox>
      <MatchingBox>
        <MatchingBtn onClick={fetchEduMatching}>매칭하기</MatchingBtn>
      </MatchingBox>
    </PageWrapper>
  );
}

export default MatchingList;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Header = styled.div`
  width: 100%;
  height: 30px;
  padding: 40px 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const HeaderTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
`;

export const Back = styled.img`
  width: 10px;
  height: 20px;
  cursor: pointer;
  margin-right: 40px;
`;

export const ApplyUserBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ApplyUser = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 25px;
  margin: 10px 0;
`;

export const ApplyUserImg = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

export const ApplyUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const ApplyUserName = styled.div`
  font-weight: 700;
  margin-bottom: 3px;
`;

export const ApplyUserEmail = styled.div``;

export const MatchingBox = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  width: 361px;
  padding: 0 10px 20px 10px;
  background-color: #ffffff;
`;

export const MatchingBtn = styled.div`
  background-color: #d9b5ff;
  color: #ffffff;
  border-radius: 30.5px;
  height: 59px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
