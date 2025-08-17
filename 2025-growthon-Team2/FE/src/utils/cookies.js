/**
 * 쿠키를 생성/업데이트 하는 함수
 * @param {string} name – 쿠키 이름
 * @param {string} value – 저장할 값
 * @param {number|Date} expires – 만료일(초 단위 경과 시간 또는 Date 객체)
 * @param {string} [path='/'] – 쿠키가 유효한 경로
 */
export function setCookie(name, value, expires, path = "/") {
  let exp;
  if (typeof expires === "number") {
    const d = new Date();
    d.setTime(d.getTime() + expires * 1000); // expires 초 뒤
    exp = d.toUTCString();
  } else if (expires instanceof Date) {
    exp = expires.toUTCString();
  } else {
    throw new Error("expires는 초 단위 숫자 또는 Date여야 합니다.");
  }

  document.cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `expires=${exp}`,
    `path=${path}`,
    `SameSite=Strict`, // CSRF 방어
    `Secure`, // HTTPS에서만 전달
  ].join("; ");
}

// 쿠키 읽기
export function getCookie(name) {
  const cookies = document.cookie.split("; ").reduce((acc, kv) => {
    const [k, v] = kv.split("=");
    acc[decodeURIComponent(k)] = decodeURIComponent(v);
    return acc;
  }, {});
  return cookies[name] || null;
}

// 쿠키 삭제 (expires를 과거로)
export function deleteCookie(name, path = "/") {
  document.cookie = `${encodeURIComponent(
    name
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}
