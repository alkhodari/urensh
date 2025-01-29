import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import headerApp from './appComp/header.js';
import footerApp from './appComp/footer.js';

export default function Product() {
    const [services, setServices] = useState([]);
    const { name_product } = useParams();
    const [saveDisabled, setsaveDisable] = useState(false);

    useState(() => {
    }, []);

    const [service, setService] = useState([]);

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    };

    const formatNumber = (t, number) => {
        if (t === 0) {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(number);
        }
        if (t === 1) {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(number);
        }
    };

    const saveSubmit = async (target, id, e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        setsaveDisable(!saveDisabled);

        try {
            // إرسال البيانات إلى خادم API
            const response = await fetch("http://192.168.1.100:5000/api/action?type=save&target=" + target + "&client_id=" + getCookie('client_id') + "&id=" + id + "&at=" + getCookie('at') + "&ky=" + getCookie('ky'), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status == true) {
                    console.log(data.message.code);
                    if (data.message.code == 300) {
                        document.getElementById(id).classList.add('active');
                        setsaveDisable(saveDisabled);
                    } if (data.message.code == 301) {
                        document.getElementById(id).classList.remove('active');
                        setsaveDisable(saveDisabled);
                    }
                } else {

                }
            } else {


            }
        } catch (err) {
            console.error("خطأ:", err);

        }
    };

    const basketSubmet = async (target, id, e) => {
        e.preventDefault();
        const response = await fetch("http://192.168.1.100:5000/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: 'basket.add.product', verify: { client_id: getCookie('client_id'), at: getCookie('at'), ky: getCookie('ky') }, data: { title: target, product_id: id } }),
        });

        const data = await response.json();

        if (response.ok) {
            if (data.status == true) {
                // Success
            } else {
                // Failed
            }
        } else {
            // Failure
        }
    };


    useEffect(() => {
        axios.get('http://192.168.1.100:5000/api/product?q=' + name_product)
            .then((response) => {
                document.title = response.data.message[0].t + ' | Urensh';

                console.log(response.data.message[0]);
                setService(response.data.message[0]);
                // setKeywords(response.data.keywords);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });



        const carousel = document.querySelector('.layoutDisplay-products');
        const productClickers = document.querySelectorAll('.product-title');

        let isMouseDown = false;
        let isTouchActive = false;
        let startX;
        let scrollLeft;
        let isProductClicked = false;
        let velocity = 0;
        let animationFrame;
        productClickers.forEach((productClicker) => {
            productClicker.addEventListener('mousedown', () => {
                isProductClicked = true;
            });
            productClicker.addEventListener('mouseup', () => {

                isProductClicked = false;
            });
            productClicker.addEventListener('mouseleave', () => {
                isProductClicked = false;
            });

            productClicker.addEventListener('touchstart', () => {
                isProductClicked = true;
            });
            productClicker.addEventListener('touchend', () => {
                isProductClicked = false;
            });
        });
        carousel.addEventListener('mousedown', (e) => {
            if (!isProductClicked) {
                velocity = 0;
                cancelAnimationFrame(animationFrame);
                isMouseDown = true;
                carousel.classList.add('active');
                startX = e.pageX;
                scrollLeft = carousel.scrollLeft;
            } else {
                isMouseDown = false;
            }
        });

        carousel.addEventListener('mouseleave', () => {
            if (isMouseDown) {
                carousel.classList.remove('active');
                isMouseDown = false;
            }
        });

        carousel.addEventListener('mouseup', () => {
            if (isMouseDown) {
                carousel.classList.remove('active');
                isMouseDown = false;
                startInertia();
            }
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();

            const x = e.pageX;
            const walk = (x - startX);
            velocity = walk;
            startX = x;
            scrollLeft = carousel.scrollLeft;

            carousel.scrollLeft = scrollLeft - walk;
        });

        carousel.addEventListener('touchstart', (e) => {
            if (!isProductClicked) {
                cancelAnimationFrame(animationFrame);
                isTouchActive = true;
                carousel.classList.add('active');
                startX = e.touches[0].pageX;
                scrollLeft = carousel.scrollLeft;
            } else {
                isTouchActive = false;
            }
        });

        carousel.addEventListener('touchend', () => {
            if (isTouchActive) {
                carousel.classList.remove('active');
                isTouchActive = false;
                startInertia();
            }
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isTouchActive) return;
            e.preventDefault();

            const x = e.touches[0].pageX;
            const walk = (x - startX);
            velocity = walk;
            startX = x;
            scrollLeft = carousel.scrollLeft;

            carousel.scrollLeft = scrollLeft - walk;
        });

        // تأثير القصور الذاتي (Inertia)
        function startInertia() {
            cancelAnimationFrame(animationFrame); // إلغاء أي طلب سابق لـ animation frame

            const inertia = () => {
                if (Math.abs(velocity) > 0.1) { // إذا كانت السرعة كبيرة enough
                    carousel.scrollLeft -= velocity; // تحديث موضع التمرير بناءً على السرعة
                    velocity *= 0.95; // تقليل السرعة تدريجيًا (التخميد)
                    animationFrame = requestAnimationFrame(inertia); // استمرار التأثير
                } else {
                    velocity = 0; // إيقاف التأثير عندما تصبح السرعة صغيرة
                }
            };

            animationFrame = requestAnimationFrame(inertia); // بدء التأثير
        }

        axios.get('http://192.168.1.100:5000/api/response?type=home.bestSelling')
            .then((response) => {
                setServices(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });
    }, []);


    return <div>
        {headerApp()}
        <div className='productCenter'>
            <div className='LayoutProduct'>
                <div className='GalleryProduct'>
                    <div className='LayoutProduct-images'>
                        <img src={`/img/${service.i}.jpg`} className='layoutProduct-image' />
                    </div>
                    <div className='LayoutProduct-gallery'>
                        <div className='LayoutProduct-collect'>
                            <img src={`/img/${service.i}.jpg`} className='layoutProduct-image' />
                        </div>
                    </div>
                </div>
                <div className='space-40'></div>
                <div className='LayoutProduct-info'>
                    <div>
                        <div className='LayoutProduct-name'>{service.t}</div>
                        <div className='dspace-10'></div>
                        <div className='LayoutProduct-type'>
                            السعر
                            <div className='space-10'></div><div className='flex'>
                                <div className='product-price'>{formatNumber(0, service.p)} ج.م
                                </div>
                            </div>
                        </div>
                        <div className='dspace-10'></div>

                        <div className='LayoutProduct-type'>
                            الكمية المتوفرة
                            <div className='space-10'></div><div className='flex'>
                                <div className='LayoutProduct-quantity'>{service.q} قطع
                                </div>
                            </div>
                        </div>
                        <div className='dspace-10'></div>

                        <div className='dspace-10'></div>

                        <div className='LayoutProduct-type'>
                            نوع المنتج
                            <div className='space-10'></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey icon-fl'>
                                <rect className="transparent" width="16" height="16" />
                                <path d="M13.68,3.72L7.42,0.1c-0.24-0.14-0.53-0.14-0.77,0L0.39,3.72C0.15,3.85,0,4.11,0,4.39v7.23c0,0.28,0.15,0.53,0.39,0.67
l6.26,3.61C6.76,15.97,6.9,16,7.03,16s0.27-0.03,0.39-0.1l6.26-3.61c0.24-0.14,0.39-0.39,0.39-0.67V4.39
C14.06,4.11,13.92,3.85,13.68,3.72z M11.74,4.39L7.03,7.11L2.32,4.39l4.71-2.72L11.74,4.39z M1.55,5.73l4.71,2.72v5.44l-4.71-2.72
V5.73z"/>
                            </svg>
                            <div className='space-10'></div>

                            <div className='flex'>
                                <div className='LayoutProduct-quantity'>{service.tys}
                                </div>
                            </div>
                        </div>

                        <div className='LayoutProduct-type'>
                            الماركة
                            <div className='space-10'></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                <rect className="transparent" width="16" height="16" />
                                <path d="M11.72,0.9C10.6,0.32,9.34,0,8,0S5.4,0.32,4.28,0.9l0,0C1.74,2.24,0,4.92,0,8s1.74,5.76,4.3,7.1C5.4,15.66,6.66,16,8,16
s2.58-0.34,3.7-0.92c2.56-1.32,4.3-4,4.3-7.08S14.26,2.24,11.72,0.9z M0.8,8c0-2.62,1.4-4.9,3.5-6.18l0,0C5.32,1.2,6.5,0.84,7.8,0.8
L6.9,7.34L4.3,9.36l0,0l-2.64,2.06C1.12,10.4,0.8,9.24,0.8,8z M11.72,14.16C10.62,14.82,9.36,15.2,8,15.2s-2.64-0.38-3.72-1.04
C3.3,13.58,2.5,12.78,1.9,11.82l2.38-0.98l0,0L8,9.32l3.72,1.5l0,0l2.4,0.98C13.52,12.78,12.68,13.58,11.72,14.16z M11.72,9.36
L11.72,9.36l-2.58-2L8.22,0.8c1.26,0.04,2.46,0.4,3.48,1.02l0,0c2.1,1.26,3.5,3.56,3.5,6.18c0,1.24-0.3,2.4-0.86,3.42L11.72,9.36z"
                                />
                            </svg>
                            <div className='space-10'></div>

                            <div className='flex'>
                                <div className='LayoutProduct-quantity'>{service.mn}
                                </div>
                            </div>
                        </div>
                        <div className='LayoutProduct-type'>
                            الموديل
                            <div className='space-10'></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                <rect className="transparent" width="16" height="16" />
                                <path d="M13.53,10.08V5.92c0.42-0.24,0.71-0.69,0.71-1.22c0-0.78-0.63-1.41-1.41-1.41c-0.26,0-0.49,0.07-0.7,0.19L8.53,1.41
c0,0,0,0,0,0C8.53,0.63,7.9,0,7.12,0C6.34,0,5.71,0.63,5.71,1.41l-3.6,2.08C1.9,3.37,1.67,3.29,1.41,3.29C0.63,3.29,0,3.93,0,4.71
c0,0.52,0.29,0.97,0.71,1.22v4.16C0.29,10.32,0,10.77,0,11.29c0,0.78,0.63,1.41,1.41,1.41c0.26,0,0.49-0.07,0.7-0.19l3.59,2.08
c0,0.78,0.63,1.41,1.41,1.41c0.78,0,1.41-0.63,1.41-1.41l3.59-2.07c0.21,0.12,0.44,0.19,0.7,0.19c0.78,0,1.41-0.63,1.41-1.41
C14.23,10.77,13.95,10.32,13.53,10.08z M8.53,8l3.59-2.07v4.14L8.53,8z M11.41,4.71L7.82,6.78V2.63L11.41,4.71L11.41,4.71z
 M6.41,2.63v4.14L2.82,4.71v0L6.41,2.63z M5.71,8l-3.59,2.07V5.93L5.71,8z M2.82,11.29l3.59-2.07v4.14L2.82,11.29L2.82,11.29
L2.82,11.29z M7.82,13.37V9.22l3.59,2.07l0,0L7.82,13.37z"/>
                            </svg>
                            <div className='space-10'></div>

                            <div className='flex'>
                                <div className='LayoutProduct-quantity'>{service.mln}
                                </div>
                            </div>
                        </div>
                        <div className='dspace-20'></div>
                        <div className='flex'>
                            <form onSubmit={(e) => basketSubmet(service.t, service.i, e)}>
                                <button type='submet' className='icon cans-basket'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                        <rect className="transparent" width="18" height="18" />
                                        <g>
                                            <path d="M17.07,2.89c-0.64-0.14-1.28,0.26-1.43,0.9l-1.26,5.59H3.62L2.36,3.79c-0.15-0.64-0.78-1.04-1.43-0.9
c-0.64,0.15-1.05,0.78-0.9,1.43l1.47,6.52c0.12,0.54,0.61,0.93,1.16,0.93h12.67c0.56,0,1.04-0.39,1.16-0.93l1.47-6.52
C18.12,3.68,17.71,3.04,17.07,2.89z"/>
                                            <path d="M4.35,13.74c-0.86,0-1.56,0.7-1.56,1.56c0,0.86,0.7,1.56,1.56,1.56c0.86,0,1.56-0.7,1.56-1.56
C5.91,14.44,5.21,13.74,4.35,13.74z"/>
                                            <path d="M13.65,13.74c-0.86,0-1.56,0.7-1.56,1.56c0,0.86,0.7,1.56,1.56,1.56c0.86,0,1.56-0.7,1.56-1.56
C15.21,14.44,14.51,13.74,13.65,13.74z"/>
                                            <path d="M9,8.34L9,8.34c0.5,0,0.9-0.4,0.9-0.9v-1.8h1.8c0.5,0,0.9-0.4,0.9-0.9v0c0-0.5-0.4-0.9-0.9-0.9H9.9v-1.8
c0-0.5-0.4-0.9-0.9-0.9h0c-0.5,0-0.9,0.4-0.9,0.9v1.8H6.3c-0.5,0-0.9,0.4-0.9,0.9v0c0,0.5,0.4,0.9,0.9,0.9h1.8v1.8
C8.1,7.94,8.5,8.34,9,8.34z"/>
                                        </g>
                                    </svg>
                                    <div className='space-10'></div>
                                    إضافة للسلة
                                </button>
                            </form>
                            <div className='space-10'></div>
                            <div className='solid-v-2'></div>
                            <div className='space-10'></div>
                            <form onSubmit={(e) => saveSubmit(service.t, service.i, e)}>
                                <button type='submit' className={`icon cans-pd ${service.is_saved ? ' active' : ''}`} id={service.id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                        <rect className='transparent' width="18" height="18" />
                                        <path d="M15.44,0H2.56C1.84,0,1.27,0.58,1.27,1.29v15.42c0,1.07,1.23,1.67,2.08,1.02l4.87-3.76c0.46-0.36,1.11-0.36,1.58,0
l4.87,3.76c0.85,0.66,2.08,0.05,2.08-1.02V1.29C16.73,0.58,16.16,0,15.44,0z M14.74,3.67c0,0.6-0.49,1.09-1.09,1.09H4.36
c-0.6,0-1.09-0.49-1.09-1.09V3.35c0-0.6,0.49-1.09,1.09-1.09h9.28c0.6,0,1.09,0.49,1.09,1.09V3.67z"/>

                                    </svg>
                                    <div className='tooltip'>
                                        حفظ
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='dspace-20'></div>
        <div className='flex h-center c-center'>
            <div>
                <div className='productCenter-ratingText'>{service.total_ratings ? (service.average_rating).toFixed(1) : ('0.0')}</div>
                <div className='dspace-20'></div>
                <div className='productCenter-rating'>

                    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                        <rect className="transparent" width="14" height="18" />
                        <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 1.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                        <rect className="transparent" width="14" height="18" />
                        <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 2.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                        <rect className="transparent" width="14" height="18" />
                        <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 3.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                        <rect className="transparent" width="14" height="18" />
                        <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 4.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                        <rect className="transparent" width="18" height="18" />
                        <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                    </svg>
                </div>
                <div className='productCenter-totalRating'>
                    ({service.total_ratings ? formatNumber(1, service.total_ratings) : '0'})
                </div>
            </div>
            <div className='space-40'></div>
            <div>
                <div className='productCenter-ratingsProgress'>
                    <div className='flex'>
                        <div className='productCenter-ratintNum'>5.0</div>
                        <div className='space-10'></div>
                        <div className='productCenter-ratingProgress'>
                            <div className='productCenter-ratingAct'></div>
                        </div>
                        <div className='productCenter-totalRating'>
                            <div className='space-10'></div>({service.total_ratings ? formatNumber(1, service.total_ratings) : '0'})
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='productCenter-ratintNum'>4.0</div>
                        <div className='space-10'></div>
                        <div className='productCenter-ratingProgress'>

                        </div>
                        <div className='productCenter-totalRating'>
                            <div className='space-10'></div>(0)
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='productCenter-ratintNum'>3.0</div>
                        <div className='space-10'></div>
                        <div className='productCenter-ratingProgress'>
                        </div>
                        <div className='productCenter-totalRating'>
                            <div className='space-10'></div>(0)
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='productCenter-ratintNum'>2.0</div>
                        <div className='space-10'></div>
                        <div className='productCenter-ratingProgress'>
                        </div>
                        <div className='productCenter-totalRating'>
                            <div className='space-10'></div>(0)
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='productCenter-ratintNum'>1.0</div>
                        <div className='space-10'></div>
                        <div className='productCenter-ratingProgress'>

                        </div>
                        <div className='productCenter-totalRating'>
                            <div className='space-10'></div>(0)
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <div className='productCenter-Comments'>
            <div className='productCenter-Comment'>
                <div className='productCenter-'>

                </div>
            </div>
        </div> */}

        <div className='layoutHome-bestSelling'>
            <div className='layoutDisplay-text'>منتجات مشابهة<div className='uspace-10'></div><Link to={'/shop'} className='layoutDisplay-btn'>عرض الكل<div className='space-10'></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" class="icon-color"><rect class="transparent" width="16" height="16"></rect><path d="M12.24,14.05c0.45,0.45,0.45,1.17,0,1.62C12.01,15.89,11.72,16,11.43,16c-0.29,0-0.58-0.11-0.81-0.33L3.76,8.81
 c-0.45-0.45-0.45-1.17,0-1.62l6.86-6.86c0.45-0.45,1.17-0.45,1.62,0c0.45,0.45,0.45,1.17,0,1.62L6.19,8L12.24,14.05z"></path></svg>

            </Link></div>
            <div className={`layoutDisplay`}>
                <div className='layoutDisplay-products'>
                    {services.map((service) => (
                        <div className='sh-product'>
                            <div className='flwd'>
                                <div className='flex fwid h-center'>
                                    <Link to={`/product/${service.title}`} className='preventDefault'>
                                        <img src={`/img/${service.image}.jpg`} className='product-img'></img>
                                    </Link>
                                </div>

                                <div className='space-20'></div>
                                <div className='product-disc'>

                                    <div className='flex'>
                                        <div className='LayoutProduct-name'>{service.title}</div>
                                    </div>
                                    <div className='flex'>
                                        <div className='product-type'>
                                            السعر
                                            <div className='space-10'></div><div className='flex'>
                                                <div className='product-price'>{formatNumber(0, service.price)} ج.م
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            <div className='LayoutProduct-rating'>
                                                <div className='LayoutProduct-ratingText'>{service.total_ratings ? (service.average_rating) : ('0.0')}</div>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                    <rect className="transparent" width="18" height="18" />
                                                    <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 1.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                    <rect className="transparent" width="18" height="18" />
                                                    <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 2.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                    <rect className="transparent" width="18" height="18" />
                                                    <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 3.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                    <rect className="transparent" width="18" height="18" />
                                                    <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating === 5 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                    <rect className="transparent" width="18" height="18" />
                                                    <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                </svg>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div className='product-type'>
                                            عدد التقييمات
                                            <div className='space-10'></div><div className='flex'>
                                                <div className='product-price'>{service.total_ratings ? (service.total_ratings) : ('لا يوجد')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 
                            <div className='dspace-10'></div>

                            <div className='flex'>
                                <button onClick='' className='product-buy'>شراء الآن</button>
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className='toastNotif'>
            <div className='toastNotif-bg'>
                <div className='toastNotif-gd'></div>
                <div className='toastNotif-content'>
                    <div className='progress-icon'>
                        <div
                            className="progress-circle success"
                            style={{ "--progress": 60 }}
                        >
                            <svg width="38" height="38" viewBox="0 0 38 38">
                                <circle className="background" cx="19" cy="19" r="15"></circle>
                                <circle className="progress" cx="19" cy="19" r="15"></circle>
                            </svg>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" className='icon-toast success'>
                            <rect className="transparent" width="24" height="24" />
                            <path d="M10.33,16.33c-0.26,0-0.51-0.1-0.71-0.29l-3.33-3.33c-0.39-0.39-0.39-1.02,0-1.41s1.02-0.39,1.41,0l2.63,2.63
	l5.96-5.96c0.39-0.39,1.02-0.39,1.41,0s0.39,1.02,0,1.41l-6.67,6.67C10.85,16.24,10.59,16.33,10.33,16.33z"/>
                            {/* <path d="M13.41,12l2.63-2.63c0.39-0.39,0.39-1.02,0-1.41c-0.39-0.39-1.02-0.39-1.41,0L12,10.59L9.37,7.96
	c-0.39-0.39-1.02-0.39-1.41,0c-0.39,0.39-0.39,1.02,0,1.41L10.59,12l-2.63,2.63c-0.39,0.39-0.39,1.02,0,1.41
	c0.2,0.2,0.45,0.29,0.71,0.29s0.51-0.1,0.71-0.29L12,13.41l2.63,2.63c0.2,0.2,0.45,0.29,0.71,0.29s0.51-0.1,0.71-0.29
	c0.39-0.39,0.39-1.02,0-1.41L13.41,12z"/> */}
                        </svg>
                    </div>
                    <div className='space-20'></div>
                    <div>
                        <div className='toastNotif-bigText'>ناجح</div>
                        <div className='toastNotif-smailText'>تم إضافة المنتج إلي السلة.</div>

                    </div>
                </div>

            </div>

        </div>
        {footerApp()}
    </div>;
}