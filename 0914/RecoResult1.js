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
            
                <InsideWrap>
                  <TextWrap>
                    <Text1>추천 결과</Text1>
                    <Text2>해당 사진과 비슷한 스타일인 다른 사진을 확인하세요</Text2>
                    <Text2>사진을 클릭하여 자세한 정보를 확인해보세요</Text2>
                  </TextWrap>
      
                  <Direction>
                    {topSimilarImages.map((image, index) => (
                      <Content key={index} onClick={() => handleImageClick(image.imagePath)}>
                        <Img src={image.imagePath} alt={`Similar Image ${index}`} width="378" height="482" />
                      </Content>
                    ))}
                  </Direction>
      
                  <InsideNextWrap>
                    <ButtonTwo onClick={handleGoHomeClick}>홈페이지 방문하기</ButtonTwo>
                    <ButtonTwo style={{ marginRight: 0 }} onClick={handleGoUploadClick}>
                      테스트 다시하기
                    </ButtonTwo>
                  </InsideNextWrap>
                </InsideWrap>
             
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
        /*border: 3px solid red;*/
    }
    `;

    const InsideWrap = styled.div`
    width: 100%;

    text-align: center;
    display: flex;
    flex-direction: column;
    //margin-top: 50px;
    align-items: center;
    `;



    const Direction = styled.div`
    display: flex;
    flex-direction: row;

    /* tablet 규격 */
    @media screen and (max-width: 1023px) {
        flex-direction: column;
    }
    `;
    const Content = styled.div`
    display: flex;
    justify-content: center;
    //flex-direction: column;
    align-items: center;
    flex-direction: row;

    /* s 데스크 */
    @media screen and (min-width: 1024px) {
        //margin-right:20px;
    }
    /* l 데스크 */
    @media screen and (min-width: 1700px) {
        //margin-right:40px;
    }
    `;

    const Row = styled.div`
    display: flex;
    margin-bottom: 20px;
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
    /* tablet 규격 */
        @media screen and (max-width: 1024px){
            width: 33vw;
            height: 31vh;
            //width:250px;
            //height:370px;
            
            
            border: 4px #798BE6 solid;
        }

        /* mobile 규격 */
        @media screen and (max-width: 540px){
            width: 43vw;
            height: 36vh;
            //width:160px;
            //height:280px;
            //margin-bottom:10px;
           
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

    const InsideNextWrap = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;

    width: 100%;
    //position: fixed;
    //margin-bottom: 40px;
    /* mobile 규격 */
    @media screen and (max-width: 540px) {
        margin-top: 15px;
    }
    `;

    const Radius = styled.button`
    //border: 6px #798BE6 solid;

    padding: 20px;
    word-wrap: break-word;
    border-radius: 21px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    margin-bottom: 20px;
    border: none;

    &:active {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        transform: translateY(4px);
    }
    `;

    const TextWrap = styled.div`
    border: 4px #798be6 solid;

    padding: 20px;
    word-wrap: break-word;
    border-radius: 21px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 25px;
    /* tablet 규격 */
    @media screen and (max-width: 1024px) {
        width: 70vw;
        height: 9vh;
    }

    /* mobile 규격 */
    @media screen and (max-width: 540px) {
        width: 80vw;
        height: 11.5vh;
        margin-bottom: 30px;
    }
    /* s 데스크 */
    @media screen and (min-width: 1025px) {
        width: 58vw;
        height: 11vh;
    }
    /* l 데스크 */
    @media screen and (min-width: 1700px) {
        height: 13vh;
    }
    `;

    const FontStyle = {
    "@media screen and (max-width: 1024px)": {
        fontSize: 22,
    },

    "@media screen and (max-width: 850px)": {
        fontSize: 21,
    },

    /* mobile 규격 */
    "@media screen and (max-width: 540px)": {
        fontSize: 19,
    },
    /* tablet 규격 */
    "@media screen and (min-width: 1025px)": {
        fontSize: 24,
    },
    "@media screen and (min-width: 1700px)": {
        fontSize: 37,
    },
    };

    const Text1FontStyle = {
    "@media screen and (max-width: 1024px)": {
        fontSize: 38,
    },

    "@media screen and (max-width: 850px)": {
        fontSize: 37,
    },

    /* mobile 규격 */
    "@media screen and (max-width: 540px)": {
        fontSize: 35,
    },
    /* tablet 규격 */
    "@media screen and (min-width: 1025px)": {
        fontSize: 40,
    },
    "@media screen and (min-width: 1700px)": {
        fontSize: 53,
    },
    };

    const Text1 = styled.text`
    /* font-size: 40px; */
    color: #798be6;
    font-weight: 600;
    margin-bottom: 13px;

    ${Text1FontStyle};
    `;

    const Text2 = styled.text`
    ${FontStyle};
    color: #798be6;
    font-weight: 500;
    margin-bottom: 10px;
    `;

    const Twrap = styled.div`
    border: 4px #798be6 solid;

    padding: 20px;
    word-wrap: break-word;
    border-radius: 21px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    width: 25vw;
    height: 18vh;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: row;
    margin-top: 20px;
    margin-bottom: 25px;

    @media screen and (max-width: 1024px) {
    }

    @media screen and (max-width: 850px) {
        width: 30vw;
        height: 11vh;
    }
    /* mobile 규격 */
    @media screen and (max-width: 540px) {
        width: 50vw;
        height: 14vh;
        margin-bottom: 30px;
    }

    /* s 데스크 */
    @media screen and (min-width: 1025px) {
    }
    /* l 데스크 */
    @media screen and (min-width: 1700px) {
        height: 14vh;
    }
    `;

    const ButtonTwo = styled(Radius)`
    background: #798be6;
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    cursor: pointer;

    ${FontStyle};

    color: white;
    //font-weight: 500;

    /* tablet 규격 */
    @media screen and (max-width: 1024px) {
        width: 33vw;
        height: 7vh;
        //font-size: 25px;
        margin-right: 10px;
    }

    @media screen and (max-width: 850px) {
        //font-size: 24px;
    }
    /* mobile 규격 */
    @media screen and (max-width: 540px) {
        width: 45.5vw;
        height: 8vh;
        margin-right: 10px;
    }
    /* s 데스크 */
    @media screen and (min-width: 1025px) {
        width: 25vw;
        height: 8vh;
        margin-right: 20px;
    }
    /* l 데스크 */
    @media screen and (min-width: 1700px) {
        width: 26vw;
        height: 7vh;
    }
    `;
