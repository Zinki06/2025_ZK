// API 호출 관련 함수들
import axios from "axios";
import { validateAuthNumber, validateEmail } from "../utils/validate";
import { getAccessToken } from "../utils/getAccessToken";

// 이메일 인증번호 요청함
export async function requestAuthNumber(email) {
    try {
        // 이메일 형식 검증
        if (!validateEmail(email)) return "validation";
        // 액세스 토큰 가져옴
        const accessToken = await getAccessToken();
        const response = await axios.post(
            `${import.meta.env.VITE_API_SERVER}api/auth/email`,
            { email },
            {
                headers: {
                    "Content-Type": "application/json", // axios 는 객체 전송 시 기본으로 JSON 헤더를 설정해주지만, 명시하셔도 됩니다.
                    Authorization: `Bearer ${accessToken}`,
                },
                // 만약 쿠키 기반 인증이나 크로스사이트 요청이 필요하다면 아래 옵션을 추가하세요.
                withCredentials: true,
            }
        );
        return "success";
    } catch (error) {
        const status = error.response?.status;
        if (status === 400) return "wrong";
        return "failed";
    }
}

// 인증번호 확인 및 역할 설정함
export async function checkAuthNumber(code, role) {
    try {
        // 인증번호 형식 검증
        if (!validateAuthNumber(code)) return "validation";
        // 액세스 토큰 가져옴
        const accessToken = await getAccessToken();
        const response = await axios.post(
            `${import.meta.env.VITE_API_SERVER}api/auth/email/verify`,
            { code },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );
        const response2 = await axios.post(
            `${import.meta.env.VITE_API_SERVER}api/role/my`,
            { role },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return "success";
    } catch (error) {
        console.log(error.response);
        const status = error.response?.status;
        if (status === 400) return "wrong";
        if (status === 422) return "expired";
        return "failed";
    }
}

// 사용자 정보 조회함
export async function getUserInfoApiCall() {
    try {
        const accessToken = await getAccessToken();
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_SERVER}api/user`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data;
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        throw error;
    }
}

export async function getPostsApiCall() {
    try {
        const accessToken = await getAccessToken();
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_SERVER}api/posts/my`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return data;
    } catch (error) {
        const status = error.response;
        console.log(status);
    }
}

export async function registerEduForm(
    title,
    subtitle,
    category,
    Description,
    address,
    teachAt
) {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.post(
            `${import.meta.env.VITE_API_SERVER}api/post`,
            { title, subtitle, category, Description, address, teachAt },
            {
                headers: {
                    "Content-Type": "application/json", // axios 는 객체 전송 시 기본으로 JSON 헤더를 설정해주지만, 명시하셔도 됩니다.
                    Authorization: `Bearer ${accessToken}`,
                },
                // 만약 쿠키 기반 인증이나 크로스사이트 요청이 필요하다면 아래 옵션을 추가하세요.
                withCredentials: true,
            }
        );
        return "success";
    } catch (error) {
        console.log(error.response);
        return "failed";
    }
}

export async function logout() {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.post(
            `${import.meta.env.VITE_API_SERVER}logout`,
            {
                headers: {
                    "Content-Type": "application/json", // axios 는 객체 전송 시 기본으로 JSON 헤더를 설정해주지만, 명시하셔도 됩니다.
                    Authorization: `Bearer ${accessToken}`,
                },
                // 만약 쿠키 기반 인증이나 크로스사이트 요청이 필요하다면 아래 옵션을 추가하세요.
                withCredentials: true,
            }
        );
        return "success";
    } catch(error) {
        console.log(error);
        return "failed";
    }
}

// export async function updateRole(role) {
//     try {
//         const accessToken = await getAccessToken();
//         const response2 = await axios.post(
//             `${import.meta.env.VITE_API_SERVER}api/role/my`,
//             { role },
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 withCredentials: true,
//             }
//         );
//         return "success";
//     } catch (error) {
//         console.log(error.response);
//         const status = error.response?.status;
//         if (status === 400) return "wrong";
//         if (status === 422) return "expired";
//         return "failed";
//     }
// }