- **PostgreSQL 必须加分号**
- 表（table）：某种泰鼎类型数据的结构化清单
    - 统一数据库中表名唯一
- 模式（schema）：关于数据库和表的布局及特征信息
    - 数据在表中如何存储，包含存储什么 样的数据，数据如何分解，各部分信息如何命名等信息
- 列（column）：表中的一个字段
    - 表由一个或多个列组成
    - 也叫字段
- 行（row）：表中的一个**记录**
- 主键（primary key）：一列或一组列，其值能够标识表中的每一行
    - 用于表示一个特定的行
    - 成为主键的条件
        - 任意两行都不具有相同的主键值
        - 每一行都必须具有一个主键值(主键列不允许 `NULL` 值)
        - 主键列中的值不允许修改或更新
        - 主键值不能重用(如果某行从表中删除，它的主键不能赋给以后的新行)
- 多条 SQL 语句必须加分号
- SQL 语句不区分大小写
- SQL 语句的空格被忽略
- `DISTINCT` 关键字作用于所有的列，不仅仅是跟在其后的那一列
- 第一个被检索的行是第 0 行，而不是第 1 行
    - `LIMIT 1 OFFSET 1` 会检索第 2 行，而不是第 1 行
- 检索出的数据若不排序，数据一般将以它在底层表中出现的顺序显示，这有可能是数据最初添加到表中的顺序
    - 如果数据随后进行过更新或删除，那么这个顺序将会受到 DBMS 重用回收存储空间的方式的影响
    - 关系数据库设计理论认为，如果不明 规定排序顺序，则不应该假定检索出的数据的顺序有任何意义
- SQL 语句由子句（clause）构成，有些子句必需，有些可选
- 指定一条 `ORDER BY` 子句时应该保证它是 `SELECT` 语句中最后一条子句
    - 若不是，会抛错
    - 通常 `ORDER BY` 子句中使用的列将是为显示而选择的列，但用非检索的列排序数据也是完全合法的
- 指定关键字 DESC 可进行降序排列
    - DESC 关键字只应用到直接位于其前面的列名
    - 若想在多个列上进行降序排序，必须对每一列指定 `DESC`
    - 默认升序 `ASC`
    - 大多数数据库在在字典（dictionary）排序顺序中，A 被视为与 a 相同；数据可可以设置
- `WHERE` 字句操作符：`=`，`<>`（`!=`），`>`，`>=`，`<`，`<=`，`BETWEEN AND`，`IS NULL`
    - 将值与字符串类型的列进行比较需要加单引号
    - 通过过滤选择不包含指定值的所有行时不会返回含 `NULL` 值的行
        - 所以过滤数据时一定要验证被过滤列中含 `NULL` 的行确实出现在返回的数据中
- 可以组合用 `AND` 和 `OR` 字句组合 `WHERE` 字句
    - SQL在处理 `OR` 操作符前，优先处理 `AND` 操作符
    - 用圆括号括起来以明确分组
- `IN` 操作符用来指定条件范围，范围中的每个条件都可以进行匹配
    - `IN` 取一组由逗号分隔、括在圆括号中的合法值
    - `IN` 可以包含其他 `SELECT` 语句
- `NOT`操作符运输否定其后跟的任何条件
    - `NOT` 关键字用在要过滤的列前
- 搜索模式：由字面值、通配符或两者组合构成的搜索条件
- 在搜索子句中使用通配符必须使用 `LIKE` 操作符
    - `LIKE` 指示 DBMS后跟的搜索模式利用通配符匹配而不是简单的相等匹配进行比较
- 操作符在作为谓词（predicate）时不是操作符
- 通配符
    - 通配符搜索只能用于文本字段
    - 通配符可在搜索模式中的任意位置使用，可以使用多个通配符
        - > 包括 Access 在内的许多 DBMS 都用空格来填补字段的内容。例如，如果某列有50个字符，而存储的文本为`Fish bean bag toy`（17 个字 符），则为填满该列需要在文本后附加 33 个空格。这样做一般对数据 及其使用没有影响，但是可能对上述 SQL 语句有负面影响。子句 `WHERE prod_name LIKE 'F%y'` 只匹配以 F 开头、以 y 结尾的 `prod_name`。 如果值后面跟空格，则不是以 y 结尾，所以 `Fish bean bag toy` 就 不会检索出来。简单的解决办法是给搜索模式再增加一个%号：`'F%y%'` 还匹配 y 之后的字符(或空格)。更好的解决办法是用函数去掉空格
    - `%`：表示任何字符出现任意次数（可以是 0 次）
        - 不能匹配 `NULL`
    - `_` 匹配单个字符，只能是一个
    - `[]` 指定一个字符集，它必须匹配指定位置（通配符所在的位置）的**一个**字符
        - 用前缀字符 `^` 来否定
