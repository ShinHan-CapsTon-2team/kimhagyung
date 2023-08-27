import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DropMenu = styled.div` 
  position: absolute;
  background-color: white;
  //border: 1px solid #ccc;
  padding: 10px;
  border-radius: 30px;
  z-index: 9999;

  //text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  top: 100px;
  right:80px;


  /* tablet 규격 */
        @media screen and (max-width: 1023px){
            
        }

        /* mobile 규격 */
        @media screen and (max-width: 540px){
          width:45vw;
          //top: -147px;
        }
        /* s 데스크 */
        @media screen and (min-width: 1024px){
          width:15vw;
        }
        /* l 데스크 */
        @media screen and (min-width: 1700px){
          width:20vw;
          top: 120px;
        }
`;

const CateMenu = styled.div` 
  font-size: 25px;
  margin-top:5px;

  /* tablet 규격 */
        @media screen and (max-width: 1023px){
            
        }

        /* mobile 규격 */
        @media screen and (max-width: 540px){
            
        }
        /* s 데스크 */
        @media screen and (min-width: 1024px){
          
        }
        /* l 데스크 */
        @media screen and (min-width: 1700px){
          font-size: 30px;
        }
`;
    // 자기 프로필 가는거 처리하기 App js 참고  
export const ProandLogout = () => {

    const navigate = useNavigate();
    const onGoProfile = () => {
        
    };

    const onNaverLogout = () => {
      // 로그아웃 처리 코드
      localStorage.removeItem('access_token');
      console.log("로그아웃 되었습니다.");
      navigate('/home');
  };

    return
    (
        <DropMenu>
            <CateMenu onClick={onGoProfile}>마이프로필</CateMenu>  
            <CateMenu onClick={onNaverLogout}> 로그아웃 </CateMenu>          
        </DropMenu>
    );
};