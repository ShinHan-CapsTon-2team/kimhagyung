import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import styled from 'styled-components';

const ContentRadius = styled.div`
border: 3px #3A76EF solid;
padding: 40px;
word-wrap: break-word;
border-radius: 31px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

`;


const One = styled(ContentRadius)`
display: flex;
align-items: center;
//width:25%;
height:15vh;
//min-height:50vh;
flex-direction: column;
margin-bottom:20px;

`;

const Onetwo = styled(ContentRadius)`
display: flex;
align-items: center;
//width:25%;
height:auto;
min-height:50vh;
flex-direction: column;

`;
const Area = styled.div`
display: flex;
align-items: center;
width: 100%;
border-radius: 31px;
overflow: hidden; 
`;

const SmallWrap = styled(Area)`
height: auto;
margin-top:20px;

`;
const Wrap = styled(Area)`
height: auto;

`;
const FontStyle= {
    fontSize: 27.5,

    /* mobile 규격 */
  '@media screen and (max-width: 540px)':
    {
        fontSize: 27,
  },
  '@media screen and (min-width: 1700px)': {
    
        fontSize: 45,
    },
};
   
const Font = styled.div`
${FontStyle};
color: black;


width: 100%;

`;

const Left = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  margin-right: auto;
`;

const AreaInput = styled.div`
display: flex;
align-items: center;
width: 100%;
overflow: hidden; 
`;

const WrapAuto = styled(AreaInput)`
height: auto;

`;
const WrapPer = styled(AreaInput)`
height: 100%;
`;

const inputStyle = {
color: 'black',
fontFamily: 'Inter',
border: 'none',
outline: 'none',
width: '100%'
};

const InputBasic = styled.input`
${inputStyle}
height: 6vh;
`;

const TextareaBasic = styled.textarea`
${inputStyle}
height: 100%;
`;
const Radius = styled.button`
//border: 3px #3A76EF solid;

padding: 20px;
word-wrap: break-word;
border-radius: 40px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

//margin-top: 20px;
border:none;
`;

  const ButtonShort =  styled(Radius)`
  background: #798BE6;
width:17vw;
height: 8.5vh; 
margin-left:20px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;

position: relative;
cursor: pointer;
color: white;

font-size:25px;
margin-top:20px;
&:hover {
  background:#5D6BB4;
}

      
/* tablet 규격 */
@media screen and (max-width: 1023px){
  width:16vw;
  height: 7vh;
}

/* mobile 규격 */
@media screen and (max-width: 540px){
  width:30vw;
  height: 7vh;
}
/* s 데스크 */
@media screen and (min-width: 1024px){
    
}
/* l 데스크 */
@media screen and (min-width: 1700px){
    width:10vw;
    height: 7vh;
}
`;

//1. 프로필 정보 가져오기
// 2/ 프로필 수정 완료 처리하기  
const ProfileInfo_Edit = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [career, setCareer] = useState('');
  const [user, setUser] = useState({
    nickname: '',
    introduction: '',
    career: '',
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetch('http://localhost:4001/api/user', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          console.log("현재 접속중인 사용자 이메일:", data.email);
          console.log("현재 접속중인 사용자 닉네임:", data.nickname);
        })
        .catch((error) => {
          console.error("Error fetching user email:", error);
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 프로필 정보를 서버에 보내는 로직 
    try {
      const response = await fetch(
        'http://localhost:4002/api/profileEdit',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            introduction,
            career,
            email: user.email,
          }),
        },
      );
      if (response.ok) {
        // 서버 응답이 정상인 경우 처리
        console.log('프로필 정보 업데이트 성공');
        navigate('/profile');

      } else {
        // 서버 응답이 실패한 경우 처리
        console.error('프로필 정보 업데이트 실패');
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

    return(
        <div style={{width:'25%'}}>
            <div >
                <One> {/* 이름 이메일  */}
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'end',height:'20vh',marginBottom:20}}>
                            <SmallWrap style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 35, color: 'black', width: '100%' }}>{user.nickname}</div>
                            </SmallWrap>
                        <Wrap>
                            <text style={{ fontSize: 25 }}>{user.email}</text>

                        </Wrap>
                    </div>

                </One>
                
                <Onetwo style={{padding:20}}>  {/* 소개 커리어  */}

                    <div style={{display:'flex',flexDirection:'column',width:'100%',marginBottom:23}}>
                        
                        <Left >
                            <div style={{fontSize:25,color:'gray'}}> 소개</div>
                        </Left>
                        <Left style={{marginTop:10 ,width:'100%'}}>
                                <WrapPer>
                                        <TextareaBasic
                                            value={introduction}
                                            onChange={(e) => setIntroduction(e.target.value)}
                                            placeholder="소개" 
                                        />
                                </WrapPer>
                        </Left>
                    </div>
                
                    <div style={{display:'flex',flexDirection:'column',width:'100%',marginBottom:23}}>
                        
                        <Left >
                            <div style={{fontSize:25,color:'gray'}}> 커리어</div>
                        </Left>
                        <Left style={{marginTop:10,width:'100%'}}>
                            <WrapPer>
                                        <TextareaBasic
                                            value={career}
                                            onChange={(e) => setCareer(e.target.value)}
                                            placeholder="커리어" 
                                        />
                            </WrapPer>
                        </Left>
                    </div>
                </Onetwo>

            </div>
            
            <ButtonShort onClick={handleSubmit}>프로필 수정 완료 </ButtonShort>
        </div>

    );
};
export default ProfileInfo_Edit;