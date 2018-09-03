- 4 areas
    - stash
    - **working area**
    - **index**
        - staging area
    - **repository**
- ask two questions
    1. how does this command move information across the 4 areas
    2. what does this command do this repository
# repository
- `.git`: the object database
- git objects
    1. blob: represent files
    2. tree: represent folders
    3. commit
- commits, trees, blobs 互相连接，组成项目的历史
    - 每个 commit 指向由 trees 和 blobs 组成的图，图表示该提交时的目录和文件组成（snapshot）
    - commit 之间可以共享 git 对象
    - 每个 commit（除第一个）均指向它的一个或多个 parent commit
- git 对象可以新建、删除，但不可改
- branch 是对一个 commit 的引用
    - 指向一个 commit
- HEAD 是对 current branch 的引用
    - 指向一个 current branch
    - 只能有一个 HEAD
# index
- `.git/index`
    - binary file
- 这样理解 index
    - "working tree clean" 时 index 和 repository 包含相同的文件和目录
    - 只是出于理解考虑，实际实现并非如此
- `git diff` 不加参数会比较 working area 和 index
- `git diff --cached` 比较 index 和 repository
# workflow
- `git add`
    - woking area => index
- `git rm --cached` 撤销提交到 index 上的更改，但保留 working area 上的更改
- `git rm -f` 同 时删除 woking area 和 index 上的文件
- `git commit`
    - index => repository
- `git checkout branchName`
    - HEAD (current commit) changed
    - repository => index & working area
    - `git checkout HEAD menu.txt` 只检出最新提交的一个文件
- 改名、移动文件
    - 改名前的文件被删除，改名后的文件只在工作区
    - 其实是相同文件，只是文件名变化了 (menu.txt => menu.md)
        - `git add menu.md`
        - `git add menu.txt`
            - 用 woking area 里不存在的 menu.txt 去覆盖 index 里存在的 menu.txt，即删除 index 里的 menu.txt
        - `git status`: `renamed: menu.txt -> menu.md`
        - > 两条命令简化成一条就是 `git mv menu.txt menu.md`
# `git reset`
- commands that move branches
- commit, merge, rebase, pull...
- `reset` 专为 moving branch 而存在
    1. `git reset certainCommit` 将当前分支指向另一个提交，HEAD 仍指向 reset 之前的分支，但之前的分支指向了另一个提交
    2. 第二步
        - 加 `--hard` 会将新的当前提交的内容拷贝到 index 和 working area
        - 加 `--mix` 只将新的当前提交的内容拷贝到 index（不加参数时的默认行为）
            - `git reset HEAD`
                - 跳过第一步（已经指向当前最新分支），将 stage 到 index 的内容丢弃（用最新提交的去覆盖），working area 的保存
                - 和 `git rm` 同样的效果
            - `git reset HEAD menu.txt` 只 `reset` 最新提交的部分一个文件
                - 此时 `--hard` 参数不可用
                - 用指定文件的 `checkout` 命令
        - 加 `--soft` 则不会动 index 和 working area
# stash
- `git stash --include-untracked`
    - 将更改的内容存到 stash，将最新 commit 的内容覆盖到 index 和 working area
- `git stash apply`
- `git stash clear`
# merge
- `git merge branchName`
    - 改变 working area 中有冲突的文件的内容
        - `merge` 命令会在 `.git` 目录下生成 `MERGE_HEAD`, `MERGE_MSG`, `MERGE_MODE` 文件，作为有一个 `merge` 动作正在进行的信号
    - 等待用户手动处理冲突的内容
    - 手动 `add` 后 git 才知道冲突已解决；`commit`
        - 此处的 `add` 命令有些不同
    - > 18
# history
- `git log`
    - `git log --graph --decorate --oneline`
    - `git log --patch`: detail diff
    - `git log --grep apples --online`：包含 "apples" 的提交
    - `git log -Gapples --patch`: 增删 "apples" 的提交
        - > `git help grep`
    - `git log -3 --oneline`
    - `git log HEAD~5..HEAD^ --oneline`
    - **`git log branch1..master --oneline`**
- `git show commitName/branchName/HEAD`
    - 单一 parent commit
        - `git show HEAD^^`
        - `git --no-pager show HEAD~2`
        - `^`: parent commit
    - 多个 parent commit
        - `git show HEAD~2^2`: `^2` 表示第二个 parent
    - `git show HEAD@{"1 month ago"}`
- `git blame`
    - show what revision and author last modified each line of a file
    - output 里的 `^` 表示是第一次提交是该行最新的修改
- `git diff`
    - `git diff HEAD HEAD^`
    - `git diff branch1 branch2`
# change history
- golden rule: never change shared history
- `git commit --amend`
    - fix current(latest) commit only
    - 新建一个新的最新提交，将 master 分支指向新的最新提交（HEAD 仍指向 master 分支），老的最新提交被垃圾回收
- fix old commits
    - `git rebase -i origin/master` (--interactive)
    - 适用于多次本地提交，`push` 前修理
    - > 27
- 垃圾回收前仍可恢复
    - `git reflog HEAD`
    - `git reflog refs/heads/master`
- `git revert`