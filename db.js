import mysql from "mysql2"

const connect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"admin",
    password: "12345",
    database:"db_test"
});

export default connect;