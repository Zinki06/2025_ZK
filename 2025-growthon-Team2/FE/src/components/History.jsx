import styled from "styled-components";
import { convertObjToMap } from "../utils/convertObjToMap";
import EduApplyCard from "./EduApplyCard";
import { getPostsApiCall } from "../api/api";
import { useState, useEffect, useCallback } from "react";

function History() {
    const [userAppliedPosts, setUserAppliedPosts] = useState(null);

    const getPosts = useCallback(async () => {
        const data = await getPostsApiCall();
        return data;
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const posts = await getPosts();
            setUserAppliedPosts(posts);
        };
        fetchUserInfo();
    }, [getPosts]);

    console.log(userAppliedPosts?.appliedPosts);

    const edus =
        userAppliedPosts?.appliedPosts || [];

    return (
        <HistoryWrapper>
            <span>신청내역</span>
            <EduApplyCards>
                {edus.map((edu, index) => (
                    <EduApplyCard key={index} edu={edu} />
                ))}
            </EduApplyCards>
        </HistoryWrapper>
    );
}

const HistoryWrapper = styled.div`
    padding: 12px 16px;
    & > span {
        display: block;
        margin-bottom: 6px;
        color: #898989;
        font-weight: 500;
    }
`;

const EduApplyCards = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 8px 0;
`;

export default History;
