import styled from "styled-components";
import Header from "../components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getUserInfoApiCall } from "../api/api";

function MainPage() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };
    const getUserInfo = useCallback(async () => {
        const data = await getUserInfoApiCall();
        return data;
    }, []);
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const fetchUserInfo = async () => {
            const data = await getUserInfo();
            setUserInfo(data);
        };
        fetchUserInfo();
    }, [getUserInfo]);
    const auth = userInfo?.role;
    return (
        <MainPageWrapper>
            <Header moveBack={handleBack} />
            <Outlet context={{ userInfo, auth }} />
        </MainPageWrapper>
    );
}

const MainPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default MainPage;
