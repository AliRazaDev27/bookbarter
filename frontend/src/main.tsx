import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Routes,Route} from 'react-router'
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/user' element={<Profile/>}/>
      {/* <Route path='/posts' element={<Posts/>}/> */}
      <Route path='/create_post' element={<CreatePost/>}/>
    </Routes>
    </BrowserRouter>
    <Toaster/>
    
</Provider>
  </StrictMode>,
)
