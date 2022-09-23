import Modal from './Modal';
import axios from 'axios';
import add from '../assets/add.png';
import adddone from '../assets/adddone.png';
// import './css/Movie.css'
import {useState, useEffect} from 'react';
import { IoIosClose, IoIosArrowUp } from 'react-icons/io';
import useLocalStorage from './useLocalStorage';
import List from './List.jsx';

function Movies() {

    const [prov, setProv] = useLocalStorage("prov", [8]);


    const img_URL = 'https://image.tmdb.org/t/p/w92/'

    const [open, setOpen] = useState(false);
    // Providers selected
    const [providers, setProviders] = useState(prov);
    // All provider info
    const [provInfo, setProvInfo]= useState([]);



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
        window.scrollTo({top:0, behavior:'smooth'});
    }

    return(
        <div className='center'>

            <h1>Movies</h1>
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
                <List name={"Popular"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        watch_region: 'US',
                        include_adult: false,
                        include_video: false,
                        page: 1,
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"Don't watch in the dark"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        watch_region: 'US',
                        certification: 'R',
                        include_adult: false,
                        include_video: false,
                        page: 1,
                        with_genres: '27,53',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"Out of this world"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        watch_region: 'US',
                        include_adult: false,
                        include_video: false,
                        with_keywords: 'black',
                        page: 1,
                        with_genres: '878,12',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"Heart-racers"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        watch_region: 'US',
                        'certification.gte': 'PG-13',
                        include_adult: false,
                        include_video: false,
                        page: 1,
                        with_genres: '53,28',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"WAR"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        watch_region: 'US',
                        include_adult: false,
                        include_video: false,
                        page: 1,
                        with_genres: '36,10752',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"Tear-jerkers"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        watch_region: 'US',
                        with_keywords: 'love',
                        include_adult: false,
                        include_video: false,
                        page: 1,
                        with_genres: '18,10749',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"LA Noir"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        'release_date.lte': 1950,
                        watch_region: 'US',
                        include_adult: false,
                        include_video: false,
                        page: 1,
                        with_genres: '80,9648',
                        with_watch_providers: providers.join('|'),
                        with_watch_monetization_types: 'flatrate'
                    }}/>
                    <List name={"Documentary"} type={'movie'} providers={providers} params={{
                        api_key: '6599bc26f4ca86fd26961ad8384590da',
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        region: 'US',
                        watch_region: 'US',
                        include_adult: false,
                        include_video: false,
                        page: 1,
                        with_genres: '99',
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

export default Movies;