- `RTRIM()` 去掉字符串右边的空格，`LTRIM()` 去掉字符串左边的空格，`TRIM()` 去两边
- 用 `AS` 关键字赋予别名（也被称为导出列）
    - 任何客户端应用都可以按名称引用赋予别名的列，就像它是一个实际的表列一样
    - 别名的名字既可以是一个单词，也可以是一个字符串（不建议）
    - 别名最常见的使用是将多个单词的列名重命名为一个单词的名字
    - 其他用途：在实际的表列名包含不合法的字符（如空格）时重新命名它；在原来的名字含混或容易误解时扩充它
- SQL 除了可以对列名和计算字段使用别名，还允许给表名起别名
    - 表别名只在查询执行中使用，不返回到客户端
- SELECT 语句省略了 FROM 子句后就是简单地访问和处理表达式
    - `SELECT 3 * 2;` 返回 6，`SELECT Trim(' abc ');` 返回 abc，`SELECT Now();` 使用 `Now()` 函数返回当前日期和时间
- 文本处理函数
    - `SOUNDEX` 是一个将任何文本串转换为描述其语音表示的字母数字模式的算法。`SOUNDEX` 考虑了类似的发音字符和音节，使得能对字符串进行发音比较而不是字母比较
- 日期和事件处理函数
- 数值处理函数
- 聚集函数（aggregate function）：对行进行运行的函数，计算并返回一个值
    - `AVG()`：只能用来确定特定数值列的平均值，列名必须作为函数参数给出
        - 为获得多个列的平均值，必须使用多个 `AVG()` 函数
        - 忽略列值为 `NULL` 的行
    - `MAX()`
        - 用于文本数据时，`MAX()` 返回按该列排序后的最后一行
        - 忽略列值为 `NULL` 的行
    - `MIN()`
        - 用于文本数据时，`MIN()` 返回按该列排序后的前面一行
        - 忽略列值为 `NULL` 的行
    - `SUM()`
        - 忽略列值为 `NULL` 的行
    - `COUNT()`：确定表中行的数目或符合特定条件的行的数目
        - `COUNT(*)` 对表中行的数目进行计数，表列中包含的是空值（`NULL`）的也算上
        - `COUNT(columnName)` 对特定列中具**有值**的行进行计数，忽略 `NULL` 值
    - 以上 5 个聚集函数默认对所有执行计算（默认指定 `ALL` 参数），指定 `DISTINCT` 时只包含不同的值
        - `DISTINCT` 不能用于 `COUNT(*)` 
        - `DISTINCT` 必须使用列名，不能用于计算或表达式
- 使用分组可以将数据分为多个逻辑组，对每个组进行聚集计算
    - `GROUP BY` 子句可以包含任意数目的列，因而可以对分组进行嵌套，更细致地进行数据分组
    -  若 `GROUP BY` 子句中嵌套了分组，数据将在最后指定的分组上进行汇总，即在建立分组时，指定的所有列都一起计算（所以不能从个别的列取回数据）
    - `GROUP BY` 子句中列出的每一列都必须是检索列或有效的表达式（不能是聚集函数）。如果在 `SELECT` 中使用表达式，则必须在 `GROUP BY` 子句中指定相同的表达式。不能使用别名
    - 大多数 SQL 实现不允许 `GROUP BY` 列带有长度可变的数据类型(如文本或备注型字段)
    - 除聚集计算语句外，`SELECT` 语句中的每一列都必须在 `GROUP BY` 子句中给出
    - 分组列中包含具有 `NULL` 值的行，则 `NULL` 将作为一个分组返回。如果列中有多行 `NULL` 值，它们将分为一组
    - `GROUP BY` 子句必须出现在 `WHERE` 子句之后，`ORDER BY` 子句之前
