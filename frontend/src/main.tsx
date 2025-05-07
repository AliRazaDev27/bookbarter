import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.css'
import { Home } from './pages/homepage'
import { SignIn } from './pages/signin'
import { Dashboard } from './pages/dashboard'
import { SignUp } from './pages/signup'
import { Profile } from './pages/user'
import { Provider } from 'react-redux'
import store from './store'
import { Toaster } from './components/ui/toaster'
import { CreatePost } from './pages/createPost'
import { Posts } from './pages/posts'
import { Header } from './components/header'
import { getPosts } from './api/queries/getPosts'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
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
    path: '/create_post',
    element: <CreatePost />,
  },
  {
    path: '/posts',
    element: <Header />,
    children: [
      {
        index: true,
        element: <Posts />,
        loader: async ({ request }) => {
          const url = new URL(request.url)
          const title = url.searchParams.get('title')
          const author = url.searchParams.get('author')
          const minPrice = url.searchParams.get('minPrice')
          const maxPrice = url.searchParams.get('maxPrice')
          const currency = url.searchParams.get('currency')
          const bookCondition = url.searchParams.get('bookCondition')
          const exchangeType = url.searchParams.get('exchangeType')
          const sortBy = url.searchParams.get('sortBy')
          const languages = url.searchParams.get('languages')
          const categories = url.searchParams.get('categories')
          console.log(title, author, minPrice, maxPrice, currency, bookCondition, exchangeType, sortBy, languages, categories)
          const result = await getPosts(
            title ?? undefined,
            author ?? undefined,
            minPrice ?? undefined,
            maxPrice ?? undefined,
            currency ?? undefined,
            bookCondition ?? undefined,
            exchangeType ?? undefined,
            sortBy ?? undefined,
            languages ?? undefined,
            categories ?? undefined
          );
          return [];
        },
      }
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter>
      <Route element={<Header />}>
      <Route path='/posts' element={<Posts/>}/>
      </Route>
    </BrowserRouter> */}
      <RouterProvider router={router} />
      <Toaster />

    </Provider>
  </StrictMode>,
)
