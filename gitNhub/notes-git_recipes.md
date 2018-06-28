- 检出仓库
    - 创建一个本地仓库的克隆版本： `git clone /path/to/repository`
    - 检出远端服务器上的仓库： `git clone username@host:/path/to/repository`（通过 SSH）；`git clone https:/path/to/repository.git`（通过 https）
- 本地 git 仓库由 git 维护的三棵“树”
    - 工作目录，持有实际文件
    - 缓存区（Index），临时保存你的改动
    - HEAD，指向最近一次提交后的结果，总是指向当前提交
- 推送改动到远端仓库
    - `git push origin master` 推送到 master 分支；master 可以换成任何想要推送的分支
    - `git remote add origin server` 在没有克隆仓库的情况下将仓库连接到某个远程服务器
        - `origin` 是 `server` 的别名，可以取任何其他名字
- 创建代码仓库
    - `git init` 将当前目录转换成一个 git 仓库；`git init directoryName` 创建
    - `git init --bare directoryName` 创建裸仓库
        - `--bare` 标记创建了一个**没有工作目录**的仓库，将仓库标记为存储设施，而不是一个开发环境；对于所有 git 工作流， 中央仓库是裸仓库，开发者本地仓库是非裸仓库
- 拷贝 git 仓库
    - `clone` 自动创建一个名为 `origin` 的远程连接，指向原有仓库
    - `git clone repo localDir`
- git 配置
    - `./.git/config` 存放特定仓库的设置；`~/.gitconfig` 存放特定用户的设置，`--global` 标记的设置的存放位置；`$(prefix)/etc/gitconfig` 存放系统层面的设置
    - `git config --global --edit` 用编辑器打开全局配置文件

    ```bash
    git config --global user.name "slack buffer"
    git config --global user.email "zoeyeooz@gmail.com"
    git config --global core.editor vim
    git config --global alias.stt status
    git config --global alias.co checkout
    git config --global alias.br branch
    git config --global alias.up rebase
    git config --global alias.ci commit
    git config user.name            # 查看
    ```

- 保存更改
    - `git add fileName` 将某个文件中的更改加入到下次提交的缓存，`git add directoryName` 将某目录下的更改加入下次提交的缓存
        - `git add .` 保存当前目录到下次提交的缓存
    - `git add -p` 开始交互式缓存，会展示一堆更改，可以选择文件的部分更改加入到下次提交的缓存
        - `y` 将该块加入缓存，`n` 忽略该块更改，`s` 将它分割成更小块，`e` 手动编辑该块的修改，`q` 退出
