import styled from "styled-components";
import searchIcon from "../image/searchIcon.png";

export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 41px;
    padding: 0 20px;
    margin-top: 10px;
`;

export const Logo = styled.div`
    background-color: rebeccapurple;
`;

export const Alarm = styled.img`
    height: 18px;
    width: 17px;
`;

export const Welcome = styled.div`
    white-space: pre-line;
    width: 100%;
    padding: 0 30px;
    text-align: left;
    margin: 20px 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 33px;
`;

export const EduSearch = styled.form`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 20px;
`;

export const SearchInput = styled.input`
    background-color: #efefef;
    border: none;
    border-radius: 0 10px 10px 0;
    width: 100%;
    height: 37px;

    &::placeholder {
        color: #808080;
    }
`;

export const SearchButton = styled.button`
    background-color: #efefef;
    width: 37px;
    height: 37px;
    border: none;
    border-radius: 10px 0 0 10px;
    cursor: pointer;
    background-image: url(${searchIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 15px;
`;

export const Filters = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    margin: 20px 0 10px 0;
`;

export const FilterRe = styled.div`
    border-radius: 30px;
    border: 1px solid black;
    font-size: 13px;
    font-weight: 600;
    padding: 5px 8px;
    margin-right: 5px;
`;

export const DropIcon = styled.img`
    width: 10px;
    height: 6px;
    margin-left: 4px;
`;

export const FilterCategory = styled.div`
    border-radius: 30px;
    border: 1px solid black;
    font-size: 13px;
    font-weight: 600;
    padding: 5px 8px;
`;

export const EduCards = styled.div`
    margin-bottom: 70px;
    width: 100%;
`;

export const EduInfos = styled.div`
    width: 100%;
    margin-bottom: 70px;
`;
