import axios from 'axios';
import Footer from './Footer';
import './css/Home.css';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io'; 
import ap from '../assets/ap.png';
import dplus from '../assets/dplus.png';
import hbo from '../assets/hbo.png';
import net from '../assets/net.png';
import hulu from '../assets/hulu.png';


import Slider from 'react-slick';
import React, {useState, useEffect} from 'react';

function Home() {

  const [isActive] = useState(true);
  const [seconds, setSeconds] = useState(0);

    const NextArrow = ({onClick}) => {
      return(
        <div className='arrow next' onClick={onClick}>
          <IoIosArrowForward />
        </div>
      )
    }
    const PrevArrow = ({onClick}) => {
      return(
        <div className='arrow prev' onClick={onClick}>
          <IoIosArrowBack />
        </div>
      )
    }

    const base_imgURL = 'http://image.tmdb.org/t/p/w300/';
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    // const images = [one, two, three,four, five];

    useEffect(()=> {
      let interval = null;
      if (isActive) {
        interval = setInterval(() => {
          setSeconds(seconds => seconds + 1);
        }, 5000);
      } else if (!isActive && seconds !== 0) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    },[isActive, seconds])


    const settings = {
      infinite: true,
      lazyLoad: true,
      autoplaySpeed: 6500,
      pauseOnFocus: true,
      speed: 500,
      slidesToShow: 3,
      autoplay: true,
      swipeToSlide: true,
      centerMode: true,
      centerPadding: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ],
      nextArrow: <NextArrow />,
      prevArrow:<PrevArrow />,
      beforeChange: (current, next) => setImageIndex(next)
    }

    useEffect(()=>{
      async function fetchData() {
        const request = await axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=6599bc26f4ca86fd26961ad8384590da&language=en-US&page=1&region=us');
        let latest = request.data;
        setImages(latest.results);
      }
      fetchData();
    },[])

    return(
      <>
        <div className='content'>
          <div className='content-left'>
            <h2>Don’t waste <br/>time browsing.
            </h2>
              <p>Instantly find where to stream movies and shows. See what’s trending <br /> and discover something new.
                </p>
              <ul className='logo-list'>
                <img className= 'logo-icon' src={net} alt='Netflix' />
                <img className= 'logo-icon' src={dplus} alt ='Disney+' />
                <img className= 'logo-icon' src={ap} alt='AmazonPrime' />
                <img style={{width:'6em'}}className= 'logo-icon' src={hbo} alt='HBOMax' />
                <img className= 'logo-icon' src={hulu} alt='Hulu' />
                
                

              </ul>
              
          </div>
          <div className='content-right'>
            <h1>In theatres</h1>
            <Slider {...settings}>
              {images.map((img, idx) => {
                if (img.release_date){
                  return(
                  <a href={`/id/movie/${img.id}`}key={idx} className={idx === imageIndex ? 'activeSlide' : 'slide'}>
                  <img src={base_imgURL + img.poster_path} alt={img} />
                </a>
              )}
              return (
                <a href={`/id/show/${img.id}`}key={idx} className={idx === imageIndex ? 'activeSlide' : 'slide'}>
                  <img src={base_imgURL + img.poster_path} alt={img} />
                </a>
              )
                
              })}
            </Slider>
          </div>
      </div>
      <Footer />
      </>
  )
  
}

export default Home;