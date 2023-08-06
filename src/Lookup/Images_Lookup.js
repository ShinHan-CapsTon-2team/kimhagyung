import React, {useNavigate,useParams } from 'react-router-dom';
import { useEffect,useState } from 'react'

import logo from '../Images/imagelogo.png'

import styled from "styled-components"; // 수정 

const SERVER_URL= 'http://localhost:4000/api/lookup';

const Images_Lookup = () => {
    
    const navigate = useNavigate();
    //홈페이지 이동 
    const handleGohomeClick = () => {
        navigate('/home');
    };

    const params = useParams(); // 1
    const id = params.id; // 2
    console.log( 'params:',params);
    console.log('id:',id);

    // API로부터 받아온 데이터를 저장할 상태 변수
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        function getUserList() {
          let reqOption = {
            method: 'get',
            headers: {
               //'content-type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
            },
          };
    
          fetch(`${SERVER_URL}/${id}`, reqOption)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setUser(data);
                console.log('설명',data.description)
                setLoading(false); // 데이터를 가져왔으므로 로딩 상태를 false로 설정
              
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
              setLoading(false); 
            });
        }
    
        getUserList();
      }, [id]);

      const OutWrap = styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        background: white;
        margin-left: 40px;
        `;

      const LogoWrap = styled.div`
        width: 496px;
        height: 239px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;`;
      
        const Logo = styled.img`
        width: 354px;
        height: 239px;
        left: 0;
        top: 0;
        position: absolute;
      `;
      
      const InsideWrap = styled.div`
        display: flex;
        margin-right: 40px;
        `;

        const InsideOneWrap = styled.div`
        width: 1102px;
        `;

        const InsideTwoWrap = styled.div`
        margin-left: 20px;
        width: 491px;
        `;


        const BasicWrap = styled.div`
        height: auto;
        opacity: 0.90;
        background: white;
        border-radius: 31px;
        border: 3px #3A76EF solid;
        padding: 20px;
        word-wrap: break-word;
      `;
      
      const BoxRadius = styled.div`
        border-radius: 31px;
        `;

        const Font = styled.div`
        color: black;
        font-size: 40px;
        font-family: 'Inter';
        font-weight: 400;
        padding-left: 20px;
        padding-right: 20px;
      `;
      
      const Img = styled.img`
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin-bottom: 30px;
        `;

      //const OutWrap = styled.div``;
      //const OutWrap = styled.div``;


    if (loading) {
        return <div>Loading...</div>;
    }

    
    return (
        
        //설명 있는 버전 
        <OutWrap>
        
            <LogoWrap>
                <Logo src={logo} alt=''  onClick={handleGohomeClick}/>
            </LogoWrap>


            {user.map((uu)=>{
                // 이미지 경로 전처리 및 인코딩
                //let imageUrl = `../../../post-server/${uu.image_url.replace(/\\/g, '/')}`; //수정 필요 
                //let encodedImageUrl = encodeURI(imageUrl);
                //const imageUrl = uu.image_url
                //const encodedImageUrl = encodeURIComponent(imageUrl);
                
                //const imageUrl = decodeURIComponent(uu.image_url); // 이미지 URL 디코딩
                //console.log("url:",imageUrl);
                const imageUrl = uu.image_url; // 이미지 URL 사용
                console.log("url:", imageUrl);
                
                return(
                        <InsideWrap  key={uu.id} >
                            <InsideOneWrap>

                                <BasicWrap>{/* 제목 */}
                                    <BoxRadius> 
                                        <Font>{uu.title || 'None'}</Font>
                                    </BoxRadius>
                                </BasicWrap>

                                <BasicWrap style={{ marginTop: 20 }}>{/* 이미지  설명*/}
                                    <BoxRadius > {/* 이미지 */}
                                        <Img src={imageUrl} alt='이미지' />
                                    </BoxRadius>
                                    <BoxRadius> {/* 설명 */}
                                        <Font>{uu.description || 'None'}</Font>
                                    </BoxRadius>
                                </BasicWrap>

                            </InsideOneWrap> 
        
                            <InsideTwoWrap>

                                <BasicWrap> {/* 이름 */}
                                    <BoxRadius>
                                        <Font>{uu.name || 'None'}</Font>
                                    </BoxRadius>
                                </BasicWrap>
            
                                <BasicWrap style={{ marginTop: 20 }}>{/* 소개 커리어 */}
                                    <BoxRadius> 
                                        <Font>{uu.profile || 'None'}</Font>
                                    </BoxRadius>
                                </BasicWrap>

                            </InsideTwoWrap>   
                        </InsideWrap>
                    )
                    }

            )}
           
        </OutWrap>
    );
};

export default Images_Lookup;