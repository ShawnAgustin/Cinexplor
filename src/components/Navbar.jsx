import './css/Navbar.css'
import { FiSearch } from 'react-icons/fi'
import noimage from '../assets/noimage.png'
import { useRef, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import cinexplor from '../assets/cinexplor.svg'

import axios from 'axios'

function Navbar() {
  const inputRef = useRef()
  const [results, setResults] = useState([])
  const timeout = useRef()
  const [scrolling, setScrolling] = useState(false)
  const base_imgURL = 'http://image.tmdb.org/t/p/w45/'

  const navigate = useNavigate()

  function handleScroll() {
    if (window.document.documentElement.scrollTop > 100) {
      setScrolling(true)
    } else {
      setScrolling(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {}, [scrolling])

  const handleSearch = () => {
    clearTimeout(timeout.current)

    if (!inputRef.current.value.trim()) {
      setResults([])
      return
    }
    timeout.current = setTimeout(() => {
      async function getResults() {
        const request = await axios.get(
          `https://api.themoviedb.org/3/search/multi?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US&query=${inputRef.current.value}&page=1&include_adult=false`
        )
        let res = request.data.results.filter((item) => {
          return item.media_type === 'tv' || item.media_type === 'movie'
        })
        setResults(res)
      }
      getResults()
    }, 100)
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate(`/search/${inputRef.current.value}`)
    inputRef.current.value = ''
  }

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setResults([])
          inputRef.current.value = ''
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef)

  return (
    <div className={scrolling ? 'navbar-container scroll' : 'navbar-container'}>
      <NavLink end to='/'>
        <img
          style={{
            width: '9em',
            marginLeft: '3em',
            marginRight: '2em',
            cursor: 'pointer',
          }}
          src={cinexplor}
          alt='cinexplor logo'
        />
      </NavLink>
      <ul className='navbar-left'>
        <NavLink style={{ fontWeight: 500 }} to='/discover'>
          Discover
        </NavLink>
        <NavLink style={{ fontWeight: 500 }} to='/shows'>
          TV Shows
        </NavLink>
        <NavLink style={{ fontWeight: 500 }} to='/movies'>
          Movies
        </NavLink>
      </ul>
      <div className='navbar-right' ref={wrapperRef}>
        <form onSubmit={handleSubmit}>
          <label>
            <FiSearch style={{ color: 'rgba(255,255,255,0.5)' }} />
            <input
              name='search'
              type='text'
              placeholder='Search for movies...'
              ref={inputRef}
              onChange={handleSearch}
            ></input>
          </label>
        </form>
        {inputRef.current?.value && results.length > 0 && (
          <ul className='search-box'>
            {results.map((item) => {
              // If it is a movie
              if (item.release_date) {
                try {
                  return (
                    <a href={`/id/movie/${item.id}`} key={item.id}>
                      {' '}
                      {item.poster_path ? (
                        <img
                          src={base_imgURL + item.poster_path}
                          alt='moviePoster'
                        />
                      ) : (
                        <img
                          className='missing-image'
                          src={noimage}
                          alt='noimage'
                        />
                      )}
                      <div className='info'>
                        {item.title}
                        <p>Movie, {item.release_date.substring(0, 4)}</p>
                      </div>
                    </a>
                  )
                } catch {
                  return (
                    <a href={`/id/movie/${item.id}`} key={item.id}>
                      {' '}
                      {item.poster_path ? (
                        <img
                          src={base_imgURL + item.poster_path}
                          alt='moviePoster'
                        />
                      ) : (
                        <img
                          className='missing-image'
                          src={noimage}
                          alt='noimage'
                        />
                      )}
                      <div className='info'>
                        {item.title}
                        <p>Movie</p>
                      </div>
                    </a>
                  )
                }
              } // If it is a show
              try {
                return (
                  <a href={`/id/tv/${item.id}`} key={item.id}>
                    {' '}
                    {item.poster_path ? (
                      <img
                        src={base_imgURL + item.poster_path}
                        alt='moviePoster'
                      />
                    ) : (
                      <img
                        className='missing-image'
                        src={noimage}
                        alt='noimage'
                      />
                    )}
                    <div className='info'>
                      {item.name}
                      <p>TV Show, {item.first_air_date.substring(0, 4)}</p>
                    </div>
                  </a>
                )
              } catch {
                return (
                  <a href={`/id/show/${item.id}`} key={item.id}>
                    {' '}
                    {item.poster_path ? (
                      <img
                        src={base_imgURL + item.poster_path}
                        alt='moviePoster'
                      />
                    ) : (
                      <img
                        className='missing-image'
                        src={noimage}
                        alt='noimage'
                      />
                    )}
                    <div className='info'>
                      {item.name}
                      <p>TV Show</p>
                    </div>
                  </a>
                )
              }
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Navbar
