import styled from "styled-components";

function Input({ type, value, onChange, placeholder, name, required }) {
    return (
        <InputWrapper
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            name={name}
            required={required}
        />
    );
}

const InputWrapper = styled.input`
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    background-color: #fff;
    transition: border-color 0.2s;

    &::placeholder {
        color: #999;
    }

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

export default Input;
