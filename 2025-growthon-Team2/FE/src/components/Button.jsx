import styled from "styled-components";

function Button({ isDisabled, onClick, children }) {
    const boolString = isDisabled?.toString();
    return (
        <ButtonWrapper
            $isdisabled={boolString}
            onClick={() => {
                if (boolString === "true") return;
                onClick();
            }}>
            {children}
        </ButtonWrapper>
    );
}

const ButtonWrapper = styled.button`
    background: ${(props) =>
        props.$isdisabled === "true" ? "#D2D2D2" : "#D9B5FF"};
    padding: 20px 166px;
    border: none;
    border-radius: 50px;
    color: #ffffff;
    position: fixed;
    bottom: 20px;
    cursor: ${(props) =>
        props.$isdisabled === "true" ? "not-allowed" : "pointer"};
`;

export default Button;
