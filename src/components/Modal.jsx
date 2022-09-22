import './css/Modal.css';
import square from '../assets/square.png';
import check from '../assets/check.png';
import {useState, useEffect} from 'react';

function Modal({open, onClose, setProviders, providers}) {
    const img_URL = 'https://image.tmdb.org/t/p/w45/'

    const [netflix, setNetflix] = useState(true);
    const [disney, setDisney] = useState(false);
    const [amazon, setAmazon] = useState(false);
    const [hbo, setHbo] = useState(false);
    const [hulu, setHulu] = useState(false);
    const [pplus, setPplus] = useState(false);
    const [active, setActive] = useState('active');

    const keys = [8,337,9,384,15,531];

    const key = {
        8: [netflix, setNetflix],
        337: [disney,setDisney],
        9: [amazon,setAmazon],
        384: [hbo,setHbo],
        15: [hulu,setHulu],
        531: [pplus,setPplus],

    }

    let net;
    let dis;
    let ap;
    let hb;
    let hu;
    let pp;

    if(netflix) {
        net = <img style={{width:25, cursor:'pointer'}}src={check} alt='square' onClick={() => {setNetflix(!netflix)}}/>
    } else {net = <img style={{width:25, cursor:'pointer'}}src={square} alt='square' onClick={() => {setNetflix(!netflix)}}/>}
    
    if(disney) {
        dis = <img style={{width:25, cursor:'pointer'}}src={check} alt='square' onClick={() => {setDisney(!disney)}}/>
    } else {dis = <img style={{width:25, cursor:'pointer'}}src={square} alt='square' onClick={() => {setDisney(!disney)}}/>}
    
    if(amazon) {
        ap = <img style={{width:25, cursor:'pointer'}}src={check} alt='square' onClick={() => {setAmazon(!amazon)}}/>
    } else {ap = <img style={{width:25, cursor:'pointer'}}src={square} alt='square' onClick={() => {setAmazon(!amazon)}}/>}

    if(hbo) {
        hb = <img style={{width:25, cursor:'pointer'}}src={check} alt='square' onClick={() => {setHbo(!hbo)}}/>
    } else {hb = <img style={{width:25, cursor:'pointer'}}src={square} alt='square' onClick={() => {setHbo(!hbo)}}/>}

    if(hulu) {
        hu = <img style={{width:25, cursor:'pointer'}}src={check} alt='square' onClick={() => {setHulu(!hulu)}}/>
    } else {hu = <img style={{width:25, cursor:'pointer'}}src={square} alt='square' onClick={() => {setHulu(!hulu)}}/>}

    if(pplus) {
        pp = <img style={{width:25, cursor:'pointer'}}src={check} alt='square' onClick={() => {setPplus(!pplus)}}/>
    } else {pp = <img style={{width:25, cursor:'pointer'}}src={square} alt='square' onClick={() => {setPplus(!pplus)}}/>}

    
    useEffect(() => {
        keys.forEach((item) => {
            if (providers.includes(item)){
                key[item][1](true)
            } else {
                key[item][1](false)
            }
    })
    },[providers])

    useEffect(()=> {
        if (netflix || disney || amazon || hbo || hulu || pplus){
            setActive('done')
        } else {setActive('disabled')}
    },[netflix, disney, amazon, hbo, hulu, pplus])

    function getProviders(){
        let providers_ = [];
        if (netflix) { providers_.push(8)}
        if (disney) { providers_.push(337)}
        if (amazon) { providers_.push(9)}
        if (hbo) { providers_.push(384)}
        if (hulu) { providers_.push(15)}
        if (pplus) { providers_.push(531)}
        setProviders(providers_);
    }

    function handleClose(e){
        e.preventDefault();
        getProviders();
        onClose();
    }

    if(!open){
        return null
    }

    return(
        <div className="modal">
            <div className="content-wrapper">
                <div className="info">
                    <h2>Streaming Services</h2>
                    <p>Select at least one streaming service to see results</p>
                </div>
                
                <div className="services">
                    <div className='item' onClick={() => {setNetflix(!netflix)}}>
                        <div className='left-item'>
                            <img src={img_URL + '/9A1JSVmSxsyaBK4SUFsYVqbAYfW.jpg'} alt='netflix' /><h3>Netflix</h3>
                        </div>
                        {net}
                    </div>
                    <div className='item' onClick={() => {setDisney(!disney)}}>
                        <div className='left-item'>
                            <img src={img_URL + '/dgPueyEdOwpQ10fjuhL2WYFQwQs.jpg'} alt='disney' /><h3>Disney+</h3>
                        </div>
                        {dis}
                    </div>
                    <div className='item' onClick={() => {setAmazon(!amazon)}}>
                        <div className='left-item'>
                            <img src={img_URL + '/68MNrwlkpF7WnmNPXLah69CR5cb.jpg'} alt='amazon' /><h3>Amazon Prime Video</h3>
                        </div>
                        {ap}
                    </div>
                    <div className='item' onClick={() => {setHbo(!hbo)}}>
                        <div className='left-item'>
                            <img src={img_URL + '/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg'} alt='hbo' /><h3>HBO Max</h3>
                        </div>
                        {hb}
                    </div>
                    <div className='item' onClick={() => {setHulu(!hulu)}}>
                        <div className='left-item'>
                            <img src={img_URL + '/giwM8XX4V2AQb9vsoN7yti82tKK.jpg'} alt='hulu' /><h3>Hulu</h3>
                        </div>
                        {hu}
                    </div>
                    <div className='item' onClick={() => {setPplus(!pplus)}}>
                        <div className='left-item'>
                            <img src={img_URL + '/pkAHkRhIq3Iu0ZlEhDzbguSlyZF.jpg'} alt='paramount' /><h3>Paramount+</h3>
                        </div>
                        {pp}
                    </div>
                </div>
                <div onClick={handleClose}className={active}><p>DONE</p></div>
            </div>
            
        </div>
    )
}

export default Modal