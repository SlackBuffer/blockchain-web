# Git is not what you think
- git 核心是 persistent map；比此高一层来说，是 stupid content tracter，像一个 versioned file system
## Map
- Core: a persistent map, a table with keys and values
    - key 是 SHA1
    - value 是内容
- Git 用 SHA1 算法计算 hash
    - 20 bytes
    - 读 Shawn
    - Git 仓库的每个对象、目录、提交都有自己的 SHA1
    - SHA1 可以看做是不可能重复的，包括在自己的项目中，或是整个宇宙，不会发生冲突（collision）

    ```bash
    echo "Apple Pie" | git hash-object --stdin
    # ./.git/object/23
    目录名 23 加文件名构成 SHA1
    # 23 下的文件称为 a blob of data
    echo "Apple Pie" | git hash-object --stdin -w
    # 23991897e13e47ed0adb91a0082c31c82fe0cbe5
    git cat-file 23991897e13e47ed0adb91a0082c31c82fe0cbe5 -t    # type
    git cat-file 23991897e13e47ed0adb91a0082c31c82fe0cbe5 -p    # pretty print
    ```

- `./.git/objects`
    - object database
    - > A blob is a generic piece of **content of a file** stored in git
- Git model
    - 接受任何内容；为内容生成 SHA1；以 blob 的形式将内容保存到仓库中
## Content Tracker
- Git: the stupid content tracker
- A commit is a simple and short piece of text
    - 用户的提交（commit）仅仅是文本而已，内容包括 tree 的 SHA1、提交者、作者等元数据
        - 理解为描述本次提交包含的内容（目录、文件）和其它元数据的文本
    - Git 为提交生成 SHA1，像存储 blob 一样存储该提交到 object 数据库里

        ```bash
        git log
        # commit 8728f7f779e8dbd66aa215c8d23bdaf73a79f555 

        git cat-file 8728f7f779e8dbd66aa215c8d23bdaf73a79f555 -p  
        # tree 30a169edc02ec69b375154fa6cd65ed7570020b2
        ```

        - A tree is a directory stored in Git
    - commit 指向项目的根目录；commit 的 tree 就是项目的根目录

        ```bash
        # 包含 access permission
        git cat-file 30a169edc02ec69b375154fa6cd65ed7570020b2 -p
        # 100644 blob 9eed377bbdeb4aa5d14f8df9cd50fed042f41023    menu.txt
        # 040000 tree b392ce1b45be5f7f46a3367d4d00aba1f984674a    recipes

        git cat-file 9eed377bbdeb4aa5d14f8df9cd50fed042f41023 -p    # Apple Pie
        git cat-file b392ce1b45be5f7f46a3367d4d00aba1f984674a -p
        # 100644 blob 9450f59e0ae655157ce9ea59fe45f91504c36b37    README.txt
        # 100644 blob 9eed377bbdeb4aa5d14f8df9cd50fed042f41023    apple_pie.txt
        ```

- blob 是文件的内容，文件名和权限不存在 blob 里，存在指向该 blob 的 tree 里
    - 这样内容相同但文件名不同的文件可以只存一次，并被不同的 tree 所指向，文件名信息存储在对应的 tree 里
    - 像 windows 里的快捷方式
    - git 就像一个 versioned file system
- 内容相同，生成的 SHA1 也相同（目前发现与文件格式无关）；而提交的 SHA1 会由于作者、提交者、提交日期的不同而不一样
## versioning
- 第一次提交后的提交都会有 parent，并有一个新的 tree

    ```bash
    # 修改 menu.txt 并提交
    git cat-file 35ba3111d87ee3b50489eb025dfc434fe18e62d2 -p
    # tree 943d8d1cd268aff48fb1e7a9f31b4fda698c12b3
    # parent 8728f7f779e8dbd66aa215c8d23bdaf73a79f555   # 即上一次提交
    ```

- 内容变化就会得到一个新的 SHA1，不变的话 git 不会新建，都会指向同一个
    - 一个文件变化 => 文件的 SHA1 变化 => tree 的 SHA1 变化 => commit 的 SHA1 变化
    - git 里相同的东西只存储一次

    ```bash
    git count-objects
    ```

- 为方便理解 git model，可以把提交、blob、tree 看成**存储在数据库里的文件**
    - info，pack 文件夹是 git 底层存储优化相关的内容，可以安全地忽略
