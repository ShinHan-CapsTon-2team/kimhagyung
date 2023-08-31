- profileInfo_Edit랑 login-server만 고침
  
- profiles테이블 새로 생성됐는데(메모장참조, 참고로 아래 길게 적힌 코드는 신경안써도됨)
  1. user_id는 users테이블의 id값을 참조하는 외래키임
  2. 현재 server_profile코드는 users테이블에서 한 번 참조된 id값에 대한 profiles테이블의 칼럼을 중복하지않겠다는 의미
  3. 메모장에 있는 api복붙해서 넣어보면 무슨 말인지 알거임 이건 그냥 수정될 때마다 profiles테이블에 auto id값으로 계속 생성됨
  4. 즉, 현재 코드에서는 users테이블과 profiles테이블의 user_id값에 대한 칼럼이 한 개 이상 생성되지 않음(아마 존재하는데 수정하려고 하면 오류뜰거임)
  5. 이거에대해서는 말을 좀 더 해봐야되겠지만 한 번 보면 좋을듯
     
- profileInfo_Edit에서 수정한 부분
  1. http://localhost:4001/api/user 해당 api로 현재 접속중인 사용자 email요청
  2. http://localhost:4002/api/profileEdit로 api/user에서 받은 email정보와 introduction,career값 보냄
  3. 참고로 nickname변경은 없앰

- server_profile에서 수정한 부분
  1. 클라이언트에서 받아온 email값을 users테이블에 있는 email칼럼과 비교해서 일치하는 users테이블의 id값을 가져옴.
  2. 만약 받아온 email에 대해 users테이블에 일치하는 id값이 없다면 에러뜰걸?
  3. 클라이언트에서 받아온 정보를 profiles테이블에 넣어줌
 

!!!
  <앞으로 해야될 부분>
  1. Profile_Edit 에서 수정버튼을 다시 누르면 profiles 테이블에 저장된 값을 뿌려줘야됨(put)
  2. 저장된 값이 ProfileLook에도 보여져야됨 (get)

     ++++ 내가 post한 부분에 대해서 profileLook에 보여져야되는데 진짜 오후7시부터 지금까지 gpt가 고쳐질 기미가 보이지않아 profileLook은 너에게 맡기겠ㄷ ㅏ..바드는 나랑 말이 안 통한다..