- 提交
    - 提交必须是原子性的，便于追踪 bug，使回滚的代价最小
    - commit 后面的 40 个字符是提交内容生成的 SHA-1 校验总和（checksum）
    - `git commit` 会运行文本编辑器，等待输入提交信息；`git commit -m "commit message"
        - [ ] `git commit -a` 提交一份工作目录所有已跟踪文件的更改（to be verified）
        - [ ] nano，vim
    - git 对提交信息的格式没有限制，约定俗成的格式是在第一行用 50 个以内的字符总结这个提交，留一空行，然后详细阐述具体的更改

        ```bash
        Change the message displayed by hello.py

        - Update the sayHello() function to output the user's name
        - Change the sayGoodbye() function to a friendlier message
        ```

        - 很多开发者倾向于在提交信息中使用一般现在时态
- `.gitignore`
    - `*.pyc`
- `git log`
    
    ```bash
    git log -n 4        # 显示 4 个提交
    git log --oneline   # 每个提交压缩到一行
    git log --stat      # 包含修改文件的信息、增删行数
    git log -p          # 显示信息宝行每个提交的 diff
    git log --author="hofungkoeng"
    git log --grep="pattern"    # 字符串或正则表达式
    git log 3157e..8651         # 显示两个提交之间的提交，早的在前
    git log fileName            # 显示包含特定文件的提交
    git log --oneline master..some-feature  # 显示在 some-feature 分支而不在 master 分支的所有提交的概览
    ```

    - `~`  用于表示相对引用，`8651~1` 指向 `8651` 的前一个提交，`HEAD~3` 指向当前提交先前回溯 3 个节点的提交
    - `..`
- 检出
    - `git checkout` 可以检出文件、检出提交、检出分支
    - 检出提交会使工作目录和该提交完全匹配，可以用于查看项目之前的状态而不改变当前的状态
        - 此时可以查看文件，编译项目，运行测试，甚至编辑文件而不需要考虑是否会影响项目的当前状态，所做的一切操作都不会被保存到仓库中
        - 操作结束后只需回到「当前」状态（检出一下）
    - 检出文件能够查看某个特定文件的旧版本，工作目录中剩下的文件不变
        - 会影响点前项目的当前状态，就的文件会显示为“需要提交的更改”；若不想保留旧的版本，用 `git checkout HEAD fileName` 检出到最近的版本

    ```bash
    git checkout branchName                 # 切换到 master 分支
    git checkout certainCommit fileName     # 工作目录中的 fileName 文件变成 certainCommit 时的该文件的拷贝，并将该文件加入缓存区
    git checkout certainCommit              # 更新工作目录中的所有文件和某个特定提交的文件保持一致；执行命令后处于分离 HEAD 状态
    ```

    - 分离 HEAD 状态：检出之前提交后，HEAD 不再指向一个分支而是直接指向一个提交
- `git revert`
    - 用于撤销一个已经提交的快照，回滚一个单独的提交
    - 可以用于历史提交值得任何一个提交
    - 并非将要撤销的提交从项目历史移除，而是通过该提交的逆操作，加上了一个撤销该提交所做的更改的新提交，避免 git 丢失项目历史记录
    - 撤销引入 bug 的提交很方便
    - `git revert certainCommit`
- `git reset`
    - ***`reset` 只影响被跟踪的文件***
    - 可用于移除提交的快照，撤销缓存区和工作目录的修改
    - 会永久移除某个提交后的所有提交
    - 只能从点前提交向前回溯
    - 应该只用作本地修改，不应该用于和其他开发者共享的快照
    - 不加 `--hard` 某个 commit 之后的修改被放到工作区（ustagged 状态），根据需要重新提交，起到改写提交历史的效果；加 `--hard` 则该提交之后所有提交的改动都被丢弃；无论加没加 `--hard`，重设（reset）之前受跟踪文件的未提交更改都被丢弃

    ```bash
    git reset fileName      # 从 缓存区（git add 过的）移除特定文件，不改变工作目录，取消该文件的缓存
    git reset               # 重设 缓存区 使之匹配最近的一次提交，工作目录不变，取消所有文件的缓存
    git reset --hard        # 
    git commit certainCommit        # 当面分支的末端移到 certainCommit；缓存区重设到该提交，不改变工作目录；该 commit 后的所有提交保留在工作目录中；提供用更干净、原子性的快照重新提交项目历史的机会
    git commit --hard certainCommit # 在上一条命令的基础上，该 commit 之后的所有提交被清除

    # scenario

    # 编辑了hello.py和main.py

    # 缓存了目录下所有文件
    git add .

    # 意识到 hello.py 和 main.py 中的修改应该在不同的快照中提交

    # 取消 main.py 缓存
    git reset main.py

    # 只提交 hello.py
    git commit -m "Make some changes to hello.py"

    # 在另一份快照中提交 main.py
    git add main.py
    git commit -m "Edit main.py"


    # 创建一个叫`foo.py`的新文件，增加代码

    # 提交到项目历史
    git add foo.py
    git commit -m "Start developing a crazy feature"

    # 再次编辑`foo.py`，修改其他文件

    # 提交另一份快照
    git commit -a -m "Continue my crazy feature"

    # 决定废弃这个功能，并删除相关的更改
    git reset --hard HEAD~2
    ```

    - `git revert` 被设计为撤销公开的提交的安全方式，`git reset` 被设计为重设本地更改
    - 可用于取消和要提交的主题无关的修改，使提交目的明确、专一
- `git clean`
    - **将未跟踪的文件从工作目录中移除**
    - 不会删除 .gitignore 中指定的未跟踪文件

    ```bash
    git clean -n        # 预演哪些文件在执行命令后会被删除，不会真正删除
    git clean -f        # -f 仅在 `clean.requireForce` 被设为 false 时必须
    git clean -f ceatainPath    # 移除某路径下的未跟踪文件
    git clean -df       # 移除未跟踪的文件和目录
    git clean -xf       # 移除当前目录下未跟踪的文件，以及 git 一般会忽略的文件
    ```

    - build 后清理工作目录很有用，通常发布前用 `-x` 删除编译器生成的文件（如 `.o`，`.exe`）
- 重写项目历史