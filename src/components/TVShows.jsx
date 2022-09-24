import Modal from './Modal';
import axios from 'axios';
import add from '../assets/add.png';
import adddone from '../assets/adddone.png';
import './css/Movie.css'
import {useState, useEffect} from 'react';
import { IoIosClose, IoIosArrowUp } from 'react-icons/io';
import useLocalStorage from './useLocalStorage';
import List from './List.jsx';

function TVShows() {

    const [prov, setProv] = useLocalStorage("prov", [8]);


    const img_URL = 'https://image.tmdb.org/t/p/w92/'

    const [open, setOpen] = useState(false);
    // Providers selected
    const [providers, setProviders] = useState(prov);
    // All provider info
    const [provInfo, setProvInfo]= useState([]);

    function handleKeyup(e){
        if (e.key === 'Escape'){
            setOpen(false);
        }
    }

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
    },[])

    useEffect(() => {
        let ids = [8,337,9,384,15,531];
        axios.get('https://api.themoviedb.org/3/watch/providers/movie?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US&watch_region=US')
            .then(res=> setProvInfo(res.data.results.filter(item => {
                return ids.includes(item.provider_id)
                })))
        setProviders(prov);

    }, [prov])

    useEffect(() => {
        setProv(providers)
    },[providers])


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

    return(
        <div className='center'>

            <h1>TV Shows</h1>
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
                
                {(providers.length >= 6) && <img style={{cursor:'pointer'}}className='add' src={adddone} onClick={() => setOpen(!open)} alt='add' /> }
                {(providers.length < 6) && <img style={{cursor:'pointer'}}className='add' src={add} onClick={() => setOpen(!open)} alt='add' /> }
            </div>
            <div className="content">
                <div className='lists'>
                <List name={"Popular"} type={'tv'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        watch_region: 'US',
                        include_null_first_air_dates: false,
                        page: 1,
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                <List name={"Animation"} type={'tv'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        watch_region: 'US',
                        include_null_first_air_dates: false,
                        page: 1,
                        with_genres: '16,10759',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                <List name={"Nostalgia"} type={'tv'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'vote_count.desc',
                        'first_air_date.gte': 1970,
                        'first_air_date.lte': 1990,
                        watch_region: 'US',
                        include_null_first_air_dates: false,
                        page: 1,
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"Currently airing"} type={'tv'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        watch_region: 'US',
                        include_null_first_air_dates: false,
                        page: 1,
                        with_status: 0,
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                <List name={"Documentary"} type={'tv'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        watch_region: 'US',
                        include_null_first_air_dates: false,
                        page: 1,
                        with_genres: '99',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    
                    <List name={"Comedy"} type={'tv'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        watch_region: 'US',
                        include_null_first_air_dates: false,
                        page: 1,
                        with_genres: '35',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"Who did it?"} type={'tv'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        watch_region: 'US',
                        include_null_first_air_dates: false,
                        page: 1,
                        with_genres: '9648,80',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
            </div>
            </div>
            <Modal open={open} providers={providers} onClose={()=> {setOpen(false)}} setProviders={setProviders}/>
            <IoIosArrowUp className='scroll-up' onClick={scrollTop}/>
        </div>
    )
}

export default TVShows;

