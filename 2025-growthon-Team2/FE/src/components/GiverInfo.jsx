import styled from "styled-components";

function GiverInfo() {
    return (
        <GiverInfoWrapper>
            교육 분야 <span>|</span> <span>코딩</span>
        </GiverInfoWrapper>
    );
}

const GiverInfoWrapper = styled.span`
    margin-bottom: 14px;
    font-weight: 500;
    span {
        color: #989898;
    }
    span:last-child {
        color: #c48dff;
    }
`;

export default GiverInfo;
