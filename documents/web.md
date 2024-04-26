### 前端代码细节

忽略掉一些无关配置文件



`web/Dockerfile` 这是一个 `node` 容器配置文件

这个容器的主要任务是将前端代码编译成 `html` + `css` + `javascript`



`src` 下面有若干文件夹，这是前端代码的主要文件，逐个分析

- `web/src/utils`：这里主要是一些工具函数的封装，比如 `request.ts`

  这个文件里面定义了 `request` 函数，通过这个函数能获取一个 `axios` 实例

  `axios` 是一个网络请求库封装的函数可以与后端交互

- `web/src/api`：这里面的代码是将与后端的请求封装成一个个函数，比如 `user.ts`

  ```ts
  export const UserLogin = (username: string, password: string) => request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password,
    }
  })
  ```

  通过这个 `UserLogin` 函数可以实现登录功能

- `web/src/hooks`：这里面主要是一些功能封装成一个个功能函数 `hook` ，比如 `user/useUserLogin.ts`

  这个文件将用户登录的逻辑都封装在一个 `hook` 里面，

  `hook` 的命名方式通常是 `useXXX.ts` 代表使用某种功能

  然后登录页面要使用这个 `hook` ，比如`web/src/pages/Login.tsx`

  ```tsx
  const {
    username,
    setUsername,
    password,
    setPassword,
    contextHolder,
    navigateSecurity,
    navigateRegister,
    login
  } = useUserLogin()
  ```

- `web/src/router`：这里面的 `index.tsx` 定义了网站的路由

- `web/src/redux`：这里的主要存放一些需要全局存储的变量，**个人理解**

- `web/src/assets`：这里主要存放一些静态资源，图片与字体

- `web/src/pages` 与 `web/src/components` 这两个文件夹存放就是前端界面的样式

  `pages` 文件夹下文件严格按照路由来，比如

  `pages/Login.tsx` 这个文件的路由就是 `/login`

  `pages/articles.tsx` 这个文件的路由就是 `/articles`

  `pages/admin/UserManager.tsx` 这个文件的路由就是 `/admin/user`

  `components` 文件夹下存放的是某个界面的组件，比如

  `components/articles/ArticleHeader.tsx` 和 `components/articles/ArticleMain.tsx` 

  这两个文件就是 `/articles` 路由界面的组件，可以查看 `pages/articles.tsx`

  ```tsx
  import ArticlesMain from "../components/articles/ArticlesMain";
  import ArticlesHeader from "../components/articles/ArticlesHeader";
  
  const Articles = () => {
      
      const { articles, isLoaded } = useFetchArticles()
      
      return (
      	<>
          	<ArticlesHeader />
        		<ArticlesMain articles={articles}/>
          </>
      )
  }
  
  export default Articles;
  ```

  这里  `useFetchArticles()` 就是定义在 `hooks` 文件夹下的从后端获取文章列表的 `hook`