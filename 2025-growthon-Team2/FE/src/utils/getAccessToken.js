import axios from "axios";

export async function getAccessToken() {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_SERVER}api/auth/access-token`,
            {
                withCredentials: true,
            }
        );
        return response.data.token;
    } catch (error) {
        // console.error("AccessToken retrieval failed:", error);
        // Silent fail or return null, let caller handle
        return null;
    }
}
