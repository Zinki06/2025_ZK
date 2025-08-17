import styled from "styled-components";

function Name({ $auth, $path, children }) {
    return (
        <NameWrapper $auth={$auth} $path={$path}>
            <span>{children}</span> <span>님</span>
        </NameWrapper>
    );
}

const NameWrapper = styled.h1`
    display: ${({ $auth }) => {
        return $auth !== "login" ? "block" : "none";
    }};
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: 500;
    span:last-child {
        display: ${({ $path }) => {
            return $path === "mypage" ? "inline" : "none";
        }};
    }
`;

export default Name;
