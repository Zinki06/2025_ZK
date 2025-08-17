import styled from "styled-components";
import RoleList from "./RoleList";

function TempRoleSelection({ onClick }) {
    return (
        <TempRoleSelectionWrapper>
            <Description>
                신청자와 재능기부자 중 하나를 선택해주세요!
            </Description>
            <RoleList onClick={onClick} />
        </TempRoleSelectionWrapper>
    );
}

const Description = styled.span`
    font-size: 16px;
    color: #898989;
`;

const TempRoleSelectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
	align-items: center;
    margin-top: 26px;
`;

export default TempRoleSelection;
