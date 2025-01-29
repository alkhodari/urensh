import React, { useState, useEffect } from 'react';


import axios from 'axios';

import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';
import UserStatus, { toggleMenuAccount } from '../../response/res-auth';

export default function HeaderApp() {


    const [showSearch, setShowSearch] = useState(false);

    const toggleSearch = () => {
        setShowSearch((status) => (status === false ? true : false));
    };


    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.key == 'F1') {
            event.preventDefault();
            if (showSearch == false) {
                window.open('/help', '_blank');
            }
        }
        if (event.key == 'F2') {
            if (!showSearch) {
                toggleSearch();
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchEmpty, setSearchEmpty] = useState(true);
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchResults, setSearchResults] = useState(false);
    const [searchnotFound, setSearchNotFound] = useState(false);

    var timer = null;
    const searchChange = async (event) => {
        clearTimeout(timer);
        const query = event.target.value;
        setResults([]);
        setSearchTerm(query);
        setSearchResults(false);
        setSearchNotFound(false);
        setSearchLoader(true);


        if (query.trim() === '') {
            setSearchEmpty(true);
            setSearchLoader(false);
            setSearchResults(false);
            setSearchNotFound(false);
            return;
        }
        setSearchEmpty(false);

        axios.get('http://192.168.1.100:5000/api/search?q=' + query)
            .then((response) => {
                timer = setTimeout(() => {
                    if (response.data.message.length != 0) {
                        setSearchLoader(false);
                        setSearchResults(true);
                        setResults(response.data.message);
                    } else {
                        setResults([]);
                        setSearchLoader(false);
                        setSearchResults(false);
                        setSearchNotFound(true);
                    }
                }, 200);
            })
            .catch((error) => {
                console.error('Error fetching search:', error);
            });
    };

    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [AutoSolid, setAutoSolid] = useState(false);


    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 5) {
            setAutoSolid(true);
        } else {
            setAutoSolid(false);
        }
    };

    useEffect(() => {

        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 5) {
            setAutoSolid(true);
        }

        window.addEventListener("scroll", handleScroll);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className='header'>
            <div className={`head${AutoSolid === true ? ' scroller' : ''}`}>

                <Link to='/' className='logo mini'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="70px"
                        height="16px" viewBox="0 0 70 16" className='icon-color'>
                        <g>
                            <path d="M2.13,0.05v9.59c0,1.13,0.21,2.06,0.63,2.81c0.63,1.13,1.68,1.69,3.17,1.69c1.78,0,2.99-0.61,3.63-1.83
		c0.34-0.66,0.52-1.55,0.52-2.67V0.05h2.13v8.71c0,1.91-0.26,3.38-0.77,4.4c-0.94,1.87-2.73,2.81-5.34,2.81s-4.4-0.94-5.33-2.81
		C0.26,12.14,0,10.67,0,8.77V0.05H2.13z"/>
                            <path d="M15.27,4.26h1.81v1.95c0.15-0.38,0.51-0.84,1.09-1.39c0.58-0.55,1.24-0.82,2-0.82c0.04,0,0.1,0,0.18,0.01
		c0.08,0.01,0.23,0.02,0.43,0.04v2.01c-0.11-0.02-0.22-0.03-0.31-0.04c-0.1-0.01-0.2-0.01-0.31-0.01c-0.96,0-1.69,0.31-2.21,0.92
		s-0.77,1.33-0.77,2.13v6.51h-1.9V4.26z"/>
                            <path d="M29.47,4.57c0.75,0.38,1.33,0.86,1.72,1.46c0.38,0.57,0.63,1.24,0.76,2c0.11,0.52,0.17,1.35,0.17,2.49h-8.29
		c0.04,1.15,0.31,2.07,0.81,2.76c0.51,0.69,1.29,1.04,2.35,1.04c0.99,0,1.79-0.33,2.38-0.98c0.34-0.38,0.58-0.82,0.72-1.32h1.87
		c-0.05,0.42-0.21,0.88-0.49,1.39c-0.28,0.51-0.59,0.93-0.93,1.25c-0.58,0.56-1.29,0.94-2.15,1.14c-0.46,0.11-0.97,0.17-1.55,0.17
		c-1.41,0-2.6-0.51-3.58-1.54c-0.98-1.02-1.47-2.46-1.47-4.3c0-1.82,0.49-3.29,1.48-4.43C24.25,4.57,25.54,4,27.13,4
		C27.93,4,28.71,4.19,29.47,4.57z M30.16,9.01c-0.08-0.82-0.26-1.48-0.54-1.98c-0.52-0.92-1.39-1.37-2.61-1.37
		c-0.87,0-1.61,0.31-2.2,0.95c-0.59,0.63-0.9,1.43-0.94,2.4H30.16z"/>
                            <path d="M34.45,4.26h1.81v1.61c0.53-0.66,1.1-1.14,1.7-1.43c0.6-0.29,1.26-0.43,2-0.43c1.6,0,2.69,0.56,3.25,1.68
		c0.31,0.61,0.47,1.49,0.47,2.63v7.26h-1.93V8.44c0-0.69-0.1-1.25-0.31-1.67c-0.34-0.7-0.95-1.06-1.84-1.06
		c-0.45,0-0.82,0.05-1.11,0.14c-0.52,0.15-0.98,0.46-1.37,0.93c-0.32,0.37-0.52,0.76-0.62,1.16c-0.1,0.4-0.14,0.97-0.14,1.7v5.93
		h-1.9V4.26z"/>
                            <path d="M47.61,12.02c0.06,0.63,0.22,1.12,0.48,1.46c0.48,0.61,1.31,0.92,2.49,0.92c0.7,0,1.32-0.15,1.86-0.46
		c0.54-0.31,0.8-0.78,0.8-1.42c0-0.49-0.21-0.86-0.64-1.11c-0.27-0.15-0.82-0.33-1.63-0.54l-1.51-0.38
		c-0.96-0.24-1.67-0.51-2.13-0.8c-0.82-0.51-1.23-1.22-1.23-2.13c0-1.07,0.39-1.94,1.16-2.6c0.77-0.66,1.81-0.99,3.11-0.99
		c1.7,0,2.93,0.5,3.69,1.5c0.47,0.63,0.7,1.32,0.69,2.05h-1.79c-0.04-0.43-0.19-0.82-0.45-1.17c-0.44-0.5-1.19-0.75-2.27-0.75
		c-0.72,0-1.26,0.14-1.63,0.41c-0.37,0.27-0.56,0.64-0.56,1.09c0,0.49,0.24,0.89,0.73,1.18c0.28,0.18,0.7,0.33,1.25,0.46l1.26,0.31
		c1.37,0.33,2.28,0.65,2.74,0.96c0.74,0.49,1.11,1.25,1.11,2.29c0,1.01-0.38,1.88-1.15,2.61c-0.76,0.73-1.93,1.1-3.49,1.1
		c-1.68,0-2.88-0.38-3.58-1.15c-0.7-0.76-1.08-1.71-1.12-2.84H47.61z"/>
                            <path d="M57.29,0h1.9v5.79c0.45-0.57,0.86-0.97,1.21-1.2c0.61-0.4,1.38-0.6,2.29-0.6c1.64,0,2.75,0.57,3.34,1.72
		c0.32,0.63,0.48,1.5,0.48,2.61v7.26h-1.95V8.44c0-0.83-0.11-1.44-0.32-1.83c-0.34-0.62-0.99-0.93-1.94-0.93
		c-0.79,0-1.5,0.27-2.14,0.81c-0.64,0.54-0.96,1.57-0.96,3.07v6h-1.9V0z"/>
                        </g>
                    </svg>
                    <div className='space-10'></div> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32">
                        <path class="icon-color" d="M32,16c0,7.84-5.64,14.36-13.08,15.73C17.97,31.91,17,32,16,32s-1.97-0.09-2.92-0.27C5.64,30.36,0,23.84,0,16
	C0,7.16,7.16,0,16,0S32,7.16,32,16z"/>
                        <polygon class="icon-white" points="23.91,9.82 19.05,7 18.33,7.41 18.33,15 16,16.34 13.67,15 13.67,7.41 12.95,7 8.09,9.82 7.85,10.23 
	7.85,18.09 8.09,18.5 12.71,21.18 12.71,24.96 12.95,25.39 15.76,27 16.24,27 19.05,25.39 19.29,24.96 19.29,21.18 23.91,18.5 
	24.15,18.09 24.15,10.23 "/>
                    </svg>
                </Link>

                <div className='uspace-10'></div>

                {/* 
                <button className='icon cans-head'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className="icon">
                        <g>
                            <path d="M10.93,4.99c-1.12-0.3-2.3-0.04-3.17,0.7C7.26,6.12,7.2,6.86,7.62,7.35c0.42,0.49,1.16,0.55,1.66,0.13
		c0.28-0.24,0.65-0.32,1.03-0.22c0.35,0.1,0.65,0.39,0.74,0.74c0.13,0.49-0.06,0.83-0.19,0.99c-0.21,0.27-0.53,0.42-0.87,0.42
		c-0.65,0-1.18,0.53-1.18,1.18v1.37c0,0.65,0.53,1.18,1.18,1.18c0.65,0,1.18-0.53,1.18-1.18v-0.4c0.61-0.22,1.15-0.61,1.55-1.13
		c0.66-0.85,0.88-1.95,0.6-3.02C13.03,6.26,12.08,5.31,10.93,4.99z"/>
                            <path d="M10,0C4.49,0,0,4.49,0,10c0,5.51,4.49,10,10,10s10-4.49,10-10C20,4.49,15.51,0,10,0z M10,17.65
		c-4.22,0-7.65-3.43-7.65-7.65c0-4.22,3.43-7.65,7.65-7.65s7.65,3.43,7.65,7.65C17.65,14.22,14.22,17.65,10,17.65z"/>
                            <path d="M10,13.61c-0.65,0-1.18,0.53-1.18,1.18c0,0.65,0.53,1.18,1.18,1.18c0.65,0,1.18-0.53,1.18-1.18
		C11.18,14.13,10.65,13.61,10,13.61z"/>
                        </g>
                    </svg>


                </button>
                <div className='space-10'></div> */}

                <button onClick={toggleSearch} className='icon cans-head'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className="icon">
                        <rect class="transparent" width="20" height="20" />

                        <path d="M18.82,20c-0.3,0-0.6-0.11-0.83-0.34l-1.8-1.8c-0.03,0.02-0.05,0.04-0.08,0.06c-0.36,0.28-0.75,0.53-1.15,0.76
	c-1.69,0.96-3.63,1.39-5.55,1.3c-1.59-0.1-3.07-0.55-4.37-1.3c-0.41-0.24-0.79-0.49-1.14-0.76c-1.04-0.8-1.9-1.78-2.56-2.92
	C0.46,13.49,0,11.76,0,10C0,4.49,4.49,0,10,0s10,4.49,10,10c0,1.75-0.46,3.48-1.33,5c-0.24,0.42-0.51,0.82-0.81,1.19l1.8,1.8
	c0.46,0.46,0.46,1.2,0,1.66C19.43,19.89,19.12,20,18.82,20z M10,2.35c-4.22,0-7.65,3.43-7.65,7.65c0,1.35,0.36,2.67,1.03,3.83
	c0.5,0.87,1.16,1.62,1.95,2.22c0.28,0.21,0.59,0.41,0.9,0.6c0.98,0.57,2.1,0.91,3.26,0.98c0.2,0.01,0.35,0.02,0.51,0.02
	c1.33,0,2.64-0.35,3.79-1c0.3-0.18,0.6-0.38,0.89-0.59c0.22-0.17,0.43-0.35,0.63-0.54c0.03-0.04,0.06-0.07,0.1-0.11
	s0.07-0.07,0.11-0.1c0.43-0.44,0.8-0.94,1.12-1.48c0.67-1.16,1.02-2.48,1.02-3.82C17.65,5.78,14.22,2.35,10,2.35z"/>
                    </svg>
                    <div className='tooltip'>
                        البحث
                    </div>
                </button>
                {showSearch && (
                    <div className={`backdrop${showSearch === false ? ' hide' : ' show'}`}>
                        <button className='popupLayout-btnClose' onClick={toggleSearch}></button>

                        <div className='searchList'>
                            <div className='searchbox'>
                                <div className='space-10'></div>
                                <div className='icon-pin-20'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20">
                                        <path className="icon-head" d="M19,10c0,1.64-0.44,3.18-1.2,4.5c-0.59,1.02-1.37,1.91-2.3,2.63c-0.33,0.25-0.68,0.48-1.04,0.69
C13.14,18.57,11.62,19,10,19c-0.2,0-0.4-0.01-0.6-0.02c-1.39-0.09-2.71-0.5-3.85-1.16c-0.36-0.21-0.71-0.44-1.04-0.69
c-0.93-0.71-1.71-1.6-2.3-2.62C1.44,13.18,1,11.64,1,10c0-4.97,4.03-9,9-9C14.97,1,19,5.03,19,10z M16.36,16.36L19,19"/>
                                    </svg>
                                </div>
                                <div className='space-5'></div>
                                <input className='inp-search' onChange={searchChange} placeholder='بحث عن...' value={searchTerm} autoFocus={showSearch && true}></input>
                                <div className='space-10'></div>
                                <div className='solid-v-2'></div>
                                <div className='space-10'></div>
                                <button type='button' onClick={toggleSearch} className='icon cans-head icon-pin-20'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                                        <rect className='transparent' width="16" height="16" />
                                        <path d="M12.95,14.36L8,9.41l-4.95,4.95l-1.41-1.41L6.59,8L1.64,3.05l1.41-1.41L8,6.59l4.95-4.95l1.41,1.41L9.41,8
	l4.95,4.95L12.95,14.36z"/>
                                    </svg>
                                    <div className='tooltip'>
                                        إغلاق البحث
                                    </div>
                                </button>
                            </div>
                            <div className='solid-h-1'></div>
                            <div className='search-board'>
                                <div className={`search-guide${searchEmpty === false ? ' hide' : ''}`}>
                                    <div>
                                        <div className='guide'>إختصارات سريعة</div>
                                        <div className='dspace-20'></div>

                                        <div className='guide-content'>
                                            <div className='key-guide'>F2</div>
                                            <div className='space-10'></div>
                                            <div className='solid-v-2'></div>
                                            <div className='space-10'></div>
                                            <div className='text-guide'>إظهار أو إخفاء صندوق البحث</div>
                                        </div>
                                        <div className='dspace-10'></div>
                                        <div className='solid-h-1'></div>
                                        <div className='dspace-10'></div>
                                        <div className='guide-content'>
                                            <div className='key-guide'>TAB</div>
                                            <div className='space-10'></div>
                                            <div className='solid-v-2'></div>
                                            <div className='space-10'></div>
                                            <div className='text-guide'>تحديد عنصر من نتائج البحث</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`search-loading${searchLoader === false ? ' hide' : ' show'}`}><div className="loader"></div></div>
                                <div className={`search-results${searchResults === false ? ' show' : ' hide'}`}>
                                    {results.map((result) => (
                                        <Link to={`/product/${result.title}`} className='search-result'>
                                            <div className='space-5'></div>
                                            <img className='searchResult-img' src={`/img/${result.image}.jpg`}></img>
                                            <div className='space-20'></div>
                                            <div className='searchResult-content'>
                                                <div className='searchResult-text'>{result.title}</div>
                                                <div className='searchResult-texts'>
                                                    <div className='searchResult-quantity'><div className='product-type'>الكمية</div><div className='space-10'></div> {result.quantity}</div>
                                                    <div className='space-20'></div>
                                                    <div className='searchResult-price'><div className='product-type'>السعر</div><div className='space-10'></div>{result.price} ج.م</div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    <div className={`search-notFound${searchnotFound === false ? ' hide' : ' show'}`}>
                                        <div className='flex'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className="icon">
                                                <rect class="transparent" width="20" height="20" />

                                                <path d="M18.82,20c-0.3,0-0.6-0.11-0.83-0.34l-1.8-1.8c-0.03,0.02-0.05,0.04-0.08,0.06c-0.36,0.28-0.75,0.53-1.15,0.76
	c-1.69,0.96-3.63,1.39-5.55,1.3c-1.59-0.1-3.07-0.55-4.37-1.3c-0.41-0.24-0.79-0.49-1.14-0.76c-1.04-0.8-1.9-1.78-2.56-2.92
	C0.46,13.49,0,11.76,0,10C0,4.49,4.49,0,10,0s10,4.49,10,10c0,1.75-0.46,3.48-1.33,5c-0.24,0.42-0.51,0.82-0.81,1.19l1.8,1.8
	c0.46,0.46,0.46,1.2,0,1.66C19.43,19.89,19.12,20,18.82,20z M10,2.35c-4.22,0-7.65,3.43-7.65,7.65c0,1.35,0.36,2.67,1.03,3.83
	c0.5,0.87,1.16,1.62,1.95,2.22c0.28,0.21,0.59,0.41,0.9,0.6c0.98,0.57,2.1,0.91,3.26,0.98c0.2,0.01,0.35,0.02,0.51,0.02
	c1.33,0,2.64-0.35,3.79-1c0.3-0.18,0.6-0.38,0.89-0.59c0.22-0.17,0.43-0.35,0.63-0.54c0.03-0.04,0.06-0.07,0.1-0.11
	s0.07-0.07,0.11-0.1c0.43-0.44,0.8-0.94,1.12-1.48c0.67-1.16,1.02-2.48,1.02-3.82C17.65,5.78,14.22,2.35,10,2.35z"/>
                                            </svg>
                                            <div className='space-10'></div>
                                            <div className='searchnotFound-text'>لا يوجد ما يطابق بحثك</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className='space-10'></div>

                {UserStatus()}
                <div className='space-10'></div>

                <button onClick={toggleSearch} className='icon cans-head'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className="icon">
                        <rect class="transparent" width="20" height="20" />

                        <path d="M18.96,5.56C17.6,2.81,15,0.81,11.99,0.2c-1.29-0.27-2.7-0.27-3.98,0C5,0.81,2.4,2.81,1.05,5.55C0.36,6.92,0,8.46,0,10
	c0,1.54,0.36,3.08,1.04,4.44C2.4,17.18,5,19.19,8.01,19.8C8.65,19.93,9.32,20,10,20s1.35-0.07,1.99-0.2
	c3.01-0.61,5.61-2.62,6.96-5.35C19.64,13.08,20,11.54,20,10C20,8.46,19.64,6.92,18.96,5.56z M13.96,11.8C13.98,11.21,14,10.61,14,10
	c0-0.61-0.02-1.21-0.04-1.8h3.84C17.93,8.79,18,9.39,18,10c0,0.61-0.07,1.21-0.21,1.8H13.96z M2.21,11.8C2.07,11.21,2,10.61,2,10
	c0-0.61,0.07-1.21,0.21-1.8h3.84C6.02,8.79,6,9.39,6,10c0,0.61,0.02,1.21,0.04,1.8H2.21z M8,10c0-0.61,0.02-1.21,0.05-1.8h3.91
	C11.98,8.79,12,9.39,12,10c0,0.61-0.02,1.21-0.05,1.8H8.05C8.02,11.21,8,10.61,8,10z M17.02,6.2h-3.2
	c-0.12-1.27-0.31-2.45-0.55-3.49C14.86,3.42,16.19,4.65,17.02,6.2z M10,2c0.35,0,0.69,0.03,1.03,0.07c0.35,1.12,0.61,2.54,0.78,4.13
	H8.19c0.16-1.58,0.43-3,0.78-4.13C9.31,2.03,9.65,2,10,2z M6.73,2.71C6.49,3.75,6.3,4.93,6.18,6.2H2.97
	C3.81,4.66,5.14,3.42,6.73,2.71z M2.98,13.8h3.21c0.12,1.26,0.31,2.45,0.55,3.49C5.14,16.58,3.81,15.35,2.98,13.8z M8.97,17.92
	c-0.35-1.13-0.61-2.55-0.78-4.12h3.61c-0.16,1.58-0.43,3-0.78,4.12C10.35,18.01,9.65,18.01,8.97,17.92z M13.27,17.29
	c0.24-1.04,0.42-2.22,0.55-3.49h3.2C16.19,15.34,14.86,16.57,13.27,17.29z"/>
                    </svg>
                    <div className='tooltip'>
                        تغيير اللغة
                    </div>
                </button>
            </div>
            <div className={`solid-h-auto${AutoSolid === false ? ' hide' : ' show'}`}></div>
            <div className={`void-head${AutoSolid === true ? ' scroller' : ''}`}>
            </div>
        </div>
    );
}