import { useOutletContext } from "react-router-dom";
import Profile from "../components/Profile";
import Detail from "../components/Detail";
import Logout from "../components/Logout";
import History from "../components/History";
import styled from "styled-components";

function MyPage() {
    const { userInfo, auth } = useOutletContext();
    return (
        <MyPageWrapper>
            {<Profile userInfo={userInfo} auth={auth} />}
            {auth === "giver" ? (
                <Detail userInfo={userInfo} auth={auth} />
            ) : (
                <History />
            )}
            <Logout />
        </MyPageWrapper>
    );
}

const MyPageWrapper = styled.div`
    width: 100%;
`

export default MyPage;
