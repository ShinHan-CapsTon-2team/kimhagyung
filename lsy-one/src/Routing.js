import {BrowserRouter, Routes, Route} from 'react-router-dom'; 

import './index.js';

import Landing from './pages/Landing';
import QuizSelIndex from './Quiz/Quizstart'
import QuizSelPhoto from './Quiz/Quiztest'
import QuizReult from './Quiz/Quizresult'
import Post from './PostUp/Post'
import Home from './Home/homepage.js'
import Reco from './PostUp/recommend.js'
import Lookup from './Lookup/Look_up.js' // 조회

function Routing() {
  return (
      <div classNamer="App">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />}/>

            <Route path ='/photoup' element={<Post />}/>
            
            <Route path ='/quizindex' element={<QuizSelIndex />}/>
            <Route path ='/quiztest' element={<QuizSelPhoto />}/>

            <Route path ='/reco' element={<Reco/>}/>
            <Route path ='/quizresult' element={<QuizReult />}/>

            <Route path ='/home' element={<Home />}/>
            <Route path ='/lookup' element={<Lookup/>}/>


          </Routes>
        </BrowserRouter>

      </div>
  );
}

export default Routing;
