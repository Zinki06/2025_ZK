import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logout } from "../api/api";
import { useCallback } from "react";
import { deleteCookie } from "../utils/cookies";

function Logout() {
    const navigate = useNavigate();
    const tryLogout = useCallback(async () => {
        const flag = await logout();
        if (flag === "failed") {
            alert("로그아웃 실패!");
            return;
        }
        localStorage.removeItem("accessToken");
        deleteCookie("accessToken");
        alert("로그아웃 성공 ✅");
        navigate("/");
    }, [navigate]);
    return (
        <LogoutWrapper>
            <LogoutButton onClick={tryLogout}>로그아웃 하기</LogoutButton>
        </LogoutWrapper>
    );
}

const LogoutWrapper = styled.div`
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    padding: 6px 21px 5px 21px;
    width: 100%;
`;

const LogoutButton = styled.button`
    border: none;
    color: red;
    font-size: 14px;
    background: none;
`;

export default Logout;
