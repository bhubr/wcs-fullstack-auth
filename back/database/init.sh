#!/bin/bash
mysql -uroot -p -e "CREATE DATABASE $1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER $2@localhost IDENTIFIED BY '$3'; GRANT ALL PRIVILEGES ON $1.* TO $2@localhost; FLUSH PRIVILEGES;"
