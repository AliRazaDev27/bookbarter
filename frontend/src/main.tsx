import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.css'
import { SignIn } from './pages/signin'
import { Dashboard } from './pages/dashboard'
import { SignUp } from './pages/signup'
import { Provider } from 'react-redux'
import store from './store'
import { Toaster } from './components/ui/toaster'
import { CreatePost } from './pages/createPost'
import { loader, Posts } from './pages/posts'
import { Header } from './pages/homepage/header'
import { ServerEventHandler } from './pages/homepage/serverEventHanler'
import { Profile } from './pages/profile'
import { UserInfo } from './pages/profile/info'
import { ViewPosts } from './pages/profile/post/viewPosts'
import { ManagePosts } from './pages/profile/post/managePosts'
import { ManageWishlist } from './pages/profile/wishlist/manageWishlist'
import { Post } from './pages/post'
import { loader as postLoader } from './pages/post'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header />,
    children: [
      {
        index: true,
        element: <Posts />,
        loader: loader,
      },
      {
        path: '/post/:id',
        element: <Post/>,
        loader: postLoader

      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/profile/info',
        element: <UserInfo />,
      },
      {
        path: '/profile/posts/view',
        element: <ViewPosts />,
      },
      {
        path: '/profile/posts/manage',
        element: <ManagePosts />,
      },
      {
        path: '/profile/wishlist/manage',
        element: <ManageWishlist />,
      },
      {
        path: '/signin',
        element: <SignIn />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/create_post',
        element: <CreatePost />,
      },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
      <ServerEventHandler />
    </Provider>
  </StrictMode>,
)
