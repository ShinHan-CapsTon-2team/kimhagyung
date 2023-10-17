import { BsPlusCircleFill } from 'react-icons/bs'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ProfileInfo from '../Component/ProfileInfo';
import ProfileInfo_Edit from '../Component/ProfileInfo_Edit';
import Header from '../Component/Header';
import styled from "styled-components";
import './Paging.css';

import {ProfileWrap,ButtonShort} from '../Component/ProfileInfoStyle'
 


function ProfileLook() {
  const [userinfo, setUserinfo] = useState([]);
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState([]);
  //const [otherUserNickname, setOtherUserNickname] = useState('');
  const [postemail, setPostEmail] = useState('');
  const [PostIds, setPostIds] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [TotalCount, setTotalCount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [page, setPage] = useState(1); 
  const [dataFromChild, setDataFromChild] = useState({}); 
  const [introduction, setIntroduction] = useState('');
  const [career, setCareer] = useState('');
  

  const handleChildData = (data) => {
    // 자식 컴포넌트로부터 받은 데이터를 처리
    setDataFromChild(data);
  };
  const postsPerPage = 20; // 한 페이지에 보여줄 게시물 수

  const navigate = useNavigate();
  const params = useParams(); // 1
  const emailId = params.emailId; // 사용자의 email
  const isMe = dataFromChild.emailid; // 로그인한 사용자  
  //const isCurrentUsersProfile = email === postemail;

  const handleImageClick = (id) => {
        navigate(`/lookup/${id}`);
    };

  const handleImagesClick = (postId) => {
      navigate(`/lookup/${postId}`);
      
  };

  const gotoProfileEdit = () => {
    setIsEditing(true);
};

const handleEditComplete = () => {
  setIsEditing(false); // 수정 완료 시 isEditing을 false로 변경하여 ProfileInfo로 전환
};

const goToWorkUpload =()=>{
  navigate('/post');
};


const handlePageClick = async ({ selected }) => {
  const newPage = selected + 1;
  setPage(newPage);

  try {
    const response = await fetch(
      `http://localhost:4000/api/lookups/${email}?page=${newPage}&postsPerPage=${postsPerPage}`
    );

    if (!response.ok) {
      throw new Error("페이지를 불러오는 데 문제가 발생했습니다.");
    }

    const { data, totalCount } = await response.json();

    if (data.length > 0) {
      setCurrentPosts(data);
      setTotalCount(totalCount);
    }
  } catch (error) {
    console.error("게시물을 불러오는 중 에러 발생:", error);
  }

  
};

const pageCount = Math.ceil(TotalCount / postsPerPage);

useEffect(() => { 
  fetch(`http://localhost:4003/api/profile/${emailId}?page=${page}&postsPerPage=${postsPerPage}`)
          .then((response) => response.json())
          .then((profileData) => {
            setUserinfo(profileData);
            setImages(profileData.images);
            setPostIds(profileData.id);
            setEmail(profileData.email);
            setTotalCount(profileData.totalCount);
            setNickname(profileData.nickname);
            setCareer(profileData.career);
            setIntroduction(profileData.introduction);
            console.log('email: ', profileData.email);
             
           })
           .catch((error) => {
              console.error('Error fetching profile data for other user:', error);
            });
  }, [emailId, page, postsPerPage]); 

  console.log("지금 접속중인 사용자", isMe)
    return (
        <OutWrap>
            <InOutWrap>
                <Header onData={handleChildData}/>

                <Center>
                <ProfileWrap>
              
                <>
                {isEditing ? (
                  <ProfileInfo_Edit onEditComplete={handleEditComplete} />
                ) : (
                <>
  
                <ProfileInfo 
                    introduction={introduction}
                    career={career}
                    email={email}
                    nickname={nickname}
                   
                />
                
                            
                {(isMe === emailId || isMe === 'zxcva98657') && ( //수정됨. 수정버튼 보이는 유무와 현재 사용자에 따른 ..
                    <ButtonShort onClick={gotoProfileEdit}>프로필 수정</ButtonShort> 
                  )}
    
                </>
                )}
                </>       


                </ProfileWrap>

                <ArticleWrap>
                    <Two style={{display:'flex',flexDirection:'column'}}>
                      
                        <GridWrap>
                        
                      {images.map((image, index) => (
                        <GridDiv key={index}>
                            <GridImg src={image} onClick={() => handleImagesClick(PostIds[index])}  alt="사진" />
                            
                        </GridDiv>
                      ))}
                    
                        </GridWrap>
                   

                      <ReactPaginate
                        previousLabel={<Button style={{marginRight:20}}>이전</Button>}
                        nextLabel={<Button style={{marginLeft:20}}>다음</Button>}
                        breakLabel={''}
                        pageCount={pageCount}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                      />
                    </Two>
                </ArticleWrap>
                
                </Center>
            </InOutWrap>

             <PostWrap>
              
              <StyledBsPlusCircleFill onClick={goToWorkUpload} />
            </PostWrap> 
              

              
             

           
        </OutWrap>

    );
}
export default ProfileLook;



const ArticleWrap = styled.div`
width:75%;
margin-left:10px;
@media screen and (max-width: 1024px){
  width:75%;
}

@media screen and (max-width: 850px){
  //margin-left:10px;
  width:100%;
}
/* mobile 규격 */
@media screen and (max-width: 540px){
  margin-left:0px;
  width:90%;
}

/* s 데스크 */
@media screen and (min-width: 1025px){
  
  width:73%;
}
/* l 데스크 */
@media screen and (min-width: 1700px){
  width:73%;
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
  //width: 90%;
}
@media screen and (max-width: 850px){
  //width: 90%;
}
/* mobile 규격 */
@media screen and (max-width: 540px){
  //width: 93%;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(10, 1fr);
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
  @media screen and (max-width: 850px){
    height: 24vh;
  }
  /* mobile 규격 */
  @media screen and (max-width: 540px){
    height: 30vh;
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

width:80%;

      /* tablet 규격 */
    @media screen and (max-width: 1024px){
      width:87%;
    }

    @media screen and (max-width: 850px){
      //width:90%;
    }
    
    /* mobile 규격 */
    @media screen and (max-width: 540px){
      width:95%;
      
    }
    /* s 데스크 */
    @media screen and (min-width: 1025px){
        
    }
    /* l 데스크 */
    @media screen and (min-width: 1700px){
      width:75%;
    }
`;


const Center = styled.div`
text-align: center;
display: flex;
flex-direction: row;
//align-items: center; 
width: 100%;
//width: 90%;
//height:100%;
margin-top:20px;
//justify-content: space-between; //고려


/* mobile 규격 */
@media screen and (max-width: 540px){
  flex-direction: column;
  align-items:center;
}
`;

const ContentRadius = styled.div`
word-wrap: break-word;
border-radius: 31px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);


padding: 40px;
margin-bottom:20px;
@media screen and (max-width: 850px){
  padding: 20px;
}




@media screen and (max-width: 1600px) {
  border: 3px #3A76EF solid;
  };
  
  @media screen and (max-width: 540px) {
  margin-top: 15px;
  border: 2px #3A76EF solid;
  };
  
  @media screen and (min-width: 1601px) {
  border: 4px #3A76EF solid;
  };
`;

const PaginationWrap = styled.div`
      margin-top: 20px;
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
  `;



const Two = styled(ContentRadius)`
display: flex;
align-items: center;

//width:75%;

height:auto;
min-height:65vh;
`;


const PostWrap =styled.div`
text-align: center;
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* 수평 정렬을 오른쪽으로 변경 */
    justify-content: flex-end; /* 수직 정렬을 아래쪽으로 변경 */
    position: fixed; /* 위치를 고정 */
    bottom: 100px; /* 아래쪽 여백을 20px로 설정 */
    right: 50px; /* 오른쪽 여백을 20px로 설정 */

    /* tablet 규격 */
    @media screen and (max-width: 1023px){
        
    }

    /* mobile 규격 */
    @media screen and (max-width: 540px){
      bottom: 120px; /* 아래쪽 여백을 20px로 설정 */
      right: 25px; /* 오른쪽 여백을 20px로 설정 */
    }
    /* s 데스크 */
    @media screen and (min-width: 1024px){
      
    }
    /* l 데스크 */
    @media screen and (min-width: 1700px){
      bottom: 130px; /* 아래쪽 여백을 20px로 설정 */
      right: 80px;
    }
`;

const StyledBsPlusCircleFill = styled(BsPlusCircleFill)`
    width: 70px;
    height: 70px;
    color:#798BE6;
    cursor:pointer;
    &:hover {
      color:#5D6BB4;
    }

    /* tablet 규격 */
    @media screen and (max-width: 1023px){
        width: 75px;
      height:75px;
    }

    /* mobile 규격 */
    @media screen and (max-width: 540px){
      width: 63px;
      height:63px;
    }
    /* s 데스크 */
    @media screen and (min-width: 1024px){
        
    }
    /* l 데스크 */
    @media screen and (min-width: 1700px){
      width: 90px;
      height:90px;
    }
    `;
    export const FontStyle = {
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
    export const Radius = styled.button`
  padding: 20px;
  word-wrap: break-word;
  border-radius: 40px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: #798be6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  cursor: pointer;
  color: white;
`;

export const Button = styled(Radius)`
  width: 10vw;
  height: 7vh;
  
  ${FontStyle};
  &:hover {
    background: #5d6bb4;
  }

  /* tablet 규격 */
  @media screen and (max-width: 1023px) {
    width: 16vw;
    height: 7vh;
  }

  @media screen and (max-width: 850px) {
  }
  /* mobile 규격 */
  @media screen and (max-width: 540px) {
    width: 30vw;
    height: 7vh;
  }
  /* s 데스크 */
  @media screen and (min-width: 1024px) {
  }
  /* l 데스크 */
  @media screen and (min-width: 1700px) {
    width: 10vw;
    height: 7vh;
  }
`;

  