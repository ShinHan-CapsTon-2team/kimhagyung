import { React,useEffect  } from 'react';
import styled from "styled-components";
import { useLocation, useNavigate } from 'react-router-dom';

const RecoResult = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const topSimilarImages = location.state?.topSimilarImages || [];


    useEffect(() => {
        console.log('topSimilarImages:', topSimilarImages);
      }, [topSimilarImages]); // Add topSimilarImages as a dependency to trigger the log when it changes
    
    const navigate = useNavigate();

    const handleGoHomeClick = () => {
        navigate('/home');
    };

    const handleGoUploadClick = () => {
        navigate('/recoex');
    };

    const handleImageClick = (imagePath) => {
        // 이미지 상대 경로를 서버로 보내고 해당 게시물로 이동하는 로직을 구현
        fetch('http://localhost:4000/api/lookupByImage', {
          method: 'POST', // POST 요청 설정
          headers: {
            'Content-Type': 'application/json', // JSON 형태로 데이터 전송
          },
          body: JSON.stringify({ imageUrl: imagePath }), // 이미지 상대 경로를 JSON으로 변환하여 전송
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("받은 아이디:", data.id);
            if (data.id) {
              // 조회된 ID 값을 사용하여 해당 게시물로 이동
              navigate(`/lookup/${data.id}`);
            } else {
            alert('게시물을 찾을 수 없습니다.');
              console.error('게시물을 찾을 수 없습니다.');
            }
          })
          .catch((error) => {
            console.error('게시물 조회 중 오류:', error);
          });
      };
      
      


        return (
          <OutWrap>
            
            <S.InsideWrap>
                <S.TextWrap>
                    <S.Text1> 추천 결과</S.Text1>
                    <S.Text2> 해당 사진과 비슷한 스타일인 다른 사진을 확인하세요</S.Text2>
                    <S.Text2> 사진을 클릭하면 자세한 정보를 확인할 수 있습니다</S.Text2>
                </S.TextWrap>

       
                    {topSimilarImages.map((image, index) => (
                      <Content key={index} onClick={() => handleImageClick(image.imagePath)}>
                        <Img src={image.imagePath} alt={`Similar Image ${index}`} width="378" height="482" />
                      </Content>
                    ))} 
      
            <S.ButtonsWrap>
                    <S.ButtonTwo onClick={handleGoHomeClick}>홈페이지 방문하기</S.ButtonTwo>
                    <S.ButtonTwo style={{ marginRight: 0 }} onClick={handleGoUploadClick}>다시 매칭해보기</S.ButtonTwo>
                </S.ButtonsWrap>
            </S.InsideWrap>
             
          </OutWrap>
        );
      };
      
      export default RecoResult;

      const OutWrap = styled.div` 
      width: 100%;
      height: 100%;
  
      position: relative;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
  
      /* mobile 규격 */
      @media screen and (max-width: 840px) {
          height: calc(var(--vh, 1vh) * 100);
      }
      `;
  
      
  
      const Content = styled.div`
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
  
      @media screen and (max-width: 600px){
          flex-direction: column;
      }
      `;
  
  
      const Img= styled.img`
      border: 5px #798BE6 solid;
      border-radius: 31px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center; 
      overflow:hidden;
      cursor:pointer;
      //${({ isnotlast }) => isnotlast && "margin-right: 20px;"}
      margin-right: 20px;
      //width:350px;
      //height:470px;
  
      width: 24vw;
      height: 63vh;
     
      &:hover {
          border: 5px #4E62C5 solid;
      }
  
      margin-bottom:20px;
      /* tablet 규격 */
          @media screen and (max-width: 1024px){
              width: 33vw;
              height: 49vh;
              //width:250px;
              //height:370px;
              
              
              border: 4px #798BE6 solid;
          }
          @media screen and (max-width: 840px){
              width: 40vw;
              height: 45vh;
          }
          /* mobile 규격 */
          @media screen and (max-width: 540px){
              width: 83vw;
              height: 58vh;
              
              border: 4px #798BE6 solid;
          }
          /* s 데스크 */
          @media screen and (min-width: 1025px){
              
          }
          /* l 데스크 */
          @media screen and (min-width: 1700px){
              width: 26vw;
              height: 65vh;
              //width:470px;
              //height:590px;
              border: 8px #798BE6 solid;
              &:hover {
                  border: 8px #4E62C5 solid;
                }
          }
      
      `;
      const Img2= styled(Img)`
      @media screen and (max-width: 840px){
          margin-right:0px;
      }
      @media screen and (max-width: 540px){
          margin-right:0px;
      }
      `;
  
      const Img3= styled(Img)`
      @media screen and (max-width: 840px){
          margin-right:0px;
      }
      @media screen and (max-width: 540px){
          margin-right:0px;
      }
      `;