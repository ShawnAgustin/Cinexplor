import './css/List.css';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'


function List(props){
    const type = props.type;
    const providers = props.providers;
    const prms = props.params;
    const url = `https://api.themoviedb.org/3/discover/${type}`
    const name = props.name;

    const navigate = useNavigate();

    const imgURL = 'http://image.tmdb.org/t/p/w400/';

    const [results, setResults] = useState([]);


    useEffect(() => {
        axios.get(url, {params: {...prms}})
        .then(res => setResults(res.data.results.slice(0,10)))
        .then(console.log(name, results))
    },[providers])

    if (results.length > 0){
        return(
            <div className='list-wrapper'>
            <h2>{name}</h2>
            <div className='list'>
                {results.map(item => {
                    return <div className='img-container'> <img onClick={() => {navigate(`/id/${type}/${item.id}`)}} src={imgURL+item.poster_path} alt={item.title}/></div>
                })}
            </div>
            </div>
        )
    } else {return null}
}

export default List;