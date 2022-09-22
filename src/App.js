import './App.css';
import Navbar from './components/Navbar';

import Home from './components/Home';
import MoviePage from './components/MoviePage';
import Movies from './components/Movies';
import TVShows from './components/TVShows'
import SearchPage from './components/SearchPage.jsx';
import Discover from './components/Discover.jsx';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';

import React from 'react';

function App() {

  return (
    <div className='mainpage'>
      <Router basename={process.env.PUBLIC_URL}>
      <Navbar />
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route path='/id/:type/:id' element={<MoviePage />} />
          <Route path="/movies" element={<Movies />}/>
          <Route path='/shows' element={<TVShows />}/>
          <Route path='/search/:id' element={<SearchPage />}/>
          <Route path='/discover' element={<Discover />} />
        </Routes>
      </ Router>
    </div>
  );
}

export default App;
