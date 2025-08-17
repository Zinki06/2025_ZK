import * as H from "../css/HomeStyle";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import dropIcon from "../image/dropdown.png";
import EducationApplyCard from "../components/EducationApplyCard";
import RegionBottomSheet from "../components/RegionBottomSheet";
import CategoryBottomSheet from "../components/CategoryBottomSheet";
import { useOutletContext } from "react-router-dom";
import EduInfoCard from "../components/EduInfoCard";
import { getAccessToken } from "../utils/getAccessToken";

function Home() {
  // 교육 게시물 불러오기
  const [edus, setEdus] = useState([]);

  const fetchEdusData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER}api/posts`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.posts) {
        setEdus(response.data.posts);
      } else {
        console.warn("예상치 못한 응답 형식입니다:", response.data);
      }
    } catch (error) {
      // 네트워크 오류 또는 서버 오류 처리
      console.error("교육 데이터 로드 실패:", error.message || error);
      // 사용자에게 에러 메시지 표시 가능
      // alert('교육 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  }, []);

  useEffect(() => {
    fetchEdusData();
  }, [fetchEdusData]);

  // 게시물 검색
  const [searchEdu, setSearchEdu] = useState("");
  const handleSearchChange = (e) => {
    setSearchEdu(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // 사는 곳 필터링
  const [showRegionSheet, setShowRegionSheet] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleSelectRegion = (region) => {
    console.log("입력된 지역:", region);
    setSelectedAddress(region);
    setShowRegionSheet(false);
  };

  // 분야 필터링
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [selecteCategory, setSelectedCategory] = useState("");

  const handleSelectCategory = (category) => {
    console.log("선택된 분야:", category);
    setSelectedCategory(category);
    setShowCategorySheet(false);
  };

  const filteredEdus = edus.filter((edu) => {
    const matchesSearch = edu.title
      .toLowerCase()
      .includes(searchEdu.toLowerCase());
    const matchesAddress =
      selectedAddress === "" || edu.address.includes(selectedAddress);
    const matchesCategory =
      selecteCategory === "" || edu.category.includes(selecteCategory);
    return matchesSearch && matchesAddress && matchesCategory;
  });

  // 유저 관련
  const { userInfo } = useOutletContext();

  // 작성한 재능 기부 게시물 조회
  const [writtenPosts, setWrittenPosts] = useState([]);

  const fetchWrittenPosts = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER}api/posts/my`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data) {
        console.log("작성한 재능 기부 목록:", response.data);
        setWrittenPosts(response.data.writtenPosts);
      } else {
        console.warn("예상치 못한 응답 형식입니다:", response.data);
      }
    } catch (error) {
      // 인증 실패 또는 네트워크 오류 처리
      if (error.response?.status === 401) {
        console.error("인증 만료 또는 잘못된 토큰:", error);
      } else {
        console.error("작성한 게시물 로드 실패:", error.message || error);
      }
    }
  }, []);

  useEffect(() => {
    fetchWrittenPosts();
  }, [fetchWrittenPosts]);

  return (
    <H.PageWrapper>
      {userInfo ? (
        <>
          {userInfo.role === "giver" ? (
            <>
              <H.Welcome>
                {`어서오세요 :)\n${userInfo?.nickname} 재능기부자님!`}
              </H.Welcome>
              <H.EduInfos>
                {writtenPosts.map((post) => (
                  <EduInfoCard
                    key={post.postId}
                    id={post.postId}
                    nickname={userInfo?.nickname}
                    title={post.title}
                    subTitle={post.subtitle}
                    category={post.category}
                    address={post.address}
                    teachAt={post.teachAt}
                    userImg={userInfo?.profileimage}
                    appliedTalents={post.appliedTalents}
                  />
                ))}
              </H.EduInfos>
            </>
          ) : (
            <>
              <H.Welcome>{`${userInfo.nickname}님, 오늘도 좋은 배움이\n기다리고 있어요 :)`}</H.Welcome>
              <H.EduSearch onSubmit={handleSearch}>
                <H.SearchButton type="submit"></H.SearchButton>
                <H.SearchInput
                  value={searchEdu}
                  onChange={handleSearchChange}
                  placeholder="원하는 교육 분야를 검색해주세요!"
                />
              </H.EduSearch>
              <H.Filters>
                <H.FilterRe onClick={() => setShowRegionSheet(true)}>
                  사는 지역
                  <H.DropIcon src={dropIcon}></H.DropIcon>
                </H.FilterRe>
                <H.FilterCategory onClick={() => setShowCategorySheet(true)}>
                  분야<H.DropIcon src={dropIcon}></H.DropIcon>
                </H.FilterCategory>
              </H.Filters>
              <H.EduCards>
                {filteredEdus.map((edu) => (
                  <EducationApplyCard
                    key={edu.postId}
                    id={edu.postId}
                    writerId={edu.writerId}
                    title={edu.title}
                    subTitle={edu.subtitle}
                    category={edu.category}
                    teachAt={edu.teachAt}
                    createdAt={edu.createdAt}
                  />
                ))}
              </H.EduCards>
            </>
          )}
        </>
      ) : (
        <H.Welcome>로딩 중...</H.Welcome>
      )}
      {showRegionSheet && (
        <RegionBottomSheet
          onSelect={handleSelectRegion}
          onClose={() => setShowRegionSheet(false)}
        />
      )}
      {showCategorySheet && (
        <CategoryBottomSheet
          onSelect={handleSelectCategory}
          onClose={() => setShowCategorySheet(false)}
        />
      )}
    </H.PageWrapper>
  );
}

export default Home;
