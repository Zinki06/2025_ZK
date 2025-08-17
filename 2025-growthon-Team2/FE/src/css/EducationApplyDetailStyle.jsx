import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Header = styled.div`
  width: 100%;
  height: 30px;
  padding: 40px 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const HeaderTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
`;

export const Back = styled.img`
  width: 10px;
  height: 20px;
  cursor: pointer;
  margin-right: 40px;
`;

export const Tags = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 40px;
`;

export const Category = styled.div`
  background-color: #e6f1ff;
  color: #4994f7;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: small;
  padding: 5px 13px;
  border-radius: 15px;
  margin-right: 10px;
`;

export const Region = styled.div`
  background-color: #f9f4ff;
  color: #c48dff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: small;
  padding: 5px 13px;
  border-radius: 15px;
`;

export const Title = styled.div`
  white-space: pre-line;
  width: 100%;
  padding: 20px 40px 15px 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 22px;
  font-weight: 700;
  line-height: 28x;
`;

export const SubTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  padding: 0px 40px;
`;

export const VolInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #808080;
  font-size: 12px;
  padding: 0px 40px;
`;

export const InfoName = styled.div`
  font-weight: 800;
  margin-right: 5px;
`;

export const EduTime = styled.div`
  font-size: 12px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #808080;
  padding: 0px 40px;
  margin: 5px 0 10px 0;
`;

export const EduTimeTitle = styled.div`
  font-weight: 600;
  margin-right: 5px;
`;

export const EduTimeDetail = styled.div``;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #ececec;
  width: 90%;
  margin: 10px 0;
`;

export const Content = styled.div`
  width: 100%;
  padding: 20px 40px;
  white-space: pre-line;
  font-size: 15px;
`;

export const ApplyBox = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  width: 361px;
  padding: 0 10px 20px 10px;
  background-color: #ffffff;
`;

export const ApplyBtn = styled.div`
  background-color: #d9b5ff;
  color: #ffffff;
  border-radius: 30.5px;
  height: 59px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
