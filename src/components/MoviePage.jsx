import './css/MoviePage.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { BsCircleFill } from 'react-icons/bs'
import imdb from '../assets/imdb.png'

function MoviePage() {
  const base_imgURL = 'http://image.tmdb.org/t/p/original/'
  const logo_url = 'http://image.tmdb.org/t/p/w92'
  const similar_url = 'http://image.tmdb.org/t/p/w154'
  let { type, id } = useParams()
  const [MovieData, setMovieData] = useState({})
  const [rating, setRating] = useState('')
  const [runtime, setRuntime] = useState([])
  const [year, setYear] = useState('')
  const [genres, setGenres] = useState([])
  const [providers, setProviders] = useState()
  const [votes, setVotes] = useState()
  const [voteAvg, setVoteAvg] = useState()
  const [similar, setSimilar] = useState([])
  const [collection, setCollection] = useState([])
  const [collectionName, setCollectionName] = useState()

  const numberCut = (number) => {
    // If number is 4 digits
    if (number > 1000) {
      let num = number.toString()
      return num.slice(0, -3) + '.' + num[1] + 'K'
    }
    return number
  }

  useEffect(() => {
    if (type === 'show') {
      type.current = 'tv'
    }
    async function fetchData() {
      const request = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US`
      )
      const provider = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=6599bc26f4ca86fd26961ad8384590da`
      )
      let data = null
      try {
        let data = request.data
        console.log('Movie Data:', data)
        setMovieData(data)
      } catch {
        console.log('No data found')
        return
      }

      try {
        // Get Ratings
        if (type === 'movie') {
          const rtngs = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=6599bc26f4ca86fd26961ad8384590da`
          )
          const rat = rtngs.data.results.filter((item) => {
            return item.iso_3166_1 === 'US'
          })
          setRating(rat[0].release_dates[0].certification)
        } else {
          const rtngs = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US`
          )
          const rat = rtngs.data.results.filter((item) => {
            return item.iso_3166_1 === 'US'
          })
          setRating(rat[0].rating)
        }
      } catch {
        console.log('No rating available')
      }

      try {
        // Get Runtime
        data = request.data
        if (type === 'movie') {
          let rt = data.runtime
          if (rt === 0) {
            setRuntime(null)
          }
          setRuntime([Math.floor(rt / 60), rt % 60])
        } else {
          setRuntime([data.number_of_seasons, data.number_of_episodes])
        }
      } catch {
        console.log('No runtime available')
      }
      try {
        // Get Year
        data = request.data
        if (type === 'movie') {
          let yr = data.release_date.substring(0, 4)
          setYear(yr)
        } else {
          let yr = data.first_air_date.substring(0, 4)
          setYear(yr)
        }
      } catch {
        console.log('No year available')
      }
      try {
        // Get Genres
        data = request.data
        let gen = data.genres
        setGenres(gen)
      } catch {
        console.log('No genres available')
      }

      // Get Providers
      try {
        setProviders(provider.data.results['US']['flatrate'])
      } catch {
        console.log('No Providers available')
      }

      // Get vote average
      try {
        data = request.data
        setVotes(data.vote_count)
        setVoteAvg(data.vote_average.toFixed(1))
      } catch {
        console.log('No votes available')
      }

      // Get Similar Movies
      try {
        let sim = await axios.get(
          `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US&page=1`
        )
        sim = sim.data.results.filter((item) => {
          return item.id !== parseInt(id) && item.poster_path !== null
        })
        setSimilar(sim.slice(0, 5))
        // setSimilar(sim.sort((a,b) => (a.popularity > b.popularity) ? -1: 1).slice(0,5));
        if (similar[0] === null) {
          console.log('No similar movies available')
          setSimilar(null)
        }
      } catch {
        setSimilar(null)
        console.log('No similar movies available')
      }
      // Get Collection movies
      try {
        data = request.data
        if (data.belongs_to_collection !== null) {
          let collection_id = data.belongs_to_collection.id
          let collect = await axios.get(
            `https://api.themoviedb.org/3/collection/${collection_id}?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US`
          )
          setCollectionName(data.belongs_to_collection.name)
          let collect_ = collect.data.parts.filter((item) => {
            return (item.poster_path !== null) & (item.release_date !== '')
          })
          setCollection(
            collect_.sort((a, b) => (a.release_date > b.release_date ? 1 : -1))
          )
        }
      } catch {
        console.log('No collection available')
      }
    }
    fetchData()
  }, [])

  return (
    <div className='MoviePage'>
      <div className='top'>
        <div className='left'>
          <img src={base_imgURL + MovieData.poster_path} alt='poster' />
          {votes > 0 && (
            <div className='vote_info'>
              <img className='imdb' src={imdb} alt='imdb' />
              <div className='votes'>
                <p className='total-votes'>{numberCut(votes)}</p>
                <p className='voting-average'>{voteAvg} / 10</p>
              </div>
            </div>
          )}
        </div>
        <div className='right'>
          <div className='sub-info'>
            {year && <span> {year} </span>}
            {year && rating && <BsCircleFill style={{ width: '4px' }} />}
            {rating && <span>{rating}</span>}
            {year &&
              !rating &&
              (runtime[0] === null || runtime[1] === null) && (
                <BsCircleFill style={{ width: '4px' }} />
              )}
            {rating && (runtime[0] === null || runtime[1] === null) && (
              <BsCircleFill style={{ width: '4px' }} />
            )}
            {type === 'movie' && (runtime[0] === null || runtime[1] === null) && (
              <span>
                {runtime[0]}h {runtime[1]}m
              </span>
            )}
            {(type === 'tv' || type === 'show') &&
              (runtime[0] === null || runtime[1] === null) && (
                <span>
                  S{runtime[0]} E{runtime[1]}
                </span>
              )}
          </div>

          <h1>
            {MovieData.title}
            {MovieData.name}
          </h1>
          <span
            style={{ fontStyle: 'italic', fontWeight: 100, color: 'lightgrey' }}
          >
            {MovieData.tagline}
          </span>

          <ul className='genres'>
            {genres.map((item) => {
              return <li key={item.id}>{item.name}</li>
            })}
          </ul>
          {MovieData.overview}
          {providers && (
            <div className='services'>
              Available on:
              <div className='service-item'>
                {providers.map((item, idx) => {
                  return (
                    <li key={idx}>
                      <img
                        className='logo'
                        src={logo_url + item.logo_path}
                        alt='logo'
                      />
                    </li>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='other'>
        {/* { type === 'show' && <h1>Similar Shows</h1>} */}
        {similar[0] && (
          <>
            <h1>You may also like...</h1>
            <div className='similar-movies'>
              {similar.map((item) => {
                return (
                  <a href={`/id/${type}/${item.id}`} key={item.id}>
                    <img src={similar_url + item.poster_path} alt='movie' />
                  </a>
                )
              })}
            </div>{' '}
          </>
        )}
        {collection && (
          <div className='collection'>
            <h1>{collectionName}</h1>
            <div className='similar-movies'>
              {collection.map((item) => {
                return (
                  <a href={`/id/movie/${item.id}`} key={item.id}>
                    <img
                      src={similar_url + item.poster_path}
                      alt='collection'
                    />
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <img
        className='bg'
        src={base_imgURL + MovieData.backdrop_path}
        alt='movieposter'
      />
    </div>
  )
}

export default MoviePage
