import { React, useState, useEffect } from 'react';
import styled from "styled-components";
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { useLocation, useNavigate } from 'react-router-dom';

const Quizresult = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const topSimilarImages = location.state?.topSimilarImages || [];
    const [loading, setLoading] = useState(true); // 초기값을 true로 설정

    const navigate = useNavigate();

    const handleGoHomeClick = () => {
        navigate('/home');
    };

    const handleGoUploadClick = () => {
        navigate('/post');
    };

    useEffect(() => {
        // 데이터 로딩이 완료되면 setLoading(false)로 변경
        if (topSimilarImages.length > 0) {
            setLoading(false);
        }
    }, [topSimilarImages]); // topSimilarImages 데이터가 변경될 때만 실행

    return (
        <OutWrap>
            {topSimilarImages.length !== 3 ? (
                <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <ClimbingBoxLoader color={'#36a9d6'} loading={loading} size={100} />
                </div>
            ) : (
                <>
                    <InsideWrap>
                        {topSimilarImages.map((image, index) => (
                            <Content key={index}>
                                <OneImg src={image.imagePath} alt={`Similar Image ${index}`} width="378" height="482" />
                            </Content>
                        ))}
                    </InsideWrap>

                    <InsideNextWrap> 
                        <ButtonTwo style={{ marginRight: 30 }}>                         
                            <Menu onClick={handleGoHomeClick}>
                                홈페이지 방문하기
                            </Menu>
                        </ButtonTwo>
                        <ButtonTwo>                         
                            <Menu onClick={handleGoUploadClick}>
                                테스트 다시 하기
                            </Menu>
                        </ButtonTwo>
                    </InsideNextWrap>
                </>
            )}
        </OutWrap>
    );
};

export default Quizresult;


const OutWrap = styled.div`
    width: 100%;
    height: 97.6vh;

    position: relative;
    background: white;
    display: flex;
    flex-direction: column;
    //justify-content: center;
    align-items: center;
`;
const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

    const InsideWrap = styled.div`

        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 50px;
        
        @media screen and (min-width: 1600px) {
            margin-top: 70px; 
            
        }; 
    `;

    const OneImg = styled.img`
        width: 27vw;
        height: 65vh;
        opacity: 0.90;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 31px;
        border: 4px #3A76EF solid;
        margin: 5px;
        
    `;
    //width: 398px;
        //height: 492px;
    //margin-left: ${({ isMargin }) => (isMargin ? '20px' : 0)};
        //margin-right: ${({ isMargin }) => (isMargin ? '20px' : 0)};

    const InsideNextWrap = styled.div`
    
        display: flex;
        justify-content: center;
        margin-top: 20px;

        width:100%;
        position: fixed;
        bottom: 20px;
         right: 20px;
    `;

    const Button = styled.img`
        width: 21vw;
        height: 9vh;
        padding: 25px;

        @media screen and (min-width: 1600px) {
            width: 24vw;
            height: 10vh;
            
        };
    `;

    
    
    
    const Radius = styled.button`
    //border: 3px #3A76EF solid;
    
    padding: 20px;
    word-wrap: break-word;
    border-radius: 40px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    
    margin-top: 20px;
    border:none;
    
    `;
    const ButtonTwo = styled(Radius)`
background: #798BE6;
display: flex;
align-items: center;
justify-content: center;

position: relative;
cursor: pointer;
  width:25vw;
  height: 7vh; 
  font-size: 33px;

  @media screen and (min-width: 1700px) {
    width:18vw;
    height: 7.5vh; 
  };
 `;

  // span 
const Menu = styled.span`
z-index: 2;
color: white;

position: absolute;
font-weight: 500;

font-size: 30px;
over-flow:hidden;

@media screen and (min-height: 950px) {
  
  font-size: 40px;
  
  };
`;