import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../utils/getAccessToken";
import { KAKAO_LOGIN_URL } from "../utils/globals";
import { getUserInfoApiCall } from "../api/api";

function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getAccessToken();
                if (!token) {
                    window.location.href = KAKAO_LOGIN_URL;
                    return;
                }

                const userInfo = await getUserInfoApiCall();

                // RoleSelection 관련 페이지들
                const roleSelectionPaths = [
                    "/role",
                    "/email-verification",
                    "/verification-success",
                ];

                // 이미 역할이 있는 사용자가 RoleSelection 페이지에 접근하려고 할 때
                if (
                    userInfo?.role &&
                    roleSelectionPaths.includes(location.pathname)
                ) {
                    console.log(
                        "User already has a role, redirecting to /home"
                    );
                    navigate("/home");
                    return;
                }

                // 역할이 없는 사용자가 메인 페이지에 접근하려고 할 때
                if (!userInfo?.role && location.pathname === "/home") {
                    console.log("User has no role, redirecting to /role");
                    navigate("/role");
                    return;
                }

                // RoleSelection 페이지들은 인증 체크만 하고 역할 체크는 하지 않음
                if (roleSelectionPaths.includes(location.pathname)) {
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    return;
                }

                // 다른 페이지들은 역할 체크
                if (!userInfo?.role) {
                    console.log("No role found, redirecting to /role");
                    navigate("/role");
                    return;
                }

                console.log("User is authenticated with role:", userInfo?.role);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Auth check failed:", error);
                window.location.href = KAKAO_LOGIN_URL;
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate, location]);

    if (isLoading) {
        return null;
    }

    return isAuthenticated ? children : null;
}

export default ProtectedRoute;
