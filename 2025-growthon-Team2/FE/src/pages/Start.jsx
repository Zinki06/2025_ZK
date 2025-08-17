import { useCallback } from "react";
import styled from "styled-components";
import MainLogo from "../image/mainlogo.png";
import SubLogo from "../image/headerLogo.png";
import KakaoIcon from "../image/kakao_logo.png";
import { KAKAO_LOGIN_URL } from "../utils/globals";

function StartPage() {
    const MoveToKakao = useCallback(() => {
        window.location.href = KAKAO_LOGIN_URL;
    }, []);

    return (
        <StartPageWrapper>
            <StartPageImage>
                <MainLogoImg src={MainLogo} alt="Gachitda" />
            </StartPageImage>
            <Logo>
                <SubLogoImg src={SubLogo} alt="Gachitda" />
            </Logo>
            <TitleBox>
                <Title>믿고 나눌 수 있는 따뜻한 연결,</Title>
                <Title>'같이잇다'와 함께 만들어가요</Title>
            </TitleBox>
            <LoginButton onClick={MoveToKakao}>
                <KakaoImg src={KakaoIcon} alt="kakao" />
                <span>카카오로 시작하기</span>
            </LoginButton>
        </StartPageWrapper>
    );
}

const StartPageWrapper = styled.div`
    padding: 20px 16px;
`;

const StartPageImage = styled.div`
    padding: 83px 61px;
    margin-top: 44px;
    text-align: center;
`;

const Logo = styled.div`
    padding: 0px 10px;
`;

const TitleBox = styled.div`
    padding: 10px 0px 10px 13px;
`;

const Title = styled.h1`
    font-size: clamp(16px, 6vw, 22px);
    font-weight: 600;
`;

const LoginButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 10px 0px;
    margin-top: 18px;
    border-radius: 10px;
    background: #fddc3f;
    font-size: 16px;
    width: 100%;
`;

const MainLogoImg = styled.img`
    width: clamp(100px, 40vw, 150px);
`;

const SubLogoImg = styled.img`
    height: 20px;
`;

const KakaoImg = styled.img`
    width: 40px;
    height: 40px;
    max-width: 100%;
`;

export default StartPage;
