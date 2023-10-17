import React, {useParams ,useNavigate} from 'react-router-dom';
import { useEffect,useState } from 'react'
import Header from '../Component/Header';
import Lookup_Content from '../Component/Lookup_Content';
import {Popup} from '../Modal/Popup';
import * as S from './LookupStyle'

import { DeleteModal } from '../Modal/DeleteModal';
const SERVER_URL= 'http://localhost:4000/api/lookup';

function Images_Lookup() {
    const navigate = useNavigate();

    const params = useParams(); 
    const id = params.id; 
    const [isOpen, setIsOpen] = useState(false); // 모달창때문에 있는거 삭제 노
    

    
    const [user, setUser] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    
    const [dataFromChild, setDataFromChild] = useState({}); 
    const handleChildData = (data) => {
        // 자식 컴포넌트로부터 받은 데이터를 처리
        setDataFromChild(data);
    };

    
    
    const [isMine,setIsMine]= useState(false); // 현 게시글이 내꺼인지 

    const access = dataFromChild.accesstoken;
    const isMe= dataFromChild.emailid;
    console.log("지금 로그인 한 사람 누구야 :",isMe);

    
    
    const openModalHandler = () => {
        // 모달창 관련임 자세히 알 필요 X
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // POST 요청으로 서버에 데이터를 보냅니다.
                const requestBody = { id: id };
                const response = await fetch(`http://localhost:4003/api/profiles/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                });
        
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
        
                const data = await response.json();
                const userEmailFromServer = data.userEmail; // 서버에서 받은 이메일
                const userNicknameFromServer = data.nickname;
        
                //console.log(userEmailFromServer);
                //console.log("닉네임:",userNicknameFromServer);
        
                // 이메일 아이디 추출 (이메일에서 "@" 이후의 부분을 제외)
                const emailId = userEmailFromServer.split('@')[0];
        
                console.log("emailId:",emailId);
                setUserEmail(emailId);
                
                if(isMe === emailId)
                {
                    console.log("내꺼")
                    setIsMine(true);
                }
                else{
                    console.log("내꺼아님")
                    setIsMine(false);
                }
                
            } catch (error) {
                console.error('Error fetching user profile:', error);
                console.log('error');
            }
            };
        
            fetchData(); 
        
        }, [isMe]);
        
        
    

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
            
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            
        });
    }

    getUserList();
    }, [id]);
    


    const handelGoEdit = () => {
        navigate(`/postedit/${id}`); 
    };
  
    console.log("userEmail:",userEmail);
    return (  
        
        <S.OutWrap>
            <S.InOutWrap>
                    
                <Header onData={handleChildData}/>

                <S.Center>
                    {user.map((uu)=>{
                        let imageUrl = uu.image_url; // 이미지 URL 사용
                        //console.log("url:", imageUrl);
                        
                        return(
                                <Lookup_Content 
                                    key={uu.id} 
                                    title={uu.title} 
                                    nickname={uu.nickname} 
                                    imageurl={imageUrl} 
                                    description ={uu.description}
                                    created_at={uu.created_at} 
                                    id={uu.id} 
                                    writer={userEmail}
                                />    
                                )
                            }
                        )} 
 
 
                {isMine|| isMe ===  'zxcva98657'  ? ( //수정된 부분 1017, 관리자 수정, 삭제버튼 보이도록 
                <S.InLayoutTwo> 
                    <S.Buttons>
                    <S.Right> 
                        <S.EditButton  onClick={handelGoEdit}>
                        수정  
                        </S.EditButton>

                        <S.DelectButton onClick={openModalHandler}>
                        삭제
                        </S.DelectButton>
                        {isOpen ? (<DeleteModal isId={id} openModalHandler={openModalHandler}/>) : null}
                    </S.Right>
                    </S.Buttons>
                </S.InLayoutTwo>
                ) : null}


                </S.Center>
                    
            </S.InOutWrap>
        </S.OutWrap>
    );
};

export default Images_Lookup;



