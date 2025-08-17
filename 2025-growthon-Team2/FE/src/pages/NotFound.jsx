import styled from "styled-components";
import ErrorIcon from "../image/bang.png";
import { Link } from "react-router-dom";

function NotFound() {
    return <NotFoundWrapper>
		<ErrorTitle>404 Error</ErrorTitle>
		<ErrorDescription>요청하신 페이지를 찾을 수 없습니다.</ErrorDescription>
		<BackToHome to={"/home"}>홈으로 돌아가기</BackToHome>
		<ErrorImg src={ErrorIcon} alt="error" />
	</NotFoundWrapper>;
}

const NotFoundWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
	padding-bottom: 25px;
`

const ErrorTitle = styled.h1`
	font-weight: 500;
	font-size: 32px;
	margin-bottom: 4px;
`

const ErrorDescription = styled.span`
	display: block;
	font-size: 14px;
	margin-bottom: 24px;
`

const BackToHome = styled(Link)`
	font-weight: 600;
	font-size: 14px;
	margin-bottom: 40px;
	color: #C799F8;
`

const ErrorImg = styled.img`
	width: 47px;
	height: 48px;
`

export default NotFound;
