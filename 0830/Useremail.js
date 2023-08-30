import React, { useEffect, useState } from "react";

function User() {
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
          console.log(data.email)
        })
        .catch((error) => {
          console.error("Error fetching user email:", error);
        });
    }
  }, []);

  return (
    <div>
      {userEmail ? (
        <p>User Email: {userEmail}</p>
      ) : (
        <p>No user email available</p>
      )}
    </div>
  );
}

export default User;
