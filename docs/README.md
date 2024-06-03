### 项目运行环境

```sh
$ docker-compose up -d
```

执行这个命令会根据 `website/docker-compose.yml` 文件按以下顺序开启 `4` 个容器。

`mysql` 容器主要存储数据，同时会把容器中的数据映射到 `website/mysql/data/mysql` 

`redis` 容器主要作为缓存

`nextjs` 容器为网站主要服务，该容器会在 `3000` 端口开启一个 `nodejs` 服务，负责处理 `http` 请求

`nginx` 容器主要代理 `3000` 端口和静态图片

> 因为 `4` 个容器的 `network_mode` 都为 `host` ，所以各个容器之间可以相互通信



### 开发流程

贡献代码的地方主要是 `website/nextjs/src`

。。。。。。



### 贡献指南

一般在开源社区贡献代码的方式是提 Pull request，简称 Pr

#### 创建拉取请求流程

1. 克隆仓库 `git clone git@github.com:LinZui520/website.git` 

   > 一般是==不能==在我的仓库直接提交代码的，所以得先在 `github` `fork`我的仓库
   >
   > 这个时候在你的账户里面会出现一个跟我仓库一模一样的仓库
   >
   > 然后克隆你账户里面的仓库 `git clone XXX` 并开始第二步

2. 新建分支 `git branch feature` ，分支创建规范请看下面

3. 切换分支 `git checkout feature`

4. 贡献代码 `git add XXX` 和 `git commit XXX` ，代码提交规范请看下面

5. 先更新主分支 `git checkout main` ， `git pull origin main` 

6. 防止合并有冲突 先变基 `git checkout feature` ， `git rebase main` ，有冲突解决冲突

7. 提交代码到远程仓库 `git push origin feature`

8. 打开 `github` 选择自己刚提交的分支，点击创建 `Pull request`



#### 分支规范

| 分支名称 | 解释                                                     |
| -------- | -------------------------------------------------------- |
| main     | 主分支，不应该直接在main分支上提交代码，而且合并其它分支 |
| develop  | 开发分支                                                 |
| feature  | 特性分支                                                 |
| hotfix   | 快速修复分支，提交修复代码                               |

> 这边用 `feature` 和 `hotfix` 分支即可



#### 代码提交规范

| Commit Message | 解释                             |
| -------------- | -------------------------------- |
| feat           | 新增功能                         |
| fix            | 修复功能                         |
| docs           | 更新文档                         |
| style          | 代码格式变更                     |
| refactor       | 代码重构，非新增功能，非修改功能 |
| perf           | 性能优化                         |
| test           | 增加测试用例                     |
| chore          | 构建过程或辅助工具的变动         |
| revert         | 代码回退                         |

举例 ：`docs: 更新README.md`

> `docs` 之后是==英文==的 `:` 且之后再空一个==空格==。
