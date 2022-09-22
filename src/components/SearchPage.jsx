import {useParams} from 'react-router-dom';
import './css/SearchPage.css'
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';


function SearchPage(){
    let {id} = useParams();

    const navigate = useNavigate();

    const url = 'http://image.tmdb.org/t/p/w200/';

    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [num, setNum] = useState(0);
    const [data, setData] = useState('');
    const [genres, setGenres] = useState();
    const [genresTV, setGenresTV] = useState();
    const [results, setResults] = useState([]);

    function handleScroll(){
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight){
            setPage(prev => prev + 1);
        }
    }

    useEffect(()=> {
        setPage(1);
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US')
        .then(res => {
            let gen = {};
            let toMap = res.data.genres;
            toMap.forEach(item => {
                gen[item.id] = item.name;
            })
            setGenres(gen);
        })
        axios.get('https://api.themoviedb.org/3/genre/tv/list?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US')
        .then(res => {
            let gen = {};
            let toMap = res.data.genres;
            toMap.forEach((item) => {
                gen[item.id] = item.name;
            })
            
            setGenresTV(gen);
        })

        axios.get(`https://api.themoviedb.org/3/search/multi?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US&query=${id}&page=${page}&include_adult=false`)
        .then(res=> {
            setMaxPage(res.total_pages);
            setData(res.data);
            setResults(res.data.results.filter(item => {
            return item.media_type === 'tv' || item.media_type === 'movie'
                    })
        )})
        .catch(err=> console.log(err));
    },[id])

    useEffect(()=> {
            axios.get(`https://api.themoviedb.org/3/search/multi?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US&query=${id}&page=${page}&include_adult=false`)
                .then(res=> setResults([...results, ...res.data.results]))
                .catch(err=> console.log(err.message))
            

    },[page])

    useEffect(() => {
        setPage(1);
        window.addEventListener('scroll', handleScroll);
        setResults([]);

        return () => {window.removeEventListener('scroll', handleScroll)}
    }, [])



    return(
        <div className='search-page'>
            <div className='search-result'>
                <h1>Search Results for: {id}</h1>
                {results.length > 0 && <p className='total'>{data.total_results} total results</p>}
                {results.length === 0 && <p className='total'>No results found!</p>}
            </div>
        <div className='results-container'>
        
            {results.map(item => {
                    try{
                        return (
                            <div className='result-card' key={item.id} onClick={() => { navigate(`/id/${item.media_type}/${item.id}`)}}>
                                {<img src={(url + item.poster_path)} alt='movie poster' onerror="this.src='../assets/noimage.png'"/>}
                                <div className='info'>
                                    <div className='title-info'>
                                        {item.media_type === 'movie' && <span>{item.release_date.substring(0,4)}</span>}
                                        {item.media_type === 'tv' && <span>{item.first_air_date.substring(0,4)}</span>}
                                        <h2>{item.title}{item.name}</h2>
                                        {item.media_type === 'movie' && <p>Movie</p>}
                                        {item.media_type === 'tv' && <p>TV Show</p>}
                                    </div>
                                    <div className="genres">
                                        {item.genre_ids.map((gen, idx) => {
                                            if (idx >= 3){
                                                return <div></div>
                                            }
                                            if (item.media_type === 'movie'){
                                                return <li key={item.id}>{genres[gen]}</li>
                                            } else {
                                                return <li key={item.id}>{genresTV[gen]}</li>
                                            }
                                            
                                        })}
                                    </div>
                                </div>
                            </div>
                            )
                    } catch {
                        return null
                    }
                    
                
                
            })}
        </div>
        </div>
    )
}

export default SearchPage