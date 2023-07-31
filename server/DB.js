const mysql = require('mysql');

const connection = mysql.createConnection({
//  host: '192.168.200.108', // MySQL 호스트 주소
  host:'192.168.200.200',
  user: 'root', // MySQL 사용자 이름
  password: '1', // MySQL 비밀번호
  database: 'DB', // MySQL 데이터베이스 이름
  charset: 'utf8mb4' // 이 부분을 추가하여 utf8mb4를 사용합니다.
});


connection.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

module.exports = connection;