import Modal from './Modal';
import axios from 'axios';
import add from '../assets/add.png';
import adddone from '../assets/adddone.png';
import check2 from '../assets/check2.png';
import './css/Discover.css'
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { IoIosClose, IoIosArrowUp } from 'react-icons/io';
import { BsFillCaretDownFill } from 'react-icons/bs';
import useLocalStorage from './useLocalStorage';
import Slider from '@mui/material/Slider';

function Discover(props) {

    const [prov, setProv] = useLocalStorage("prov", [8]);
    const [sort] = useLocalStorage('sort','Popularity');
    const [op] = useLocalStorage('op', 'popularity.desc');

    const navigate = useNavigate();

    const img_URL = 'https://image.tmdb.org/t/p/w92/'
    const base_imgURL = 'http://image.tmdb.org/t/p/w400/';

    const [open, setOpen] = useState(false);
    // Providers selected
    const [providers, setProviders] = useState(prov);
    // Search Results
    const [results, setResults] = useState([]);
    // All provider info
    const [provInfo, setProvInfo]= useState([]);
    // Page number
    const [page, setPage] = useState(1);

    const [sortBy, setSortBy] = useState(sort);
    const [sortOpen, setSortOpen] = useState(false);
    const [option, setOption] = useState(op)
    const [genresOpen, setGenresOpen] = useState(false);
    const [ageOpen, setAgeOpen] = useState(false);
    const [yearOpen, setYearOpen] = useState(false);

    const MovieGenres = [12,14,16,18,27,28,35,36,37,53,80,99,878,9648,10402,10749,10751,10752,10770];
    const TVGenres = [16,18,35,37,80,99,9648,10751,10759,10762,10763,10764,10765,10766,10767,10768];

    const [activeMovieGenres, setActiveMovieGenres] = useLocalStorage('activeMovieGenres',[]);
    const [activeTVGenres, setActiveTVGenres] = useLocalStorage('activeTVGenres',[]);

    const [ageFilter, setAgeFilter] = useLocalStorage('ageFilter', 'NC-17');

    const [releaseRange, setReleaseRange] = useLocalStorage('releaseRange',[1910,2022]);
    const [value1, setValue1] = useLocalStorage('value1',[1910,2022]);

    const [to, setTo] = useState();

    

    const allGenres = [ 
        [12, 'Adventure'],
        [14, 'Fantasy'],
        [16, 'Animation'],
        [18, 'Drama'],
        [27, 'Horror'],
        [28, 'Action'],
        [35, 'Comedy'],
        [36, 'History'],
        [37, 'Western'],
        [53, 'Thriller'],
        [80, 'Crime'],
        [99, 'Documentary'],
        [878, 'Science Fiction'],
        [9648, "Mystery"],
        [10402, "Music"],
        [10749, "Romance"],
        [10751, "Family"],
        [10752, "War"],
        [10759, "Action & Adventure"],
        [10762, "Kids"],
        [10763, "News"],
        [10764, "Reality"],
        [10765, "Sci-Fi & Fantasy"],
        [10766, "Soap"],
        [10767, "Talk"],
        [10768,"War & Politics"],
        [10770, "TV Movie"],
    ];



async function getResults(){
    let responseM = await axios.get('https://api.themoviedb.org/3/discover/movie', { params: {
            api_key : '6599bc26f4ca86fd26961ad8384590da',
            language : 'en-US',
            watch_region: 'US',
            include_adult: false,
            include_video: false,
            'release_date.lte': releaseRange[1]+1,
            'release_date.gte': releaseRange[0],
            certification_country: 'US',
            'certification.lte': ageFilter,
            page: page,
            sort_by: option,
            with_watch_providers: providers.join('|'),
            with_genres: activeMovieGenres.join(','),
            with_watch_monetization_types: 'flatrate',
        }}).then(res => res.data.results.map(item => ({...item, release_date:item.release_date||'',out:item.release_date||'N/A ', media_type:'movie'})));


    let responseT = await axios.get('https://api.themoviedb.org/3/discover/tv', { params: {
            api_key : '6599bc26f4ca86fd26961ad8384590da',
            language : 'en-US',
            watch_region : 'US',
            'first_air_date.lte': releaseRange[1]+1,
            'first_air_date.gte': releaseRange[0],
            page: page,
            sort_by: option,
            include_null_first_air_dates : false,
            with_watch_monetization_types: 'flatrate',
            with_watch_providers: providers.join('|'),
            with_genres: activeTVGenres.join(','),
        }}).then(res => res.data.results.map(item => ({...item, first_air_date:item.first_air_date||'',out:item.first_air_date||'N/A ', media_type:'tv'})));
    
    if (activeMovieGenres.length === 0 && activeTVGenres.length > 0) {
        responseM = [];
    }
    if ((activeTVGenres.length === 0 && activeMovieGenres > 0) || ageFilter !== 'NC-17'){
        responseT = [];
    }
    let res = responseM.concat(responseT);


    if (sortBy === 'Popularity'){
        res = res.sort((a,b) => (a.popularity > b.popularity) ? -1 : 1);
    } else if (sortBy === 'Highly Rated'){
        res = res.sort((a,b) => (a.vote_count > b.vote_count) ? -1 : 1);
    } else if (sortBy === 'Newest'){
        res = res.sort((a,b) => (a.out > b.out) ? -1 : 1);
    }

    if (page > 1){
        setResults([...results, ...res]);
    } else {
        setResults(res);
    }
    
}

    useEffect(()=> {
        setPage(1);
        setResults([]);
        let ids = [8,337,9,384,15,531];
        setProv(providers);
        getResults();
        
        axios.get('https://api.themoviedb.org/3/watch/providers/movie?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US&watch_region=US')
            .then(res=> setProvInfo(res.data.results.filter(item => {
                return ids.includes(item.provider_id)
                })))

    },[providers, activeMovieGenres, activeTVGenres, option, ageFilter, releaseRange])

    useEffect(()=> {
        getResults();
    },[page])


    function handleScroll(){
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight){
            setPage(prev => prev + 1);
        }
    }

    useEffect(() => {
        getResults();
        window.addEventListener('scroll', handleScroll);
        setProviders(prov);

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])
    

    function handleLogoClick(name){
        let newProv = providers;
        if (newProv.length > 1){
        setProviders(newProv.filter(item => {
            return item !== name
        }))}
    }

    function scrollTop() {
        window.scrollTo(0,0);
    }

    function handleSort(name){
        setSortBy(name);
        if (name === 'Newest'){
            setOption('release_date.desc');
        } else if (name === 'Highly Rated') {
            setOption('vote_count.desc');
        } else if (name === 'Popularity'){
            setOption('popularity.desc');
        }
        setSortOpen(false);
    }

    function handleSetGenre(id){
        if (TVGenres.includes(id)){
            if(activeTVGenres.includes(id)){
                setActiveTVGenres(prev => prev.filter(item => item !== id));
            } else{
                setActiveTVGenres(prev => [...prev, id])
            }
        } if (MovieGenres.includes(id)){
            if(activeMovieGenres.includes(id)){
                setActiveMovieGenres(prev => prev.filter(item => item !== id));
            } else {
                setActiveMovieGenres(prev => [...prev, id])
            }
        } if (id === 0){
            setActiveMovieGenres([]);
            setActiveTVGenres([]);
        } 
    }

    function handleOpen(option){
        if (option === 'modal'){
            setOpen(!open);
            setGenresOpen(false);
            setAgeOpen(false);
            setYearOpen(false);
            setSortOpen(false);
        } else if (option === 'genre'){
            setOpen(false);
            setGenresOpen(!genresOpen);
            setAgeOpen(false);
            setYearOpen(false);
            setSortOpen(false);
        } else if(option === 'age'){
            setOpen(false);
            setGenresOpen(false);
            setAgeOpen(!ageOpen);
            setYearOpen(false);
            setSortOpen(false);
        } else if(option === 'year'){
            setOpen(false);
            setGenresOpen(false);
            setAgeOpen(false);
            setYearOpen(!yearOpen);
            setSortOpen(false);
        } else if(option === 'sort'){
            setOpen(false);
            setGenresOpen(false);
            setAgeOpen(false);
            setYearOpen(false);
            setSortOpen(!sortOpen);
        }
    }

    const handleChange1 = (event, newValue, activeThumb) => {
        let minDistance = 0;
        if (!Array.isArray(newValue)) {
          return;
        }
    
        if (activeThumb === 0) {
          setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
          releaseDebounce(value1);
        } else {
          setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
          releaseDebounce(value1);
        }
      };

      function valuetext(value) {
        return `${value}`;
      }
    
    
    function releaseDebounce(value){
        clearTimeout(to);

        setTo(setTimeout(() => {
            setReleaseRange(value)
        }, 1000));
    }

    

    return(
        <div className='center'>

            <h1>Discover</h1>
            <div className='selected'>
                {
                    // Map through selected providers
                    providers.map(element => {
                        // Get the information from that specific provider and return the logo
                        let selected = provInfo.filter(item => {return item.provider_id === element});
                        try{
                            return (
                                <div className='icon-container' onClick={() => handleLogoClick(element)} >
                                    <IoIosClose className='hov' />
                                    <img key={element} className='icon' src={img_URL + selected[0].logo_path} alt={selected[0].name}/>
                                   </div> 
                                    )
                        } catch {return null}
                    })
                }
                
                {(providers.length >= 6) && <img style={{cursor:'pointer'}}className='add' src={adddone} onClick={() => handleOpen('modal')} alt='add' /> }
                {(providers.length < 6) && <img style={{cursor:'pointer'}}className='add' src={add} onClick={() => handleOpen('modal')} alt='add' /> }
            </div>
            <div className="content">
                <div className="sort">
                    <div className='options-bar' >
                        <div className='sort-all' onClick={() => handleOpen('sort')} >
                            <p>{sortBy}</p>
                            <BsFillCaretDownFill/>
                            { sortOpen &&   <div className="sort-select">
                                <li onClick={() => handleSort('Highly Rated')}>Highly rated</li>
                                <li onClick={() => handleSort('Popularity')}>Popularity</li>
                                <li onClick={() => handleSort('Newest')}>Newest</li>
                                            </div> }
                        </div>
                        <div className='search-type'>
                            <li className={(value1[0] !== 1910 || value1[1]!== 2022) ? 'active1' : 'inactive1'} onClick={() => handleOpen('year')}>Released Year <BsFillCaretDownFill/></li>
                            {yearOpen && <div className='release-year'>
                                <div >
                                <div style={{display: 'flex', justifyContent:'space-between'}}><p>Release Year </p><p className={(value1[0] !== 1910 || value1[1] !== 2022) ? 'active' : 'inactive'}>{value1[0]}-{value1[1]}</p> <span id="release" onClick={() => {
                                    setValue1([1910,2022])
                                    setReleaseRange([1910,2022])
                                    }}>RESET</span>
                                    </div>
                                
                                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', alignSelf:'center', marginTop:'2em'}}>
                                <p>1910</p>
                                <Slider
                                    min={1910}
                                    max={2022}
                                    step={1}
                                    getAriaLabel={() => 'Minimum distance'}
                                    value={value1}
                                    onChange={handleChange1}
                                    valueLabelDisplay="auto"
                                    getAriaValueText={valuetext}
                                    sx={{
                                        width: '70%',
                                    }}
                                    disableSwap
                                />
                                <p>2022</p>
                                </div>
                                </div>
                            </div>}
                            <li className={(activeTVGenres.length > 0 || activeMovieGenres.length > 0) ? 'active1': 'inactive1'}onClick={() => handleOpen('genre')}>Genre <BsFillCaretDownFill/></li>
                                {genresOpen && <div className='genres'>
                                    <div style={{display:'flex', justifyContent:'space-between' ,marginRight:'1em'}}>
                                        <p>Genres</p>
                                        <span onClick={() => handleSetGenre(0)}>RESET</span>
                                    </div>
                                    <div className='genre-list' style={{display: 'flex', flexDirection:'row', flexWrap:'wrap',gap:'.5em',padding:'.5em'}}>
                                        {allGenres.map(item => {
                                            return <li className={(activeTVGenres.includes(item[0]) || activeMovieGenres.includes(item[0])) ? 'active' : 'inactive'} 
                                            onClick={() => handleSetGenre(item[0])}>{item[1]}</li>
                                        })}
                                    </div>
                                </div>}
                            
                            <li className={ageFilter !== 'NC-17' ? 'active1': 'inactive1'} ><span style={{display: 'flex',alignItems: 'center', gap:'0.5em'}} onClick={() => handleOpen('age')}>Age Filter <BsFillCaretDownFill/></span>
                            {ageOpen && <div className='age'>
                                <li onClick={() => setAgeFilter('NC-17')}>No filter {ageFilter === 'NC-17' && <img src={check2} alt='check'/>}</li>
                                <li onClick={() => setAgeFilter('PG')}>Suitable for Kids {ageFilter === 'PG' && <img src={check2} alt='check'/>}</li>
                                <li onClick={() => setAgeFilter('PG-13')}>Suitable for Teens {ageFilter === 'PG-13' && <img src={check2} alt='check'/>}</li>
                                <li onClick={() => setAgeFilter('R')}>Mature (15+) {ageFilter === 'R' && <img src={check2} alt='check'/>}</li>
                                <span style={{fontSize: '0.8em', opacity:'0.4', margin:'0 auto'}}>Only available for movies</span>
                            </div>}
                            </li>
                        </div>
                        
                    </div>
                   
                </div>
                <div className='results'>
                    {results.map(item => {
                        return <div className='title-card' onClick={() => { navigate(`/id/${item.media_type}/${item.id}`) }}>
                                <img key={item.id} src={base_imgURL + item.poster_path} alt='poster' loading='Lazy'/>
                                <div className="info">
                                {(item.media_type === 'movie') && <><p>{item.release_date.slice(0,4)}</p>
                                    <h2>{item.title}</h2>
                                    <span style={{color:'rgba(255,255,255,0.5)'}}>Movie</span></>}
                                    {(item.media_type === 'tv') && <><p>{item.first_air_date.slice(0,4)}</p>
                                    <h2>{item.name}</h2>
                                    <span style={{color:'rgba(255,255,255,0.5)'}}>TV Series</span></>}
                                    
                                </div>
                            </div>
                    })}
                </div>
                
                <Modal open={open} providers={providers} onClose={()=> {setOpen(false)}} setProviders={setProviders}/>
                <IoIosArrowUp className='scroll-up' onClick={scrollTop}/>
            </div>
        </div>
    )
}

export default Discover;

