

import React, {useParams ,useNavigate} from 'react-router-dom';
import { useEffect,useState } from 'react'
import Logo from "../Component/Header"
import styled from "styled-components";
import Lookup_Content from '../Component/Lookup_Content';
import Loading from '../Component/Loading';
const SERVER_URL= 'http://localhost:4000/api/lookup';

//const SERVER_URL= 'http://localhost:4000/api/post';

function Images_Lookup_Comtest() {
    const navigate = useNavigate();

    const params = useParams(); // 1
    const id = params.id; // 2
    console.log( 'params:',params);
    console.log('id:',id);

    // API로부터 받아온 데이터를 저장할 상태 변수
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
      const accessToken = localStorage.getItem("access_token");
  
      // 서버로 액세스 토큰을 보내서 사용자 이메일 정보를 요청
      if (accessToken) {
        fetch('http://localhost:4001/api/email', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken }),
        })
          .then((response) => response.json())
          .then((data) => {
            setUserEmail(data.email);
            console.log("현재 접속중인 사용자 이메일:", data.email);
          })
          .catch((error) => {
            console.error("Error fetching user email:", error);
          });
      }
    }, []);

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
            console.log('설명:',data[0].description)
            console.log("게시글 올린 사용자 이메일:",data[0].email)
            setLoading(false); // 데이터를 가져왔으므로 로딩 상태를 false로 설정
            
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setLoading(false); 
        });
    }

    getUserList();
    }, [id]);
    
    if (loading) {
        <Loading
        what="Loading"/>;
    }

    const handelGoEdit = () => {
        navigate(`/postedit/${id}`); 
    };
    return (  
        
        <OutWrap>
            <InOutWrap>
            
                {/* 홈페이지 로고 같*/}        
                <Logo />

                <Center>
                    {user.map((uu)=>{
                        let imageUrl = uu.image_url; // 이미지 URL 사용
                        console.log("url:", imageUrl);

                        {/*  id={uu.id}  작성자 식별할 수 있는 걸로 고쳐야함 */}
                        return(
                                <Lookup_Content title={uu.title} name={uu.name} imageurl={imageUrl} description ={uu.description}
                                created_at={uu.created_at} id={uu.id} />    
                                )
                            }
                        )} 
                        {user.length > 0 && userEmail === user[0].email && (
                        <InLayoutTwo> {/* 자기 게시글이면 보이게 처리하기  */}
                            <Buttons>
                            <Right>
                                <EditButton onClick={handelGoEdit}>수정</EditButton>
                                <DelectButton>삭제</DelectButton>
                            </Right>
                            </Buttons>
                        </InLayoutTwo>
                        )}
                    </Center>
                    </InOutWrap>
                </OutWrap>
    );
};

export default Images_Lookup_Comtest;



const OutWrap = styled.div`
width: 100%;
height: 97.6vh;

position: relative;

background: white;

display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;

//overflow: hidden;


`;

const InOutWrap = styled.div`
text-align: center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

const Center = styled.div`
text-align: center;
display: flex;
flex-direction: column;
align-items: center;

`;

const InLayoutOne = styled.div`
text-align:center;
width:65vw;
margin-bottom:30px;
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
    width: 75vw;
}

`;






const InLayoutTwo = styled(InLayoutOne)`
display: flex;
width:65vw;
//height:19vh;
align-items: center;
//justify-content: center;

margin-bottom:30px;
@media screen and (min-width: 1700px) {
    width: 75vw;
    height:21vh;
};
`;

const Buttons = styled.div`
  text-align: center;
  display: flex;
  
  flex-direction: row;
  width: 100%;
`;


const Right = styled.div`
display: flex;
flex-direction: row;
margin-left: auto;
margin-right:10px;
//flex:1
`;


const Radius = styled.button`
padding: 20px;
word-wrap: break-word;
border-radius: 40px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
margin-top: 20px;
border:none;
background: #798BE6;
display: flex;
align-items: center;
justify-content: center;

position: relative;
cursor: pointer;
color: white;

`;



const FontStyle= {
    fontSize: 33,

    /* mobile 규격 */
  '@media screen and (max-width: 540px)':
    {
        fontSize: 27,
  },
  '@media screen and (min-width: 1700px)': {
    
        fontSize: 45,
    },
};
   


const ButtonLong = styled(Radius)`
  
  width:18vw;
  height: 7vh; 
  ${FontStyle};

  /* mobile 규격 */
  @media screen and (max-width: 540px){
    width:41vw;
    height: 7vh; 

  }

  /* s 데스크 */
  @media screen and (min-width: 1024px){
      
  }
  @media screen and (min-width: 1700px) {
    width:18vw;
    height: 7.5vh; 
  };
 `;

const EditButton =styled(ButtonLong)``;
const DelectButton=styled(ButtonLong)`
margin-left:20px;`;



