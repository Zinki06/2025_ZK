import styled from "styled-components";
import EduRegisterFields from "../components/EduRegisterFields";
import Button from "../components/Button";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerEduForm } from "../api/api";

const checkActivate = (
    selectedFields,
    titleRef,
    subtitleRef,
    contentRef,
    fromDateRef,
    toDateRef,
    placeRef
) => {
    if (
        selectedFields.length &&
        titleRef.current.value.length &&
        subtitleRef.current.value.length &&
        contentRef.current.value.length &&
        fromDateRef.current.value.length &&
        toDateRef.current.value.length &&
        placeRef.current.value.length
    )
        return true;
    return false;
};

function EduRegister() {
    const navigate = useNavigate();
    const [selectedFields, setSelectedFields] = useState([]);
    const titleRef = useRef("");
    const subtitleRef = useRef("");
    const contentRef = useRef("");
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const placeRef = useRef("");
    const [avail, setAvail] = useState(false);

    const handleSelectedFields = useCallback(
        (field) => {
            const curFields = [...selectedFields];
            if (curFields.includes(field))
                setSelectedFields(curFields.filter((value) => value !== field));
            else {
                curFields.push(field);
                setSelectedFields(curFields);
            }
        },
        [selectedFields, setSelectedFields]
    );

    const submitEduInfo = useCallback(async () => {
        try {
            // datetime-local 입력값을 Date 객체로 변환
            const fromDate = new Date(fromDateRef.current.value);
            // ISO 8601 형식으로 변환
            const fromDateISO = fromDate.toISOString();

            const flag = await registerEduForm(
                titleRef.current.value,
                subtitleRef.current.value,
                selectedFields.join(","),
                contentRef.current.value,
                placeRef.current.value,
                fromDateISO
            );
            if (flag === "failed") alert("등록 실패!");
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    }, [navigate, selectedFields]);

    useEffect(() => {
        const checkAvail = () => {
            const isAvail = checkActivate(
                selectedFields,
                titleRef,
                subtitleRef,
                contentRef,
                fromDateRef,
                toDateRef,
                placeRef
            );
            setAvail(isAvail);
        };

        // 모든 input 요소에 이벤트 리스너 추가
        const inputs = [
            titleRef,
            subtitleRef,
            contentRef,
            fromDateRef,
            toDateRef,
            placeRef,
        ];
        inputs.forEach((input) => {
            if (input.current) {
                input.current.addEventListener("input", checkAvail);
            }
        });

        // 초기 체크
        checkAvail();

        // 클린업 함수
        return () => {
            inputs.forEach((input) => {
                if (input.current) {
                    input.current.removeEventListener("input", checkAvail);
                }
            });
        };
    }, [selectedFields]);

    return (
        <EduRegisterForm
            onSubmit={(event) => {
                event.preventDefault();
            }}>
            <EduRegisterFormDiv>
                <h4>가르치려는 분야</h4>
                <EduRegisterFields
                    selectedFields={selectedFields}
                    setSelectedFields={handleSelectedFields}
                />
            </EduRegisterFormDiv>
            <EduRegisterFormDiv>
                <h4>제목</h4>
                <EduRegisterInput
                    ref={titleRef}
                    placeholder="제목을 작성해주세요."
                />
            </EduRegisterFormDiv>
            <EduRegisterFormDiv>
                <h4>부제목</h4>
                <EduRegisterInput
                    ref={subtitleRef}
                    placeholder="부제목을 작성해주세요."
                />
            </EduRegisterFormDiv>
            <EduRegisterFormDiv>
                <h4>재능 기부 내용</h4>
                <EduRegisterTextarea
                    ref={contentRef}
                    placeholder="주요 교육 내용과 교육 대상을 포함하여 100자 이내로 입력해주세요:)"
                />
            </EduRegisterFormDiv>
            <EduRegisterFormDiv>
                <h4>교육 기간</h4>
                <EduRegisterInput ref={fromDateRef} type="datetime-local" />
                <FromTo> ~ </FromTo>
                <EduRegisterInput ref={toDateRef} type="datetime-local" />
            </EduRegisterFormDiv>
            <EduRegisterFormDiv>
                <h4>교육 장소</h4>
                <EduRegisterInput
                    ref={placeRef}
                    placeholder="교육 장소를 구체적으로 작성해 주세요."
                />
            </EduRegisterFormDiv>
            <Button isDisabled={!avail} onClick={submitEduInfo}>
                확인
            </Button>
        </EduRegisterForm>
    );
}

const EduRegisterForm = styled.form`
    width: 100%;
    margin-top: 24px;
`;

const EduRegisterFormDiv = styled.div`
    padding: 0px 16px;
    margin-bottom: 30px;
    h4 {
        font-size: 16px;
        font-weight: 600;
        color: #989898;
        margin-bottom: 16px;
    }
`;

const EduRegisterInput = styled.input`
    border: none;
    font-weight: 400;
    background: #f9fafb;
    border-radius: 10px;
    padding: 12px 12px;
    width: 238px;
    outline: none;
    caret-color: #c48dff;
    &::placeholder {
        color: #8e8e8e;
        font-size: 14px;
        white-space: normal;
        box-sizing: border-box;
    }

    &[type="datetime-local"] {
        color: #8e8e8e;
        padding: 8px 12px;
        &::-webkit-calendar-picker-indicator {
            margin-left: 0;
            padding: 0;
        }
    }
`;

const EduRegisterTextarea = styled.textarea`
    border: none;
    font-weight: 400;
    background: #f9fafb;
    border-radius: 10px;
    padding: 12px 12px;
    width: 100%;
    resize: none;
    outline: none;
    caret-color: #c48dff;
`;

const FromTo = styled.span`
    color: #8e8e8e;
    font-size: 14px;
`;

export default EduRegister;
