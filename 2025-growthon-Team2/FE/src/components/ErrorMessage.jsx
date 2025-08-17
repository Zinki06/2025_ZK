import styled from "styled-components";

const getMessage = (isRequestEmail, check) => {
    if (!isRequestEmail) {
        if (check === "validation") return "잘못된 이메일 형식입니다!";
        if (check === "wrong") return "없는 이메일입니다! 다시 시도해주세요.";
        if (check === "failed")
            return "인증 번호 전송에 실패했습니다!30초 후 다시 시도해주세요.";
    }
    if (check === "validation") return "인증번호가 잘못된 형식입니다!";
    if (check === "expired")
        return "인증번호가 만료되었어요! 다시 시도해주세요.";
    if (check === "wrong")
        return "일치하지 않은 인증번호입니다! 30초 후 다시 시도해주세요.";
    return "알 수 없는 오류입니다.";
};

function ErrorMessage({ isRequestEmail, check }) {
    const msg = getMessage(isRequestEmail, check);
    return <Message $check={check}>*{msg}</Message>;
}

const Message = styled.span`
    display: ${({ $check }) => {
        return $check === "success" || $check === "" ? "none" : "block";
    }};
    margin-top: 4px;
    color: #fd7979;
`;

export default ErrorMessage;
