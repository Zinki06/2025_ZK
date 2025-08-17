import { useState } from "react";
import styled, { css } from "styled-components";

function RoleListItem({ type, onClick, children, isSelected }) {
    return (
        <RoleListItemButton
            onClick={() => onClick(type)}
            $selected={isSelected}>
            {children}
        </RoleListItemButton>
    );
}

function RoleList({ onClick }) {
    const [selectedType, setSelectedType] = useState(null);

    const handleClick = (type) => {
        setSelectedType(type);
        onClick(type);
    };

    return (
        <RoleListWrapper>
            <RoleListItem
                type="learner"
                onClick={handleClick}
                isSelected={selectedType === "learner"}>
                신청자
            </RoleListItem>
            <RoleListItem
                type="giver"
                onClick={handleClick}
                isSelected={selectedType === "giver"}>
                재능기부자
            </RoleListItem>
        </RoleListWrapper>
    );
}

const RoleListItemButton = styled.button`
    border: none;
    border-radius: 10px;
    background: #f9fafb;
    color: #c48dff;
    text-align: center;
    width: 177px;
    height: 80px;
    transition: background 0.2s, border 0.2s;

    /* transient prop($selected)이 true면 “선택된” 스타일을 유지 */
    ${(props) =>
        props.$selected &&
        css`
            background: #f9f4ff;
            border: 1px solid #c48dff;
            outline: none;
        `}
`;

const RoleListWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
`;

export default RoleList;
