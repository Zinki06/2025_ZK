import styled from "styled-components";
import { Link } from "react-router-dom";

function EduRegisterBtn({ children }) {
    return (
        <Link to="/edu/register">
            <EduRegisterBtnWrapper>{children}</EduRegisterBtnWrapper>
        </Link>
    );
}

const EduRegisterBtnWrapper = styled.button`
    padding: 10px 16px;
    border: none;
    font-weight: 500;
    background: #eeeeee;
    color: #8e8e8e;
    border-radius: 25px;
`;

export default EduRegisterBtn;
