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

const router = createBrowserRouter([
  {
    path: '/create_post',
    element: <CreatePost />,
  },
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
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/profile/info',
        element: <UserInfo />,
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
