export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validateAuthNumber(number) {
    const regex = /^\d{4}$/;
    return regex.test(number);
}
