CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER myuser@localhost IDENTIFIED BY 'mypass';
GRANT ALL PRIVILEGES ON mydb.* TO myuser@localhost;
FLUSH PRIVILEGES;