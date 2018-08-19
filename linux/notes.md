- shell 是命令的解释器；terminal 用来输入命令
- command = commandName -option inputs
- 命令、option 区分大小写
- `echo`
- `cal`, `date`
- `history`
    - `!3`
    - `!!`（最近的历史命令）
    - `history -c; history -w`: 清除历史；写入该操作
- `tty`
---
- shell 会在 PATH 里找命令，从左向右找
    - `echo $PATH`
    - 同一个命令在多个目录里存在，只可能执行最前面的一个
- `which commandName`：命令所在的位置
- option 可以用一个 `-` 串联起来，顺序无关
    - 完整命令的前缀是 `--`，不是每一个命令都存在完整命令，不能串联
- input 分给 option 的 input 和给 command 的 input
    - `cal -A 1 -B 1 8 2018`
    - 有的 option 的 input 可以用 `=` 连接
---
- manual structure
    - > `man man`
    - 1: user commands
    - 5: file formatter and conventions
    - 8: system administration
    - > `man -k "list directory contents"`: Search the short manual page descriptions for keywords
    - > `man 1 which`: 1 区里的 which 命令的描述；1 可以省略
- `man` 里在 `[]` 里的参数是可选的，`<>` 里的是必填的，`[|]` 表示必须选一个；`...` 表示可以输入多个
- `man` 里找不到的命令尝试 `help`
    - `help cd`
---
- input: standard input, command line arguments
    - standard input 默认是键盘（`cat`），可以是文件，其它 data stream
    - command line arguments 就是命令的参数
    - data stream 可以 flow，命令参数与当前命令绑定
    - 不是所有命令都可以接受 standard input，几乎所有命令都可以接受命令参数（`xargs` 将 pipe 数据转成命令参数）
- output:  standard output and standard error
    - 默认的 standard output 和 standard error 是 terminal
- standard data streams:  standard input, standard output, standard error
- redirection
    - 0: standard input
    - 1: standard output
    - 2: standard error
    - > `cat 1> output.txt`: 将 standard output 定向到文件，1 可省略；`>` 会覆盖，`>>` 会 append
    - > `cat >> output.txt 2>> error.txt`
    - > `cat 0< input.txt`, `cat 0< input.txt 1> hello.txt`, 0 可省略；`cat 0<output.txt >1 /dev/pts/1`
    - `date > date.txt && cut < date.txt --delimiter=" " --fields=1`
    - redirection breaks the pipeline
- piping
    - `date | cut --delimiter=" " --fields=1 > today.txt`
    - `date | tee fulldate.txt | cut --delimiter=" " --fields=1`
    - `date | cut --delimiter=" " --fields=1 | xargs echo hello`
    - `cat filestodelete.txt | xargs rm`
---

```bash
# .bash_aliases
alias getdates='date | tee /home/ubuntu/fulldate.txt | cut --delimiter=" " --fields=1 | tee /home/ubuntu/shortdate.txt | xargs echo hello'

alias calmagic='xargs cal -A 1 -B 1 > /home/ubuntu/thing.txt'
# echo 8 2018 | calmagic
```

- > https://askubuntu.com/questions/31216/setting-up-aliases-in-zsh
---
- `/home/userName` 目录下的文件为该用户独有；其它文件则会影响到整个系统
- `/` 是根目录，`/root` 是 root 用户的家目录
- `d` 表目录，`-` 表文件
- 数组是文件的 hard link 数目，第一组是文件所属的用户，第二组是文件所属的用户组
- `cd` 回家目录
- `file`
- 文件扩展名对 Linux 不重要（对对应的第三方应用程序重要），Linux 不根据文件扩展名判断文件类型，而是根据每个文件内容的头几个字节（header）来判断
- `ls file[0-9].txt`, `ls file[1508].txt`
- `{}`

    ```bash
    mkdir {jan,feb,mar,apr}_{2018..2021}
    touch {jan,feb,mar,apr}_{2018..2021}/file{1..4}
    ls {jan,feb,mar,apr}_{2018..2021}
    ```