## tags
- tag
    - 分常规 tag 和 带注释的 tag
    - tag 也是 git object database 的对象

    ```bash
    # 为当前提交 create annotated tag，-a 表示 annotated
    git tag -a mytag -m "I love cheesecake"
    # show tags
    git tag

    git cat-file -p mytag
    # object 35ba3111d87ee3b50489eb025dfc434fe18e62d2 # tag 指向的对象，是一个提交
    cat .git/refs/tags/mytag
    # ae4d5dc32b776be366ba4a6aec74307e4c7c28a1
    git cat-file -p ae4d5dc32b776be366ba4a6aec74307e4c7c28a1
    # object 35ba3111d87ee3b50489eb025dfc434fe18e62d2 # tag 指向的对象，是一个提交
    ```

- Git objects
    1. Blobs (arbitrary content)
    2. trees (the equivalent of directories)
    3. commits
    4. annotated tags
# Branches
- git 仓库是一堆相互连接的 git 对象
## 分支
- branches 存放在 `refs` 和 `refs/heads` 里

    ```bash
    cat ./.git/refs/heads/master
    # 35ba3111d87ee3b50489eb025dfc434fe18e62d2  # current commit

    # 为当前提交新建分支
    git branch lisa
    cat ./.git/refs/heads/master
    # 35ba3111d87ee3b50489eb025dfc434fe18e62d2

    # 显示分支
    git branch
    ```

    - 分支仅仅是对一个提交的引用，**指向一个提交**
    - git 默认会创建 master 分支
    - 带星号的是当前分支

        ```bash
        cat .git/HEAD
        # ref: refs/heads/master
        ```

    - `HEAD` 仅仅是指向当前分支一个的引用，一个引用的引用
    - `HEAD` 只有一个，标记了当前所在的分支

        ```bash
        git checkout lisa
        ```

        - 切换分支，改变 HEAD 指向
        - checkout 命令移动 `HEAD`，更新 working area
## Merge
- 合并过来会有多个 parent

    ```bash
    # on master branch
    git merge lisa
    # 手动编辑，处理冲突后
    # 再次 add 来告知 git 冲突已处理
    git add ./recipes/apple_pie.txt
    git commit
    # git 会自动生成合并相关的信息
    # 保存退出 vim
    :wq
    git cat-file -p 17ee93d204234e9e1b398dd83f59ffd5ca5caa9b                                                             
    # parent c1b992678abdeec7c822be935356e5440e3db865
    # parent 44ac7a26346d3f074ff3b91255683d73f5120a31
    ```

- 对提交的引用用于追跟踪历史，所有其它的引用都用于跟踪内容
- checkout 的时候，git 不关心 history，不关心各个提交之间互相连接，只关心 trees 和 blobs
    - 忘记某次提交之前的历史，只关注某次提交时项目的整个状态：每个文件、目录的完整快照
    - 得到以上所述的信息后再去更新 working directory
- 只需要关心历史，提交之间的相互连接关系，放心让 git 去操作 trees 和 blobs
- git 不关心 working area，最关心数据库里的 objects（immutable，persistent）
## Merging without merging
- 在 master 分支上合并 lisa 分支后，lisa 分支也想合并 master，在 lisa 分支执行 `git merge master` 不需要像普通 merge 一样处理冲突、重新 add、再次提交，git 直接将 lisa 分支指向合并过的 master 分支
    - 称为 fast-forward
    - 这里要做的事是要得到一个包含最新版 master 和 lisa 内容的提交，但是这样的一个提交已经存在了，就是最新版的 master 提交（该提交有 master 最新版的内容，同时也有 lisa 最新版的内容，因为 lisa 也是该次提交的一个 parent）
## Losing the HEAD
- 直接 checkout 一个 commit，HEAD 指向该 commit，不再指向分支，也没有了 current branch，项目不在分支上
    - 这种情景称为 detached HEAD
    - 此种情景下进行提交操作，git 无法移动“当前分支”，只能通过直接移动 HEAD 来跟踪最新的提交

    ```bash
    git checkout 17ee93d204234e9e1b398dd83f59ffd5ca5caa9b
    cat .git/HEAD
    # 17ee93d204234e9e1b398dd83f59ffd5ca5caa9b
    git branch
    # * (HEAD detached at 17ee93d)
    # lisa
    # master
    ```