- `WHERE` 过滤行，而 `HAVING` 过滤分组
- `WHERE` 在数据分组前进行过滤，`HAVING` 在数据分组后进行过滤
    - `WHERE` 排除的行不包括在分组中，这可能会改变计算值，从而影响 `HAVING` 子句中基于这些值过滤掉的分组
    - `HAVING` 与 `WHERE` 非常类似，若不指定 `GROUP BY`，则大多数 DBMS 会同等对待它们
    - 使用 `HAVING` 时应 该结合 `GROUP BY` 子句，而 `WHERE` 子句用于标准的行级过滤
- `ORDER BY` 对产生的输出排序；任意列都能使用（包括非选择的列）；不是一定要用
- `GROUP BY` 对行分组，输出的结果不一定是分组后的顺序；只可能使用选择列或表达式列，而且必须使用每个选择列表达式；与聚集函数一起使用列（或表达式），则必须使用
    - `GROUP BY` 分组的数据常常以分组后的顺序输出，但并不总是这样，这不是 SQL 规范所要求的
    - 应该提供明确的 `ORDER BY` 子句，即使其效果等同于 `GROUP BY` 子句，不要仅依赖 `GROUP BY` 排序数据
- 子查询（subquery）：嵌套在查询里的查询
    - 作为子查询的 `SELECT` 语句只能查询单个列，企图检索多个列将返回错误
- 关系表的设计就是要把信息分解成多个表，一类数据一个表，各表通过某些共同的值互相关联（所以叫关系数据库）
- 联结是一种机制，用来在一条 `SELECT` 语句中关联表，因此称为联结
    - 使用特殊的语法，可以联结多个表返回一组输出，联结在运行时关联表中正确的行
    - 在联结两个表时，实际要做的是将第一个表中的每一行与第二个表中的每一行尝试配对
    - `WHERE` 子句作为过滤条件，只包含那些匹配给定条件（这里是联结条件）的行
    - 没有 `WHERE` 子句，第一个表中的每一行将与第二个表中的每一行配对，而不管它们逻辑上是否能配在一起
    - 等值联结基于两个表之间的相等测试，也成为内联结
    - 无论何时对表进行联结，应该至少有一列不止出现在一个表中（被联结的列）
    - 内联结返回所有数据，相同的列可能出现多次
    - 自然联结排除多次出现，使每一列只返回一次
    - 外联结：联结包含了在相关表中没有关联行的行的联结
        - 使用 `OUTER JOIN` 语法时，必须使用 `RIGHT` 或 `LEFT` 关键字指定包括其所有行的表（`RIGHT` 指出的是 `OUTER JOIN` 右边的表，而 LEFT 指出的是 `OUTER JOIN` 左边的表）
# 命令

