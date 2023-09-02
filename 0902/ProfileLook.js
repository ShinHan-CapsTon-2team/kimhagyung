import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Logo from "../Component/Header"
import styled from "styled-components";

function ProfileLook() {
    const [user, setUser] = useState([]);
    const [userinfo, setUserinfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [introduction, setIntroduction] = useState('');
    const [career, setCareer] = useState('');
    const navigate = useNavigate();

    const gotoProfileEdit = () => {
        navigate('/profileEdit');
      };
    

    const handleImageClick = (id) => {
          navigate(`/lookup/${id}`);
      };

    useEffect(() => {
      const accessToken = localStorage.getItem("access_token");
  
      // 서버로 액세스 토큰을 보내서 사용자 이메일 정보를 요청
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
            setUserinfo(data);
            console.log("현재 접속중인 사용자 이메일:", data.email);
            console.log("현재 접속중인 사용자 닉네임:", data.nickname);
          // 서버로 이메일 정보를 보내어 프로필 정보를 가져옵니다.
          fetch(`http://localhost:4002/api/profile?email=${data.email}`)
            .then((response) => response.json())
            .then((profileData) => {
              setIntroduction(profileData.introduction);
              setCareer(profileData.career);
            })
            .catch((error) => {
              console.error('Error fetching profile:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching user email:', error);
        });
    }
  }, []);
    
    useEffect(() => {
      async function fetchPosts() {
        try {
          const response = await fetch('http://localhost:4000/api/lookup');
          const data = await response.json();
  
          // 현재 사용자의 이메일과 일치하는 데이터만 필터링
          const filteredData = data.filter(item => item.email === userinfo.email);
          setPosts(filteredData);
          
          console.log("Filtered data:", filteredData);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
      fetchPosts();
    }, [userinfo]);

    return (
        <OutWrap>
            <InOutWrap>
            
                {/* 홈페이지 로고 같*/}        
                <Logo />

                <Center>
                    <div style={{width:'25%'}}>

                    
                        <One>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', height: '20vh', marginBottom: 20 }}>
                            <SmallWrap style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 35, color: 'black', width: '100%' }}>{userinfo.nickname}</div>
                            </SmallWrap>
                            <Wrap>
                                <text style={{ fontSize: 25 }}>{userinfo.email}</text>
                            </Wrap>
                        </div>


                            <div style={{display:'flex',flexDirection:'column',width:'100%',marginBottom:23}}>
                                <div
                                        style={{
                                            width: "100%",
                                            textAlign: "center",
                                            borderBottom: "2px solid #aaa",
                                            lineHeight: "0.1em",
                                            margin: "10px 0 10px",
                                        }}
                                        />
                                <Left >
                                    <div style={{fontSize:25,color:'gray'}}> 소개</div>
                                </Left>
                                <Left style={{marginTop:10}}>
                                    <Font  style={{textAlign:'left'}}>{introduction}</Font>
                                </Left>
                            </div>

                            <div style={{display:'flex',flexDirection:'column',width:'100%',marginBottom:23}}>
                                <div
                                        style={{
                                            width: "100%",
                                            textAlign: "center",
                                            borderBottom: "2px solid #aaa",
                                            lineHeight: "0.1em",
                                            margin: "10px 0 10px",
                                        }}
                                        />
                                <Left >
                                    <div style={{fontSize:25,color:'gray'}}> 커리어</div>
                                </Left>
                                <Left style={{marginTop:10}}>
                                    <Font  style={{textAlign:'left'}}>{career}</Font>
                                </Left>
                            </div>
                        
                        <ButtonShort onClick={gotoProfileEdit}>프로필 수정</ButtonShort>
                        </One>
                    </div>

                    <div style={{width:'75%'}}>
                    <Two>
                            <GridWrap>
                                {posts.map((post, index) => (
                                    <GridDiv key={index}>
                                        <GridImg src={post.image_url} onClick={() => handleImageClick(post.id)} alt="사진"/>
                                    </GridDiv>
                                ))}
                            </GridWrap>
                        </Two>

                    </div>
                    
                </Center>
            </InOutWrap>
        </OutWrap>

    );
}
export default ProfileLook;



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



const GridWrap = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-template-rows: repeat(5, 1fr);
gap: 10px;
//width: 75%;
height: auto;
//min-height:80vh;
//padding: 20px;
//margin-top:20px;


/* tablet 규격 */
@media screen and (max-width: 1023px){
  width: 90%;
}

/* mobile 규격 */
@media screen and (max-width: 540px){
  width: 93%;
  gap: 5px;
  
}
/* s 데스크 */
@media screen and (min-width: 1024px){
    
}
/* l 데스크 */
@media screen and (min-width: 1700px){
    
}
`;

const GridDiv = styled.div`
  width: 100%;
  height: 36vh;
  border-radius: 10px;
  overflow: hidden;

  /* tablet 규격 */
  @media screen and (max-width: 1023px){
    height: 26vh;
  }

  /* mobile 규격 */
  @media screen and (max-width: 540px){
    height: 26vh;
  }
  /* s 데스크 */
  @media screen and (min-width: 1024px){
      
  }
  /* l 데스크 */
  @media screen and (min-width: 1700px){
      
  }
`;

const GridImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px; 
  object-fit: cover;
`;

const PaginationWrap = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
`;


const OutWrap = styled.div`
width: 100%;
height: 100vh;

position: relative;

background: white;

display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;


`;

const InOutWrap = styled.div`
text-align: center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;

width:85%
//height:90%;
`;


const Center = styled.div`
text-align: center;
display: flex;
flex-direction: row;
//align-items: center; 

width:100%;
//height:100%;
justify-content: space-between; //고려

margin-bottom:30px;
`;

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
height:auto;
min-height:50vh;
flex-direction: column;

`;
const Two = styled(ContentRadius)`
display: flex;
align-items: center;
margin-left:25px;
//width:75%;

height:auto;
min-height:65vh;
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
    fontSize: 30,

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

const Text = styled.text`
color:gray;
font-size:22px;
`;
