import * as D from "../css/EducationApplyDetailStyle";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken";

function EducationDetail() {
  const { id } = useParams();

  // 교육 게시물 상세 정보 조회
  const [eduDetail, setEduDetail] = useState({});

  const fetchEduDetail = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER}api/post/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data) {
        console.log("게시물 상세 정보:", response.data);
        setEduDetail(response.data);
      } else {
        console.warn("예상치 못한 응답 형식입니다:", response.data);
      }
    } catch (error) {
      // 게시물 로드 실패 시 에러 처리
      console.error("게시물 상세정보 로드 실패:", error.message || error);
      if (error.response?.status === 404) {
        alert('존재하지 않는 게시물입니다.');
      }
    }
  }, [id]);

  useEffect(() => {
    fetchEduDetail();
  }, [fetchEduDetail]);

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

  // 신청하기
  const fetchEduApply = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();

      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER}api/post/${id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        alert("신청이 완료되었습니다!");
      }
    } catch (error) {
      // 신청 처리 실패 시 에러 처리
      console.error("신청 처리 실패:", error.message || error);
      if (error.response?.status === 409) {
        alert('이미 신청한 교육입니다.');
      } else if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert('신청에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }, []);

  return (
    <D.PageWrapper>
      <D.Tags>
        <D.Category>{eduDetail.category}</D.Category>
        <D.Region>{eduDetail.address}</D.Region>
      </D.Tags>
      <D.Title>{`${eduDetail.title}`}</D.Title>
      <D.SubTitle>{eduDetail.subtitle}</D.SubTitle>
      <D.VolInfo>
        <D.InfoName>{eduDetail.writerName}</D.InfoName>
      </D.VolInfo>
      <D.EduTime>
        <D.EduTimeTitle>교육 시간</D.EduTimeTitle>
        <D.EduTimeDetail>{`${formatTeachAt(
          eduDetail.teachAt
        )}`}</D.EduTimeDetail>
      </D.EduTime>
      <D.Divider></D.Divider>
      <D.Content>{eduDetail.Description}</D.Content>
      <D.ApplyBox>
        <D.ApplyBtn onClick={fetchEduApply}>신청하기</D.ApplyBtn>
      </D.ApplyBox>
    </D.PageWrapper>
  );
}

export default EducationDetail;