```SQL
docker exec -it candybox bash   # 进入数据库容器
psql -U postgres candybox       # 进入指定数据库
psql -U postgres tysql

\d              # show databases
\dt             # show data tables
\d users        # 查看指定表

CREATE DATABASE new_database;
SELECT prod_id, prod_name, prod_price FROM Products;    -- 检索多列
SELECT * FROM Products;                                 -- 检索所有列
SELECT DISTINCT vend_id FROM Products;                  -- 只返回不同的值
SELECT prod_name FROM Products LIMIT 5 OFFSET 5;        -- 返回第 5 行起的 5 行记录


SELECT prod_name FROM Products ORDER BY prod_name;      -- 按单个排序

SELECT prod_id, prod_price, prod_name                   -- 按多个排序
FROM Products                                           -- 仅在多个行具有相同的 prod_price 值时   
ORDER BY prod_price, prod_name;                         -- 才对产品按 prod_name 进行排序         

SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY 2, 3;                                  -- 按相对位置排序，先 prod_price 再 price_name 

SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price DESC, prod_name;            -- 按 prod_price 降序排，价格相同的按 prod_name 升序排（默认）


SELECT prod_name, prod_price
FROM Products
WHERE prod_price = 3.49;

SELECT prod_name, prod_price
FROM Products
WHERE prod_price BETWEEN 5 AND 10;

SELECT cust_name
FROM CUSTOMERS
WHERE cust_email IS NULL;

SELECT prod_name, prod_price
FROM Products
WHERE vend_id IN ( 'DLL01', 'BRS01' )
ORDER BY prod_name;

SELECT RTRIM(vend_name) || ' (' || RTRIM(vend_country) || ')'       -- 拼接字段
    AS vend_title
FROM Vendors
ORDER BY vend_name;

SELECT prod_id,
       quantity,
       item_price,
       quantity*item_price AS expanded_price
FROM OrderItems
WHERE order_num = 20008;


SELECT AVG(prod_price) AS avg_price
FROM Products
WHERE vend_id = 'DLL01';

SELECT AVG(DISTINCT prod_price) AS avg_price
FROM Products
WHERE vend_id = 'DLL01';

SELECT SUM(item_price*quantity) AS total_price
FROM OrderItems
WHERE order_num = 20005;

SELECT COUNT(*) AS num_items,
       MIN(prod_price) AS price_min,
       MAX(prod_price) AS price_max,
       AVG(prod_price) AS price_avg
FROM Products;


-- 分组
SELECT vend_id, COUNT(*) AS num_prods
FROM Products
GROUP BY vend_id;       -- GROUP BY 子句指示 DBMS 按 vend_id 排序并分组数据

SELECT vend_id, prod_id, COUNT(*) AS num_prods
FROM Products
GROUP BY vend_id, prod_id;

SELECT cust_id, COUNT(*) AS orders
FROM Orders
GROUP BY cust_id
HAVING COUNT(*) >= 2;   -- HAVING 字句过滤 COUNT(*) >= 2 （两个以上订单）的分组

SELECT vend_id, COUNT(*) AS num_prods
FROM Products
WHERE prod_price >= 4
GROUP BY vend_id
HAVING COUNT(*) >= 2;   -- 列出有 2 个及以上价格在 4 及以上产品的供应商


-- 子查询
-- 列出订购物品 RGAN01 的所有顾客
SELECT cust_name, cust_contact
FROM Customers
WHERE cust_id IN (SELECT cust_id
                  FROM Orders
                  WHERE order_num IN (SELECT order_num
                                      FROM OrderItems
                                      WHERE prod_id='RGAN01'));

-- 联结写法
SELECT cust_name, cust_contact
FROM Customers, Orders, OrderItems
WHERE Customers.cust_id = Orders.cust_id
AND OrderItems.order_num = Orders.order_num AND prod_id = 'RGAN01';                           

-- 显示 Customers 表中每个顾客的订单总数    
-- Orders.cust_id = Customers.cust_id 每次对顾客 Customers.cust_id（可以想象成 1000000001）
-- 进行计数；Customers.cust_id 和写在外面的 cust_name，cust_state 同理，每次取到一个
SELECT cust_name,
       cust_state,
       (SELECT COUNT(*)
        FROM Orders
        WHERE Orders.cust_id = Customers.cust_id) AS number_of_orders   -- 子查询 5 次
FROM Customers
ORDER BY cust_name;         


-- 联结表
SELECT vend_name, prod_name, prod_price
FROM Vendors, Products
WHERE Vendors.vend_id = Products.vend_id;   -- 创建联结 
-- 不同语法的写法
SELECT vend_name, prod_name, prod_price
FROM Vendors INNER JOIN Products
ON Vendors.vend_id = Products.vend_id;  

-- 联结多个表
-- 显示订单号为 20007 订单的物品
-- 订单物品存在 OrderItems 表中，每个产品按产品 ID 存储（引用 Products 表中的产品）
-- 产品通过供应商 ID 联结到 Vendors 表中相应的供应商，么个产品记录中存储着供应商 ID
SELECT prod_name, vend_name, prod_price, quantity 
FROM OrderItems, Products, Vendors
WHERE Products.vend_id = Vendors.vend_id
 AND OrderItems.prod_id = Products.prod_id
 AND order_num = 20007;     


-- 自联结
-- 联结要有多个表（WHERE 里），所以给一个表定义两个别名来自联结
SELECT c1.cust_id, c1.cust_name, c1.cust_contact
FROM Customers AS c1, Customers AS c2
WHERE c1.cust_name = c2.cust_name
 AND c2.cust_contact = 'Jim Jones'; 
-- 子查询写法
SELECT cust_id, cust_name, cust_contact
FROM Customers
WHERE cust_name = (SELECT cust_name
                   FROM Customers
                   WHERE cust_contact = 'Jim Jones');   

-- 外联结
-- 检索包括没有订单的顾客在内的所有顾客
SELECT Customers.cust_id, Orders.order_num
FROM Customers LEFT OUTER JOIN Orders
 ON Customers.cust_id = Orders.cust_id;                                 
```