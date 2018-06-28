docker run --name candybox -p 5432:5432 -v ~/db/postgresql/data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=yunphant2018 -e POSTGRES_USER=yunphant -e POSTGRES_DB=candybox -d postgres

docker run --name candybox -p 5432:5432 -e POSTGRES_PASSWORD=yunphant2018 -e POSTGRES_USER=yunphant -e POSTGRES_DB=candybox -d postgres

docker run --name testmysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=hofungkoeng -e MYSQL_USER=hofungkkoeng -e MYSQL_PASSWORD=hofungkoeng -e MYSQL_DATABASE=test -d mysql
docker exec -it testmysql bash 
mysql -uroot -p
show databases;
use test;
CREATE TABLE `student` ( 
  `Id` int(11) NOT NULL, 
  `Name` varchar(10), 
  `Birthdate` date , 
  `Gender` tinyint(1) , 
  `Score` int(11), 
  PRIMARY KEY (`Id`) 
);
desc student;

INSERT INTO student(Id,
                    Name,
                    Birthdate,
                    Gender,
                    Score)
VALUES(100,
       'Toy Land',
       20180513,
       1,
       11);
<!-- POST       -->
{
  "Birthdate": "19901230",
  "Gender": true,
  "Id": 34,
  "Name": "sb",
  "Score": 114
}
---
lsof -i:80
kill -9 pid

---
- Models are usually just normal Golang structs, basic Go types, or pointers of them
- `gorm.Model` 是包含 ID, CreatedAt, UpdatedAt, DeletedAt 字段的结构体，可以嵌入自定义的 model，也可不嵌
    - For models having DeletedAt field, when delete their instances, they won’t be deleted from database, but will set its DeletedAt field to current time, refer Soft Delete
- GORM 默认把字段名为 ID 的的字段当作主键
- 指定表的名称

    ```go
    // 用 Users 结构体的定义创建名为 deleted_users 的表
    db.Table("deleted_users").CreateTable(&User{})

    var deleted_users []User
    db.Table("deleted_users").Find(&deleted_users)
    //// SELECT * FROM deleted_users;

    db.Table("deleted_users").Where("name = ?", "jinzhu").Delete()
    //// DELETE FROM deleted_users WHERE name = 'jinzhu';
    ```

- 列名

    ```go
    type User struct {
      ID        uint      // column name is `id`
      Name      string    // column name is `name`
      Birthday  time.Time // column name is `birthday`
      CreatedAt time.Time // column name is `created_at`
    }

    // Overriding Column Name
    type Animal struct {
      AnimalId    int64     `gorm:"column:beast_id"`         // set column name to `beast_id`
      Birthday    time.Time `gorm:"column:day_of_the_beast"` // set column name to `day_of_the_beast`
      Age         int64     `gorm:"column:age_of_the_beast"` // set column name to `age_of_the_beast`
    }
    ```

- 连接数据库之前要引入数据库驱动

    ```go
    import (
      "github.com/jinzhu/gorm"
      _ "github.com/jinzhu/gorm/dialects/postgres"
    )
    func main() {
      db, err := gorm.Open("postgres", "host=myhost port=myport user=gorm dbname=gorm password=mypassword")
      defer db.Close()
    }
    ```

- `NewRecord()` check if value's primary key is blank
- AutoMigrate run auto migration for given models, will only add missing fields, won't delete/change current data
- Auto Migration Automatically migrate your schema, to keep your schema update to date
```go
db.Where("amount > ?", DB.Table("orders").Select("AVG(amount)").Where("state = ?", "paid").QueryExpr()).Find(&orders)
// SELECT * FROM "orders"  WHERE "orders"."deleted_at" IS NULL AND (amount > (SELECT AVG(amount) FROM "orders"  WHERE (state = 'paid')));
// 确保表没删

rows, err := db.Table("users").Select("users.name, emails.email").Joins("left join emails on emails.user_id = users.id").Rows()
for rows.Next() {
  ...
}

db.Table("users").Select("users.name, emails.email").Joins("left join emails on emails.user_id = users.id").Scan(&results)

// multiple joins with parameter
db.Joins("JOIN emails ON emails.user_id = users.id AND emails.email = ?", "jinzhu@example.org").Joins("JOIN credit_cards ON credit_cards.user_id = users.id").Where("credit_cards.number = ?", "411111111111").Find(&user)
```

---
- `r := gin.New()` 获得空白 gin，`gin.Default()` 有 `Logger` 和 `Recovery` 中间件
    - `Logger` middleware will write the logs to `gin.DefaultWriter` even if you set with `GIN_MODE=release`. By default `gin.DefaultWriter = os.Stdout`
    - `Recovery` middleware recovers from any panics and writes a 500 if there was one
- [ ] `r.Group()` 里的参数是什么 
- model binding: bind a request body into a type
- MustGet returns the value for the given key if it exists, otherwise it panics


Server error message:  
{code: 11, message: "Error sending verify message [064200] to [15088633…176-A300-1F4299C55016 isv.BUSINESS_LIMIT_CONTROL}", error: {…}}
code
:
11
error
:
{}
message
:
"Error sending verify message [064200] to [15088633499] : &{触发分钟级流控Permits:1 246B19C0-DCCF-4176-A300-1F4299C55016 isv.BUSINESS_LIMIT_CONTROL}"
__proto__
:
Object