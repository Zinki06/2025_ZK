import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import "./css/App.css";
import Start from "./pages/Start";
import RoleSelection from "./pages/RoleSelection";
import Role from "./pages/Role";
import EmailVerification from "./pages/EmailVerification";
import VerificationSuccess from "./pages/VerificationSuccess";
import Main from "./pages/Main";
import Home from "./pages/Home";
import EducationApplyDetail from "./pages/EducationApplyDetail";
import MatchingList from "./pages/MatchingList";
import MyPage from "./pages/MyPage";
import EduRegister from "./pages/EduRegister";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <AppContainer>
            <Wrapper>
                <Routes>
                    <Route index element={<Start />} />
                    <Route element={<RoleSelection />}>
                        <Route path="role" element={<Role />} />
                        <Route
                            path="email-verification"
                            element={<EmailVerification />}
                        />
                        <Route
                            path="verification-success"
                            element={<VerificationSuccess />}
                        />
                    </Route>
                    <Route element={<Main />}>
                        <Route path="home" element={<Home />} />
                        <Route path="mypage" element={<MyPage />} />
                        <Route
                            path="edu/apply/:id"
                            element={<EducationApplyDetail />}
                        />
                        <Route
                            path="edu/matching/:id"
                            element={<MatchingList />}
                        />
                        <Route path="edu/register" element={<EduRegister />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Wrapper>
        </AppContainer>
    );
}

const AppContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 393px;
    position: relative;
    height: 100%;
`;

export default App;
