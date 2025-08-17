import styled from "styled-components";

const getCurInstruction = (isRequestEmail) => {
    if (isRequestEmail)
        return (
            <>
                <AuthInstruction>
                    이메일을 인증번호가 전송되었습니다.
                </AuthInstruction>
                <AuthInstruction>
                    인증번호 4자리를 입력해주세요.
                </AuthInstruction>
            </>
        );
    return (
        <AuthInstruction>
            인증을 위해 학교 이메일을 작성해주세요!
        </AuthInstruction>
    );
};

function EmailAuth({ emailAuthRef, isRequestEmail }) {
    const title = getCurInstruction(isRequestEmail);
    return (
        <EmailAuthWrapper>
            {title}
            <Input
                ref={emailAuthRef}
                $isrequestemail={isRequestEmail.toString()}
                placeholder={!isRequestEmail ? "example_1234@.com" : ""}
            />
        </EmailAuthWrapper>
    );
}

const EmailAuthWrapper = styled.div`
    margin-top: 43px;
`;

const AuthInstruction = styled.span`
    color: #898989;
    display: block;
`;

const Input = styled.input`
    border: none;
    border-bottom: 1px solid #b8b8b8;
    padding: 8px 0px;
    width: 100%;
    margin-top: 24px;
    font-size: ${({ $isrequestemail }) => {
        return $isrequestemail === 'true' ? "24px" : "16px";
    }};16px;
    outline: none;
    caret-color: #c48dff;
    &::placeholder {
        color: #b8b8b8;
    }
`;

export default EmailAuth;