- git 的垃圾回收机制会不定时去回收数据库里无法通过分支、HEAD、或 tag 访问到的对象来释放空间
    - detach HEAD 之后的提交若不为其创建分支，就会落入上面描述的分类，在一定时候被回收
    - 每个对象仅仅是对象数据库里的一个文件
- 想要写新代码、功能时并测试时，可以 detach HEAD，做实验
    - 若想保留实验的内容，可以将实验部分做一次提交，并为其创建一个分支
    - 否则就不要为其创建分支，等待 git 执行垃圾回收
# Rebase
- 在 spaghetti 分支上执行 `git rebase master`
    - git 去找最近的既在 master 上又在 spaghetti 上的 commit，该 commit 被称为 spaghetti 的 base
    - git 将 spaghetti 上 base 以后的 commit 分离
    - git 拷贝分离出来的 commits，除了 `parent` 外其它数据都相同，结果是生成了新的 commits
    - git 将拷贝的 commits 放到 master 的顶部，并将 spaghetti 分支指向最新的提交上
    - 这要 spaghetti 的 base 就改变了，所以称为 rebase
    - 可以会需要处理冲突
    - 此后 spaghetti 分支包含了 master 分支的所有提交和 spaghetti 自身的内容
    - > 老 spaghetti 分支上的被拷贝的 commits 很可能被回收
- 然后切换回 master 分支，执行 `git rebase spaghetti`，试一次 fast-forward
## Trade-offs
- merging 会严格保留历史
    - merges never lie
    - 不过项目历史可能会变得不好看、不易理解
- rebasing refactors the project history
    - 可以使项目历史整洁
    - 可能会引起副作用
        - 同一分支上多个提交的信息完全相同
- 不确定的时候，用 merge
## Tags
- `git log -1`
- lightweigh tag
    - `git tag dinner` 为当前 commit 打 tag
    - 只打一个标签，没有其它相关信息

    ```bash
    git log -1
    # 17ee93d204234e9e1b398dd83f59ffd5ca5caa9b
    git tag dinner
    cat .git/refs/tags/dinner
    # 17ee93d204234e9e1b398dd83f59ffd5ca5caa9b
    ```

- tags 和 分支类似，区别是分支会随着提交移动，tag 永远留在同一个对象上
    - 在 master 分支上有一个新提交后，master 分支会移动并指向该新的提交，而 tag 停在原地
# Distributed
- `git clone`
    - 在本地创建一个新目录；拷贝 .git 目录到该目录；git 检出 master 目录，用 .git 里的内容重建工作区
- 在 git 仓库中 `nano .git/config`
    - 克隆一个仓库时，git 马上定义一个默认的 remote 并命名为 origin
    - remote 是本地 clone 的仓库，是本地要与之保持同步的仓库
    - The default configuration says we have one master branch that maps over the master branch of the remote
    - git 至此知道了我们要与哪个仓库同步
    - 同步之前，git 还需要知道 origin（远程）的当前状态
        - 有哪些分支；这些分支指向哪些提交等等
        - 用 `git branch --all`
        - 存在 .git/refs/remotes，只看到一个 HEAD 文件是由于 git 做了优化
- `git push` 推送本地更新（`git push origin master`）

    ```bash
    # 查看本地和远端 master 分支的指向
    git show-ref master
    ```

- 若本地有提交，远端也有不同提交，不能直接 push，先在本地处理好冲突
    - 先 `git fetch` 远端的提交，再进行 merge，再 push
    - 上面两步简化成一个命令即 `git pull`
- 底线：never rebase shared commits
- Github features (not git's)
    - `git fork` is a remote clone，从别人的 GitHub 账户克隆到自己的 GitHub 账户
    - 别人的 GitHub 项目我们不能 push，fork 后可以 push 到自己的 GitHub 账户，再从自己的 GitHub 账户可从到本地进行开发
    - 此时 github 知道自己的 GitHub 仓库和别人的 GitHub 之间的关系，但 git 不知道
    - 若需要跟踪别人仓库的更新，则需要手动填写另外一个 remote，通常命名为 upstream，指向别人的 GitHub 仓库
    - 这样别人的仓库有更新会有提示，可以 pull 下来，解决冲突，写代码，提交到 origin，pull requeset
        - > https://www.zhihu.com/question/28676261
- [x] 本地分支不手动 push 的话不会同步到 GitHub 仓库
    - `git push origin develop` 手动推送 develop 分支 


<!-- console.log(document.querySelector('video').src); -->