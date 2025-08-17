import styled from "styled-components";
import { convertObjToMap } from "../utils/convertObjToMap";

function DetailLine({ info, $auth }) {
    const [key, value] = info;
    return (
        <DetailLineWrapper $auth={$auth}>
            {key} <span>{value}</span>
        </DetailLineWrapper>
    );
}

function Detail({ userInfo, auth }) {
    const userDetailData = Array.from(
        convertObjToMap(
            auth === "giver"
                ? {
                      ID: userInfo?.kakaomail,
                      "학교 메일": userInfo?.email,
                  }
                : {
                      이름: userInfo?.nickname,
                      "카카오 ID": userInfo?.kakaomail,
                  }
        ).entries()
    );
    return (
        <DetailWrapper $auth={auth}>
            {userDetailData.map((value, index) => (
                <DetailLine key={index} info={value} $auth={auth} />
            ))}
        </DetailWrapper>
    );
}

const DetailLineWrapper = styled.h4`
    font-size: 16px;
    font-weight: 700;
    white-space: ${({ $auth }) => {
        return $auth === "giver" ? "normal" : "nowrap";
    }};
    span {
        font-weight: 400;
        color: #242424;
    }
`;

const DetailWrapper = styled.div`
    display: ${({ $auth }) => {
        return $auth === "learner" ? "none" : "flex";
    }};
    flex-direction: column;
    align-items: ${({ $auth }) => {
        return $auth === "giver" ? "start" : "center";
    }};
    gap: ${({ $auth }) => {
        return $auth === "giver" ? "10px" : "6px";
    }};
    padding: 30px 72px;
`;

export default Detail;
