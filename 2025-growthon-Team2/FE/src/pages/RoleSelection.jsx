import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../components/PrgressBar";
import Header from "../components/Header";
import {
    getUserInfoApiCall,
    checkAuthNumber,
    requestAuthNumber,
} from "../api/api";

function RoleSelection() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

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

    const routes = ["/role", "/email-verification", "/verification-success"];
    const [step, setStep] = useState(() => {
        // 초기 step 값을 localStorage에서 가져온 정보를 기반으로 설정
        if (pathname === "/verification-success") {
            return 2;
        } else if (pathname === "/email-verification") {
            return 1;
        } else {
            return 0;
        }
    });

    const [tempRole, setTempRole] = useState(
        localStorage.getItem("tempRole") || ""
    );
    const [isRequestEmail, setIsRequestEmail] = useState(false);
    const [check, setCheck] = useState("");
    const emailAuthRef = useRef(null);

    const moveNextPage = useCallback(async () => {
        // 마지막 단계(verification-success)에서 확인 버튼 클릭 시 /home으로 이동
        if (pathname === "/verification-success") {
            navigate("/home");
            return;
        }

        if (step === 0) {
            localStorage.setItem("tempRole", tempRole);
            // 신청자(learner) 선택 시 이메일 인증 없이 바로 검증완료 페이지로 이동
            if (tempRole === "learner") {
                localStorage.setItem("isEmailVerified", "true");
                setStep(2);
                navigate("/verification-success");
                return;
            }
        }
        if (tempRole === "giver" && pathname === "/email-verification") {
            if (!isRequestEmail) {
                const flag = await requestAuthNumber(
                    emailAuthRef.current.value
                );
                console.log(flag);
                setCheck(flag);
                if (flag === "success") {
                    setIsRequestEmail(true);
                    emailAuthRef.current.value = "";
                }
                return;
            }
            const flag = await checkAuthNumber(
                emailAuthRef.current.value,
                tempRole
            );
            setCheck(flag);
            emailAuthRef.current.value = "";
            if (flag !== "success") return;

            // 이메일 인증 성공 시 플래그 설정
            localStorage.setItem("isEmailVerified", "true");
        }
        setStep(step + 1);
        navigate(routes[step + 1]);
    }, [routes, navigate, step, tempRole, setCheck, isRequestEmail, pathname]);

    const movePrevPage = useCallback(() => {
        if (step === 0) {
            navigate("/");
            return;
        }
        setIsRequestEmail(false);
        setCheck("");
        const prevStep = step - 1;
        setStep(prevStep);
        navigate(routes[prevStep], { replace: true });
    }, [routes, navigate, step]);

    const selectTempRole = useCallback(
        (select) => {
            setTempRole(select);
        },
        [setTempRole]
    );

    useEffect(() => {
        const savedRole = localStorage.getItem("tempRole");
        if (savedRole) {
            setTempRole(savedRole);
        }
    }, []);

    useEffect(() => {
        const currentStep = routes.indexOf(pathname);
        if (currentStep !== -1 && currentStep !== step) {
            setStep(currentStep);
        }
    }, [pathname, routes, step]);

    return (
        <RoleSelectionWrapper>
            <ProgressBar step={step} />
            <Header moveBack={movePrevPage} />
            <Outlet
                context={{
                    routes,
                    step,
                    setStep,
                    userInfo,
                    emailAuthRef,
                    moveNextPage,
                    movePrevPage,
                    tempRole,
                    setTempRole,
                    selectTempRole,
                    check,
                    isRequestEmail,
                }}
            />
        </RoleSelectionWrapper>
    );
}

const RoleSelectionWrapper = styled.div`
    padding: 10px 16px 20px 16px;
`;

export default RoleSelection;
