import styled from "styled-components";

function ProgressBar({ step }) {
    return (
        <ProgressBarWrapper>
            <Bar $num={0} step={step} />
            <Bar $num={1} step={step} />
            <Bar $num={2} step={step} />
        </ProgressBarWrapper>
    );
}

const ProgressBarWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    width: 100%;
`;

const Bar = styled.div`
    width: 115px;
    height: 1px;
    border-radius: 10px;
    background: ${(props) =>
        props.$num <= props.step ? "#D9B5FF" : "#D2D2D2"};
`;

export default ProgressBar;
