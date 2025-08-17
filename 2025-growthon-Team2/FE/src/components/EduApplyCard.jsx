import styled from "styled-components";

function EduApplyCard({ edu }) {
    console.log(edu);
    return (
        <EduApplyCardWrapper>
            <GiverName>{edu.writerName}</GiverName>
            <EduTitle>{edu.title}</EduTitle>
            <EduDetail>
                <EduSubtitle>{edu.subtitle}</EduSubtitle>
                <EduIsdoing $status={edu.status}>{edu.status}</EduIsdoing>
            </EduDetail>
        </EduApplyCardWrapper>
    );
}

const EduApplyCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px 14px;
    background: #f9fafb;
    border-radius: 10px;
`;

const GiverName = styled.span`
    font-weight: 500;
    font-size: 10px;
    color: #808080;
    margin-bottom: 6px;
`;

const EduTitle = styled.h4`
    font-weight: 600;
    font-size: 14px;
    color: #808080;
    margin-bottom: 4px;
`;

const EduDetail = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 7px;
`;

const EduSubtitle = styled.span`
    font-weight: 500;
    font-size: 12px;
    color: #808080;
`;

const EduIsdoing = styled.div`
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 10px;
    background-color: ${({ $status }) => {
        return $status === "완료"
            ? "#C9ECFF"
            : $status === "진행 중"
            ? "#DCFADB"
            : "#ECECEC";
    }};
    color: ${({ $status }) => {
        return $status === "완료"
            ? "#006CFA"
            : $status === "진행 중"
            ? "#0AC100"
            : "#000000";
    }};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default EduApplyCard;
