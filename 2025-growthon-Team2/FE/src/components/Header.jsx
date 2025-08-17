import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from "../image/back.png";
import MyIcon from "../image/goToMy.png";
import HeaderLogo from "../image/headerLogo.png";

const checkAvailBackBtn = (pathname) => {
  return !(
    pathname === "/home"
  );
};

const checkAvailPageName = (pathname) => {
  const whiteList = [
    {
      path: "/mypage",
      name: "프로필",
    },
    { path: "/edu/apply", name: "학습 신청" },
    { path: "/edu/register", name: "교육 정보 등록하기" },
    { path: "/edu/matching", name: "신청자 목록" },
  ];
  let name = "";
  whiteList.map((item) => {
    if (pathname.indexOf(item.path) !== -1) name = item.name;
  });
  return name;
};

const checkAvailLogo = (pathname) => {
  return pathname === "/home";
};

function Header({ moveBack }) {
  const { pathname } = useLocation();
  const isAvailBackBtn = checkAvailBackBtn(pathname);
  const pageName = checkAvailPageName(pathname);
  const isAvailLogo = checkAvailLogo(pathname);
  const navigate = useNavigate();

  return (
    <HeaderWrapper $pathname={pathname}>
      <HeaderDivider>
        {isAvailBackBtn && (
          <BackButton onClick={moveBack}>
            <BackImage src={BackIcon} alt="back" />
          </BackButton>
        )}
        {isAvailLogo && <Logo src={HeaderLogo}></Logo>}
        {pageName && <PageName>{pageName}</PageName>}
      </HeaderDivider>
      <HeaderDivider></HeaderDivider>
      <HeaderDivider>
        {isAvailLogo && (
          <GoToMy>
            <HeaderMyImg
              src={MyIcon}
              alt="alarm"
              onClick={() => navigate("/mypage")}
            />
          </GoToMy>
        )}
      </HeaderDivider>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  display: flex;
  height: ${({ $pathname }) => {
    return $pathname.indexOf("edu") !== -1 ? "64px" : "40px";
  }};
  align-items: center;
  margin-top: 10px;
  padding: 0 20px;
  width: 100%;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  margin-right: 28px;
`;

const PageName = styled.h1`
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
`;

const Logo = styled.img`
  width: 104px;
  height: 19px;
`;

const HeaderDivider = styled.div`
  width: 33.33%;
  display: flex;
  &:last-child {
    justify-content: flex-end;
  }
`;

const GoToMy = styled.div`
  height: 18px;
  width: 17px;
`;

const HeaderMyImg = styled.img`
  height: 18px;
  width: 17px;
`;

const BackImage = styled.img`
  width: 10px;
  height: 20px;
`;

export default Header;
