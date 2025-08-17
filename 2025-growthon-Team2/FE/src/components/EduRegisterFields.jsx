import { useRef } from "react";
import styled from "styled-components";

function getFieldsInfoFromServer() {
    return ["IT/코딩", "디자인", "음악", "외국어", "학습 멘토링", "경제 기초"];
}

function EduRegisterFields({ selectedFields, setSelectedFields }) {
    const fieldsRef = useRef(getFieldsInfoFromServer());
    return (
        <FieldsWrapper>
            {fieldsRef.current.map((field, index) => (
                <Field
                    key={index}
                    $isselected={selectedFields.includes(field).toString()}
                    onClick={() => {
                        setSelectedFields(field);
                    }}>
                    {field}
                </Field>
            ))}
        </FieldsWrapper>
    );
}

const FieldsWrapper = styled.div`
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
`;

const Field = styled.div`
    padding: 8px 14px;
    color: ${(props) => (props.$isselected === "true" ? "#FFFFFF" : "#8E8E8E")};
    border-radius: 22px;
    margin-right: 10px;
    margin-bottom: 7px;
    font-size: 14px;
    background: ${(props) =>
        props.$isselected === "true" ? "#D3A9FF" : "#EEEEEE"};
`;

export default EduRegisterFields;
