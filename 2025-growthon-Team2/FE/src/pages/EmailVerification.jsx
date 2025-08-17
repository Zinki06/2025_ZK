import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "../components/Button";
import EmailAuth from "../components/EmailAuth";
import ErrorMessage from "../components/ErrorMessage";

function EmailVerification() {
    const {
        tempRole,
        setTempRole,
        moveNextPage,
        emailAuthRef,
        check,
        isRequestEmail,
    } = useOutletContext();
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const savedRole = localStorage.getItem("tempRole");
        setTempRole(savedRole);

        const checkInputValue = () => {
            if (emailAuthRef.current) {
                setInputValue(emailAuthRef.current.value);
            }
        };

        const inputElement = emailAuthRef.current;
        if (inputElement) {
            inputElement.addEventListener("input", checkInputValue);
        }

        checkInputValue();

        return () => {
            if (inputElement) {
                inputElement.removeEventListener("input", checkInputValue);
            }
        };
    }, []);
    
    return (
        <>
            {tempRole === "giver" && (
                <EmailAuth
                    emailAuthRef={emailAuthRef}
                    isRequestEmail={isRequestEmail}
                />
            )}
            {tempRole === "giver" && <ErrorMessage isRequestEmail={isRequestEmail} check={check} />}
            <Button
                isDisabled={tempRole === "giver" && !inputValue}
                onClick={moveNextPage}>
                확인
            </Button>
        </>
    );
}

export default EmailVerification;
