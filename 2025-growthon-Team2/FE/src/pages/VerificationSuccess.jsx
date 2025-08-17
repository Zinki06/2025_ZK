import { useOutletContext } from "react-router-dom";
import Welcome from "../components/Welcome";
import Profile from "../components/Profile";
import Detail from "../components/Detail";
import Button from "../components/Button";

function VerificationSuccess() {
    const { userInfo, tempRole, moveNextPage } = useOutletContext();
    return (
        <>
            <Welcome userInfo={userInfo} />
            <Profile userInfo={userInfo} auth={tempRole} />
            <Detail userInfo={userInfo} auth={tempRole} />
            <Button isDisabled="false" onClick={moveNextPage}>
                확인
            </Button>
        </>
    );
}

export default VerificationSuccess;
