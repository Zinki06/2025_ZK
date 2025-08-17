import styled from "styled-components";

function Welcome({userInfo}) {
	return <WelcomeWrapper>
		<Success>검증 완료!</Success>
		<Hello>{userInfo?.nickname} 님 반가워요:&#41;</Hello>
	</WelcomeWrapper>
}

const Success = styled.h1`
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 12px;
`

const Hello = styled.span`
	font-size: 20px;
`

const WelcomeWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: end;
	align-items: center;
	margin-top: 49px;
	margin-bottom: 60px;
`

export default Welcome;