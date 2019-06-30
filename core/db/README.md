```
sudo -u postgres psql
```
##create db
```
drop database smartmenu;
create database smartmenu;
CREATE USER smartmenu_user WITH ENCRYPTED PASSWORD 'smartmenu';
GRANT ALL PRIVILEGES ON DATABASE smartmenu TO smartmenu_user;
```

##connect to db
```
psql -U smartmenu_user -d smartmenu -h localhost -W
smartmenu
```

##pump and restore

```

```