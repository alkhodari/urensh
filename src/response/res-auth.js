import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const toggleMenuAccount = (status) => (status === false ? true : false);

function formatDate(timestamp) {
	const date = new Date(timestamp);
	const now = new Date();

	const differenceInMilliseconds = now - date;
	const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
	const differenceInMinutes = Math.floor(differenceInSeconds / 60);
	const differenceInHours = Math.floor(differenceInMinutes / 60);
	const differenceInDays = Math.floor(differenceInHours / 24);
	const differenceInWeeks = Math.floor(differenceInDays / 7);
	const differenceInMonths = Math.floor(differenceInDays / 30); // تقريبي

	const formattedDate = ` ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} • ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

	if (date.getFullYear() === now.getFullYear()) {
		if (differenceInDays === 0) {
			return `اليوم • ${formattedDate}`;
		} else if (differenceInDays === 1) {
			return `البارحة • ${formattedDate}`;
		} else if (differenceInDays === 2) {
			return `منذ يومين • ${formattedDate}`;
		} else if (differenceInDays <= 3) {
			return `منذ ${differenceInDays} أيام • ${formattedDate}`;
		} else if (differenceInWeeks === 1) {
			return `منذ أسبوع • ${formattedDate}`;
		} else if (differenceInWeeks === 2) {
			return `منذ أسبوعين • ${formattedDate}`;
		} else if (differenceInWeeks <= 3) {
			return `منذ ${differenceInWeeks} أسابيع • ${formattedDate}`;
		} else if (differenceInMonths === 1) {
			return `منذ شهر • ${formattedDate}`;
		} else if (differenceInMonths <= 2) {
			return `منذ ${differenceInMonths} أشهر • ${formattedDate}`;
		} else {
			return `في ${formattedDate}`;
		}
	} else {
		return `${formattedDate}`;
	}
}

function animateLine(type, line, x, y, duration) {
	if (type === 0) {
		const startX1 = parseFloat(line.getAttribute("x1"));
		const startY1 = parseFloat(line.getAttribute("y1"));

		const deltaX = x - startX1;
		const deltaY = y - startY1;

		let startTime = null;

		function step(timestamp) {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);

			// تحديث الإحداثيات
			line.setAttribute("x1", startX1 + deltaX * progress);
			line.setAttribute("y1", startY1 + deltaY * progress);

			// استمرار الحركة حتى الاكتمال
			if (progress < 1) {
				requestAnimationFrame(step);
			}
		}

		requestAnimationFrame(step);
	}
	if (type === 1) {
		const startX2 = parseFloat(line.getAttribute("x2"));
		const startY2 = parseFloat(line.getAttribute("y2"));

		const deltaX = x - startX2;
		const deltaY = y - startY2;

		let startTime = null;

		function step(timestamp) {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);

			line.setAttribute("x2", startX2 + deltaX * progress);
			line.setAttribute("y2", startY2 + deltaY * progress);

			if (progress < 1) {
				requestAnimationFrame(step);
			}
		}

		requestAnimationFrame(step);
	}
}



export default function UserStatus() {

	const [basketsProducts, setBasketProducts] = useState([]);
	const [baskets, setBasketData] = useState([]);

	const [showMenuAccount, setMenuAccount] = useState(false);
	const [showBasket, setBasket] = useState(false);

	const [selectedProducts, setSelectedProducts] = useState({});

	const [quantitys, setQuantitys] = useState({});


	const formatNumber = (number) => {
		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(number);
	};


	const setQuantity = (i, n) => {
		setQuantitys((prev) => ({
			...prev,
			[i]: n,
		}));
	};

	const selectProducts = (i) => {
		setSelectedProducts((prev) => ({
			...prev,
			[i]: !prev[i],
		}));

		const parentElement = document.getElementsByClassName('basket-product')[i];
		const childElement = parentElement.querySelectorAll('.Line');
		const childElement1 = childElement[0];
		const childElement2 = childElement[1];

		if (selectedProducts[i] != true) {
			animateLine(0, childElement1, 5.67, 12.67, 50);
			animateLine(1, childElement2, 15, 3.33, 50);
		} else {
			animateLine(0, childElement1, 1, 8, 50);
			animateLine(1, childElement2, 5.67, 12.67, 50);
		}
	};

	const resetSelectionOnClose = () => {
		setSelectedProducts((prev) => {
			const resetProducts = Object.keys(prev).reduce((acc, key) => {
				acc[key] = false;
				return acc;
			}, {});
			return resetProducts;
		});
	};

	const activateAllSelections = () => {
		resetSelectionOnClose();
		setSelectedProducts((prev) => {
			const updatedProducts = Object.keys(prev).reduce((acc, key) => {
				acc[key] = prev[key] === false ? true : prev[key];

				if (prev[key] === false) {
					const parentElement = document.getElementsByClassName('basket-product')[key];
					if (parentElement) {
						const childElement = parentElement.querySelectorAll('.Line');
						if (childElement.length >= 2) {
							const childElement1 = childElement[0];
							const childElement2 = childElement[1];

							if (prev[key] !== true) {
								animateLine(0, childElement1, 5.67, 12.67, 50);
								animateLine(1, childElement2, 15, 3.33, 50);
							} else {
								animateLine(0, childElement1, 1, 8, 50);
								animateLine(1, childElement2, 5.67, 12.67, 50);
							}
						}
					}
				}

				return acc;
			}, {});
			return updatedProducts;
		});
	};

	const toggleBasket = () => {
		if (!showBasket) {

			axios.get('http://192.168.1.100:5000/api/response?type=basket.products&client_id=' + getCookie('client_id') + '&at=' + getCookie('at') + '&ky=' + getCookie('ky'))
				.then((response) => {
					if (response.data.message.length !== 0) {

						setSelectedProducts({});
						setSelectedProducts((prev) => {
							const newSelectedProducts = { ...prev };
							const startKey = Object.keys(prev).length;

							for (let i = 0; i < response.data.message.basket.length; i++) {
								const newKey = startKey + i;
								newSelectedProducts[newKey] = false;
							}

							return newSelectedProducts;
						});

						setBasketProducts(response.data.message.product);
						setBasketData(response.data.message.basket);
					}

				})
				.catch((error) => {
					console.error('Error fetching inbox:', error);
				});
			document.body.style.overflow = 'hidden';
		} else {
			resetSelectionOnClose();
			document.body.style.overflow = 'auto';

		}
		setBasket((status) => (status === false ? true : false));
	};

	const closeBasket = () => {
		if (!showBasket) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
			resetSelectionOnClose();

		}
		setBasket(false);
	};

	const toggleMenuAccount = () => {
		if (!showMenuAccount) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
			resetSelectionOnClose();
		}

		axios.get('http://192.168.1.100:5000/api/inbox?client_id=' + getCookie('client_id') + '&at=' + getCookie('at') + '&ky=' + getCookie('ky'))
			.then((response) => {
				setNotification(response.data.message);

				if (Array.isArray(response.data.message) && response.data.message.length !== 0) {
					setFoundNotification(true);
					setTotalInbox(response.data.message.length);
				}

			})
			.catch((error) => {
				console.error('Error fetching inbox:', error);
			});
		setMenuAccount((status) => (status === false ? true : false));
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				setShowNotification((status) => (status === false ? true : false));

				(async () => {
					const showNotification = () => {
						const notification = new Notification('صندوق الوارد', {
							body: 'رسالة جديدة حول "يد التحكم" الذي أبلغتنا عنه',
							icon: '/img/1.jpg'
						});

						setTimeout(() => {
							notification.close();
						}, 10 * 1000);

						notification.addEventListener('click', () => {

							window.open('/', '_blank');
						});
					}

					const showError = () => {
						const error = document.querySelector('.error');
						error.style.display = 'block';
						error.textContent = 'You blocked the notifications';
					}

					let granted = false;

					if (Notification.permission === 'granted') {
						granted = true;
					} else if (Notification.permission !== 'denied') {
						let permission = await Notification.requestPermission();
						granted = permission === 'granted' ? true : false;
					}

					granted ? showNotification() : showError();

				})();
			}
		});
	};

	function deleteCookie(name) {
		document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	}


	const [showAccountLogout, setAccountLogout] = useState(false);

	const [showNotification, setShowNotification] = useState(true);


	const AccountLogout = () => {
		setAccountLogout((status) => (status === false ? true : false));
	};



	const LogOut = () => {
		deleteCookie('client_id');
		deleteCookie('at');
		deleteCookie('user');
		deleteCookie('ky');
		window.location.href = '/login';
	};

	function requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				console.log("تم منح الإذن للإشعارات.");
			} else if (permission === "denied") {
				console.log("تم رفض الإذن للإشعارات.");
			} else {
				console.log("الإذن معلق.");
			}
		});
	}

	const getCookie = (name) => {
		const cookies = document.cookie.split('; ');
		for (let i = 0; i < cookies.length; i++) {
			const [key, value] = cookies[i].split('=');
			if (key === name) return decodeURIComponent(value);
		}
		return null;
	};

	const user = JSON.parse(getCookie('user'));
	const data = user != undefined ? user.name : '';

	const handleKeyDown = (event) => {
		if (event.key == 'Escape') {
			if (showMenuAccount == false) {
				// toggleMenuAccount();
			}
		}
	};

	const [getNotification, setNotification] = useState([]);
	const [totalInbox, setTotalInbox] = useState(0);

	const [FoundNotification, setFoundNotification] = useState(false);

	useEffect(() => {

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	if (!getCookie('at')) {
		return (
			<div>
				<a href='/login' className='icon cans-head'>
					<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20">
						<path className="icon-head" d="M19,10c0,1.64-0.44,3.18-1.2,4.5c-0.59,1.02-1.37,1.91-2.3,2.63c-0.33,0.25-0.68,0.48-1.04,0.69
	C13.14,18.57,11.62,19,10,19c-0.2,0-0.4-0.01-0.6-0.02c-1.39-0.09-2.71-0.5-3.85-1.16c-0.36-0.21-0.71-0.44-1.04-0.69
	c-0.93-0.71-1.71-1.6-2.3-2.62C1.44,13.18,1,11.64,1,10c0-4.97,4.03-9,9-9C14.97,1,19,5.03,19,10z M10,5.07
	c-1.63,0-2.96,1.32-2.96,2.96s1.32,2.96,2.96,2.96s2.96-1.32,2.96-2.96S11.63,5.07,10,5.07z M10,14.26c-2.08,0-3.86,1.34-4.48,3.21
	c0.27,0.21,0.55,0.39,0.84,0.56c0.94,0.54,2.01,0.88,3.14,0.95C9.67,19,9.84,19,10,19c1.32,0,2.57-0.35,3.64-0.96
	c0.29-0.17,0.58-0.36,0.84-0.56C13.85,15.6,12.08,14.26,10,14.26z"/>
					</svg>
				</a>
			</div>
		);
	} else {
		return (
			<div className='flex'>
				<button onClick={toggleBasket} className='icon cans-head'>
					{/* <div className='basket-quantity'>
						<div className='basket-number'>
							0
						</div>
					</div> */}
					<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className="icon">
						<rect class="transparent" width="20" height="20" />
						<g>
							<path d="M18.95,3.22c-0.71-0.16-1.42,0.29-1.58,1l-1.4,6.21H4.01l-1.4-6.21c-0.17-0.71-0.88-1.17-1.58-1
		c-0.71,0.16-1.17,0.87-1,1.58l1.64,7.25c0.14,0.6,0.67,1.03,1.29,1.03h14.07c0.62,0,1.16-0.43,1.29-1.03l1.64-7.25
		C20.12,4.09,19.66,3.38,18.95,3.22z"/>
							<circle cx="4.82" cy="17" r="1.73" />
							<path d="M15.15,15.27c-0.96,0-1.73,0.78-1.73,1.73c0,0.96,0.78,1.73,1.73,1.73s1.73-0.77,1.73-1.73S16.12,15.27,15.15,15.27z" />
							{/* <polygon points="9.13,3.61 5.32,3.61 6.54,8.61 9.13,8.61 	" />
							<polygon points="14.65,1.27 10.84,1.27 10.84,8.61 13.59,8.61 	" /> */}
						</g>
					</svg>
					<div className='tooltip'>
						السلة
					</div>
				</button>

				{showBasket && (
					<div className={`popupLayout`}>
						<button className='popupLayout-btnClose' onClick={closeBasket}></button>
						<div className='popupLayout-bgd'>
							<div className='Layoutlayers-header'>
								<div className='space-10'></div>
								<div className='icon-h-pin-20'>
									<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className='icon'>
										<rect class="transparent" width="20" height="20" />
										<g>
											<path d="M18.97,3.22c-0.71-0.16-1.42,0.29-1.58,1l-1.4,6.21H4.02l-1.4-6.21c-0.16-0.71-0.87-1.16-1.58-1
c-0.71,0.16-1.16,0.87-1,1.58l1.64,7.25c0.14,0.6,0.67,1.03,1.29,1.03h14.08c0.62,0,1.16-0.43,1.29-1.03l1.64-7.25
C20.13,4.09,19.68,3.38,18.97,3.22z"/>
											<circle cx="4.83" cy="17" r="1.73" />
											<path d="M15.17,15.27c-0.96,0-1.73,0.78-1.73,1.73c0,0.96,0.78,1.73,1.73,1.73S16.9,17.96,16.9,17
C16.9,16.04,16.13,15.27,15.17,15.27z"/>
											{/* <polygon points="9.15,3.61 5.33,3.61 6.56,8.61 9.15,8.61" />
										<polygon points="14.67,1.27 10.85,1.27 10.85,8.61 13.6,8.61" /> */}
										</g>
									</svg>
								</div>
								<div className='space-10'></div>
								<div className='Layoutlayers-text'>السلة</div>
								<div className='space-10'></div>
								{baskets.length !== 0 &&
									(
										<div className='Layoutlayers-counter'>{baskets.length}</div>
									)
								}
								<div className='uspace-10'></div>
								<button onClick={closeBasket} className='icon cans-head'>
									<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
										<rect className='transparent' width="16" height="16" />
										<path d="M12.95,14.36L8,9.41l-4.95,4.95l-1.41-1.41L6.59,8L1.64,3.05l1.41-1.41L8,6.59l4.95-4.95l1.41,1.41L9.41,8
	l4.95,4.95L12.95,14.36z"/>
									</svg>
									<div className='tooltip'>
										إغلاق
									</div>
								</button>
							</div>
							{Object.values(selectedProducts).some(value => value === true) ?
								(
									<div className={`popupLayout-tools ${baskets.length !== 0 && 'active'}`}>
										<div className='popupLayout-toolsCounter'>{Object.values(selectedProducts).filter(value => value === true).length} / {baskets.length}</div>
										<div className='space-10'></div>
										<button className='popupLayout-btnTool' onClick={resetSelectionOnClose}>
											<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
												<rect className='transparent' width="16" height="16" />
												<path d="M12.95,14.36L8,9.41l-4.95,4.95l-1.41-1.41L6.59,8L1.64,3.05l1.41-1.41L8,6.59l4.95-4.95l1.41,1.41L9.41,8
	l4.95,4.95L12.95,14.36z"/>
											</svg>
											<div className='tooltip'>
												إلغاء تحديد الكل
											</div>
										</button>
										<div className='space-10'></div>
										<button className='popupLayout-btnSelectAll' onClick={activateAllSelections} disabled={Object.values(selectedProducts).every((value) => value === true) ? true : false}>تحديد الكل</button>
										<div className='space-10'></div>
										<div className='solid-v-2'></div>
										<div className='space-10'></div>
										<button className='popupLayout-btnTool' >
											<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
												<rect className='transparent' width="16" height="16" />
												<path d="M12.95,0H2.71C1.21,0,0,1.21,0,2.71v10.58c0,1.06,0.6,2,1.56,2.45c0.96,0.45,2.07,0.31,2.88-0.37l2.94-2.45
	c0.26-0.22,0.64-0.22,0.91,0l2.94,2.45c0.5,0.42,1.11,0.63,1.73,0.63c0.39,0,0.78-0.09,1.15-0.26c0.96-0.45,1.56-1.39,1.56-2.45
	V2.71C15.66,1.21,14.44,0,12.95,0z M13.66,13.29c0,0.41-0.28,0.58-0.41,0.64c-0.12,0.06-0.44,0.16-0.75-0.1l-2.94-2.45
	c-1-0.84-2.46-0.84-3.47,0l-2.94,2.45c-0.31,0.26-0.63,0.16-0.75,0.1S2,13.7,2,13.29V2.71C2,2.32,2.32,2,2.71,2h10.24
	c0.39,0,0.71,0.32,0.71,0.71V13.29z"/>
											</svg>
											<div className='tooltip'>
												حفظ العناصر المحددة
											</div>
										</button>
										<div className='uspace-10'></div>
										<button className='popupLayout-btnTool'>
											<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
												<rect className='transparent' width="16" height="16" />
												<path d="M13,0H3C1.35,0,0,1.35,0,3s1.35,3,3,3v7c0,1.65,1.35,3,3,3h4c1.65,0,3-1.35,3-3V6c1.65,0,3-1.35,3-3
	S14.65,0,13,0z M11,13c0,0.55-0.45,1-1,1H6c-0.55,0-1-0.45-1-1V6h6V13z M13,4h-1H4H3C2.45,4,2,3.55,2,3s0.45-1,1-1h10
	c0.55,0,1,0.45,1,1S13.55,4,13,4z"/>
											</svg>
											<div className='tooltip'>
												حذف العناصر المحددة
											</div>
										</button>
									</div>
								) : (
									<div className='solid-h-1'></div>
								)}

							<div className={`popupLayout-content ${baskets.length !== 0 && 'active'} ${Object.values(selectedProducts).some(value => value === true) && 'selected'}`}>
								{baskets.map((basket, i) => (
									<div>
										<div className={`basket-product ${selectedProducts[i] ? 'select' : ''}`}>
											<div className='fwid'>
												<div className='flex'>
													<Link className='basket-imgLink' to={`/product/${basketsProducts.find((product) => product.id === basket.product_id)?.title}`} onClick={() => {document.body.style.overflow = 'auto'}}>
														<img src={`/img/${basketsProducts.find((product) => product.id === basket.product_id)?.image}.jpg`} className='basket-image' tabindex={-1} />
													</Link>
													<div className='space-20'></div>
													<div className='basket-productTexts'>
														<div className='basket-productText'>{basketsProducts.find((product) => product.id === basket.product_id)?.title}</div>
														<div className='basket-productPrice'>السعر <div className='space-10'></div><div className='basket-Price'>{basketsProducts.find((product) => product.id === basket.product_id)?.price} ج.م</div></div>
													</div>
												</div>
												<div className='dspace-10'></div>
												<div className='flex h-center'>
													<button type='button' className='icon cans-head icon-pin-20' onClick={() => setQuantity(i, (quantitys[i] || 1) - 1)}>
														<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
															<rect className="transparent" width="16" height="16" />
															<g>
																<rect y="7" width="16" height="2" />
															</g>
														</svg>
														<div className='tooltip'>
															إنقاص
														</div>
													</button>
													<div className='space-10'></div>
													<input type="number" className="quantityBask" value={quantitys[i] || 1} min="1" max={basketsProducts.find((product) => product.id === basket.product_id)?.quantity || 1} readOnly tabIndex="-1" />													<div className='space-10'></div>
													<button type='button' className='icon cans-head icon-pin-20' onClick={() => { if (quantitys[i] === basketsProducts.find((product) => product.id === basket.product_id)?.quantity || 1) { setQuantity(i, (quantitys[i] || 1) + 1);  } }}>
														<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
															<rect className="transparent" width="16" height="16" />
															<g>
																<polygon points="16,7 9,7 9,0 7,0 7,7 0,7 0,9 7,9 7,16 9,16 9,9 16,9 " />
															</g>
														</svg>
														<div className='tooltip'>
															إضافة
														</div>
													</button>
												</div>
											</div>
											<div className='checkLayout'>
												<div className='basketInd'>{i + 1}</div>
												<div className='dspace-10'></div>

												<div value={i} className='checkLayout-box' onClick={() => selectProducts(i)}><svg width="16px" height="16px" viewBox="0 0 16 16">
													<rect class="transparent" width="16px" height="16px" />
													<line id="Line1" className='Line' x1="1" y1="8" x2="1" y2="8" />
													<line id="Line2" className='Line' x1="5.67" y1="12.67" x2="5.67" y2="12.67" />

												</svg>
													<div className='tooltip'>
														تحديد
													</div>
												</div>
											</div>
										</div>
										{baskets.length != i + 1 && !selectedProducts[i] ?
											(
												<div className='solid-h-1'></div>
											) : (
												<div className='solid-h-0'></div>
											)}
										{baskets.length != i + 1 &&
											(
												<div className='dspace-5'></div>
											)}
									</div>
								))}
							</div>
							{baskets.length !== 0 && (
								<div className='popupLayout-calc'>
									{Object.values(selectedProducts).some(value => value === true) ? (
										<div className='popupLayout-texts'>
											<div className='popupLayout-text'>
												إجمالي السعر<div className='space-10'></div><div className='priceText'>{Object.values(selectedProducts).some(value => value === true) && formatNumber(Object.keys(selectedProducts) .filter((key) => selectedProducts[key]) .reduce((total, key) => { const productId = baskets[key].product_id; const product = basketsProducts.find((product) => product.id === productId); return total + (product ? product.price : 0); }, 0))} ج.م</div>
											</div>
											<div className='space-10'></div>
											<div className='solid-v-2'></div>
											<div className='space-10'></div>

											<div className='popupLayout-basketQuantity'>عدد الكميات <div className='space-10'></div><div className='quantityText'>{Object.values(selectedProducts).some(value => value === true) && Object.keys(selectedProducts).filter((key) => selectedProducts[key]).reduce((total, key) => { const quantity = quantitys[key] || 1; return total + quantity; }, 0)}</div></div>
										</div>
									) : (
										<div className='popupLayout-note'>حدد عنصر واحد علي الأقل أو<div className='space-10'></div> <button className='popupLayout-btnSelectAll' onClick={activateAllSelections}>تحديد الكل</button></div>
									)}
								</div>
							)}
							<div className='popupLayout-process'>
								<button className='popupLayout-btnProcess' disabled={Object.values(selectedProducts).some(value => value === true) ? false : true}>شراء الآن</button>
							</div>
						</div>
					</div>
				)}


				<div className='space-10'></div>

				<button type='button' onClick={toggleMenuAccount} className='icon cans-head'>
					<div className='picture-letter'>{data[0]}</div>
				</button>
				{showMenuAccount && (
					<div className={`menu-center${showMenuAccount === false ? ' hide' : ' show'}`}>
						{/* <button type='button' onClick={toggleMenuAccount} className='menu-hidebtn'><div className='rotate-text'>.حدد شيئاً</div></button> */}
						<div className={`popup-center ${showAccountLogout === false ? 'hide' : 'show'}`}>
							<div className='popup-layer'>
								<div className='popup-content'>
									<div className='popup-name'>تسجيل الخروج</div>
									<div className='popup-description'>سيتم تسجيل خروجك بشكل نهائي من المتصفح، هل أنت متأكد من المتابعة؟</div>
								</div>
								<div className='solid-h-1'></div>
								<div className='popup-options'><button type='button' onClick={LogOut} className='popupBtn-option-ok'>تسجيل الخروج</button><div className='space-10'></div><div className='solid-v-2'></div> <div className='space-10'></div><button type='button' onClick={AccountLogout} className='popupBtn-option-cancel'>إلغاء</button></div>
							</div>
						</div>
						<div className='flex-p animation'>
							<div className='menu_account'>
								<div className='menu-header'>
									<div className='menu-picture-letter'>{data[0]}</div>
									<div className='space-10'></div>
									<div className='menu-name'>{data}</div><div className='menu-account-level'>مشرف</div><div className='space-10'></div>
									<button onClick={AccountLogout} className='icon cans-head'>
										<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-black'>
											<rect className="transparent" width="16" height="16" />
											<path d="M7.51,16H4.84c-1.72,0-3.11-1.4-3.11-3.11V3.11C1.73,1.4,3.13,0,4.84,0h2.67C8,0,8.4,0.4,8.4,0.89S8,1.78,7.51,1.78H4.84
	c-0.74,0-1.33,0.6-1.33,1.33v9.78c0,0.74,0.6,1.33,1.33,1.33h2.67c0.49,0,0.89,0.4,0.89,0.89C8.4,15.6,8,16,7.51,16z M10.87,11.4
	c-0.23,0-0.45-0.09-0.63-0.26c-0.35-0.35-0.35-0.91,0-1.25l1-1H6.18c-0.49,0-0.89-0.4-0.89-0.89s0.4-0.89,0.89-0.89h5.06l-1-1
	c-0.35-0.35-0.35-0.91,0-1.25c0.35-0.35,0.91-0.35,1.25,0l2.52,2.52c0.09,0.09,0.15,0.19,0.2,0.29c0.04,0.1,0.06,0.2,0.07,0.32l0,0
	c0,0.01,0,0.02,0,0.03l0,0l0,0c0,0.12-0.03,0.22-0.07,0.32l0,0l0,0c-0.04,0.1-0.1,0.2-0.18,0.28l0,0l0,0l0,0l-0.01,0.01l-2.51,2.52
	C11.32,11.32,11.1,11.4,10.87,11.4z"/>
										</svg>
										<div className='tooltip'>
											تسجيل الخروج
										</div>
									</button>
									<div className='space-5'></div>
									<div className='solid-v-2'></div>
									<div className='space-5'></div>
									<button onClick={toggleMenuAccount} className='icon cans-head'>
										<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
											<rect className="transparent" width="16" height="16" />
											{/* <path d="M12.24,14.05c0.45,0.45,0.45,1.17,0,1.62C12.01,15.89,11.72,16,11.43,16c-0.29,0-0.58-0.11-0.81-0.33L3.76,8.81
	c-0.45-0.45-0.45-1.17,0-1.62l6.86-6.86c0.45-0.45,1.17-0.45,1.62,0c0.45,0.45,0.45,1.17,0,1.62L6.19,8L12.24,14.05z"/> */}
											<path d="M12.95,14.36L8,9.41l-4.95,4.95l-1.41-1.41L6.59,8L1.64,3.05l1.41-1.41L8,6.59l4.95-4.95l1.41,1.41L9.41,8
	l4.95,4.95L12.95,14.36z"/>
										</svg>
										<div className='tooltip'>
											إغلاق
										</div>
									</button>
								</div>
								<div className='solid-h-1'></div>
								{/* <div className='header-account'>
                            <div className='menu-picture-letter'>{data[0]}</div>
                            <div className='space-10'></div>
                            <div className='menu-name'>{data}</div>
                        </div> */}
								<div className='btns_menu'>
									<Link to='/orders/' onClick={() => {document.body.style.overflow = 'auto'}} className='btn-menuSection'>
										<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
											<path d="M14,0H4C1.79,0,0,1.79,0,4v10c0,2.21,1.79,4,4,4h10c2.21,0,4-1.79,4-4V4C18,1.79,16.21,0,14,0z M6.19,4.34
	c0-0.55,0.45-1,1-1h3.63c0.55,0,1,0.45,1,1v0.25c0,0.55-0.45,1-1,1H7.19c-0.55,0-1-0.45-1-1V4.34z M11.81,13.66c0,0.55-0.45,1-1,1
	H7.19c-0.55,0-1-0.45-1-1v-0.25c0-0.55,0.45-1,1-1h3.63c0.55,0,1,0.45,1,1V13.66z M14.63,9.13c0,0.55-0.45,1-1,1H4.38
	c-0.55,0-1-0.45-1-1V8.88c0-0.55,0.45-1,1-1h9.25c0.55,0,1,0.45,1,1V9.13z"/>
										</svg>
										<div className='space-10'></div>
										الطلبات</Link>
									<Link to='/' onClick={() => {document.body.style.overflow = 'auto'}} className='btn-menuSection' disabled tabIndex={-1}>
										<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
											<rect className="transparent" width="18" height="18" />
											<path d="M14.31,8.68C16.29,4.72,13.45,0.07,9.05,0C4.54-0.07,1.69,4.88,3.7,8.91l4.23,8.46c0.42,0.84,1.61,0.84,2.03,0
	L14.31,8.68z M9,9.18c-1.81,0-3.27-1.47-3.27-3.27S7.19,2.64,9,2.64s3.27,1.47,3.27,3.27S10.81,9.18,9,9.18z"/>
										</svg>
										<div className='space-10'></div>
										تتبع الطرد</Link>
									<Link to='/saves/' onClick={() => {document.body.style.overflow = 'auto'}} className='btn-menuSection'>
										<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
											<rect className='transparent' width="18" height="18" />
											<path d="M15.44,0H2.56C1.84,0,1.27,0.58,1.27,1.29v15.42c0,1.07,1.23,1.67,2.08,1.02l4.87-3.76c0.46-0.36,1.11-0.36,1.58,0
	l4.87,3.76c0.85,0.66,2.08,0.05,2.08-1.02V1.29C16.73,0.58,16.16,0,15.44,0z M14.74,3.67c0,0.6-0.49,1.09-1.09,1.09H4.36
	c-0.6,0-1.09-0.49-1.09-1.09V3.35c0-0.6,0.49-1.09,1.09-1.09h9.28c0.6,0,1.09,0.49,1.09,1.09V3.67z"/>

										</svg>
										<div className='space-10'></div>
										المحفوظات</Link>
									<div className='dspace-5'></div>
									<div className='solid-h-1'></div>
									<div className='dspace-5'></div>
									<Link to='/settings/' onClick={() => {document.body.style.overflow = 'auto'}} className='btn-menuSection'>
										<div className='icon-pin'>
											<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
												<rect className='transparent' width="18" height="18" />
												<path d="M17.1,6.82l-0.83-0.83V4.81c0-1.7-1.38-3.08-3.08-3.08h-1.18L11.17,0.9c-1.2-1.2-3.15-1.2-4.35,0L5.99,1.73H4.81
	c-1.7,0-3.08,1.38-3.08,3.08v1.18L0.9,6.82c-1.2,1.2-1.2,3.15,0,4.35l0.83,0.83v1.18c0,1.7,1.38,3.08,3.08,3.08h1.18l0.83,0.83
	C7.4,17.68,8.18,18,9,18s1.59-0.32,2.18-0.9l0.83-0.83h1.18c1.7,0,3.08-1.38,3.08-3.08v-1.18l0.83-0.83
	C18.3,9.98,18.3,8.02,17.1,6.82z M13.95,9c0,2.73-2.22,4.95-4.95,4.95S4.05,11.73,4.05,9S6.27,4.05,9,4.05S13.95,6.27,13.95,9z"/>

											</svg>
										</div>
										<div className='space-10'></div>
										<div className='swidth-1'>الإعدادات</div>
									</Link>
									<div className='dspace-5'></div>
									<div className='solid-h-1'></div>
									<div className='dspace-5'></div>
									<Link to='/control/' onClick={() => {document.body.style.overflow = 'auto'}} className='btn-menuSection'>
										<div className='icon-pin'>
											<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
												<rect className='transparent' width="18" height="18" />
												<path d="M17.1,6.82l-0.83-0.83V4.81c0-1.7-1.38-3.08-3.08-3.08h-1.18L11.17,0.9c-1.2-1.2-3.15-1.2-4.35,0L5.99,1.73H4.81
	c-1.7,0-3.08,1.38-3.08,3.08v1.18L0.9,6.82c-1.2,1.2-1.2,3.15,0,4.35l0.83,0.83v1.18c0,1.7,1.38,3.08,3.08,3.08h1.18l0.83,0.83
	C7.4,17.68,8.18,18,9,18s1.59-0.32,2.18-0.9l0.83-0.83h1.18c1.7,0,3.08-1.38,3.08-3.08v-1.18l0.83-0.83
	C18.3,9.98,18.3,8.02,17.1,6.82z M13.95,9c0,2.73-2.22,4.95-4.95,4.95S4.05,11.73,4.05,9S6.27,4.05,9,4.05S13.95,6.27,13.95,9z"/>
												<circle cx="9" cy="9" r="2" />

											</svg>
										</div>
										<div className='space-10'></div>
										<div className='swidth-1'>التحكم</div>
									</Link>
								</div>
							</div>

							<div className='menu-inboxContent'>
								<div className='inboxContent-header'>
									<div className='icon-pin-20'>
										<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20">
											<rect className='transparent' width="20" height="20" />
											<path className='icon-head-fill' d="M19.97,7.72c0-0.13-0.03-0.26-0.08-0.38c-0.05-0.12-0.12-0.23-0.22-0.32l-4.51-4.48c-0.19-0.19-0.44-0.29-0.71-0.29
	L5.48,2.27c-0.26,0-0.52,0.11-0.71,0.29L0.29,7.07C0.2,7.16,0.13,7.27,0.08,7.39C0.03,7.52,0,7.65,0,7.78l0.03,8.99
	c0,0.55,0.45,1,1,1L19,17.71c0.55,0,1-0.45,1-1L19.97,7.72z M5.9,4.26l8.16-0.02l2.5,2.49L3.41,6.77L5.9,4.26z M2.02,15.76L2,8.77
	l15.98-0.05L18,15.71L2.02,15.76z"/>
										</svg>
									</div>
									<div className='space-10'></div>
									<div className='inbox-text'>صندوق الوارد</div></div>
								<div className='solid-h-1'></div>
								<div className='inboxContents'>
									<div className={`no_inbox${FoundNotification === true ? ' hide' : ' show'}`}>
										<div className='illustrative-state'>
											<svg xmlns="http://www.w3.org/2000/svg" width="88.47px" height="128px" viewBox="0 0 88.47 128">
												<g>
													<path class="illust-col0" d="M88.47,44.23c0,0.84-0.03,1.67-0.07,2.49c-0.11,1.93-0.33,3.84-0.68,5.7c-3.84,20.52-21.84,36.05-43.48,36.05
		S4.6,72.94,0.76,52.42c-0.35-1.86-0.58-3.76-0.68-5.7C0.03,45.9,0,45.07,0,44.23c0-0.72,0.02-1.44,0.05-2.15
		C1.18,18.65,20.53,0,44.23,0s43.06,18.65,44.18,42.07C88.45,42.79,88.47,43.5,88.47,44.23z"/>
													<path class="illust-col1" d="M88.37,47.14c0.06-0.96,0.09-1.93,0.09-2.92c0-0.72-0.02-1.44-0.05-2.15H0.05C0.02,42.79,0,43.5,0,44.23
		c0,2.8,0.26,5.53,0.76,8.19h1.93l28.46,54.41l1.84-0.96L5.02,52.41h22.74l5.97,54.05l2.06-0.23l-5.95-53.82h28.78l-6.13,55.42
		l2.06,0.23l6.15-55.65h22.76l-27.3,53.46l1.85,0.94l27.78-54.41h1.91c0.31-1.64,0.52-3.31,0.64-5l0.11-0.21L88.37,47.14z"/>
													<path class="illust-col2" d="M57.83,103.7H30.64c-1.46,0-2.65,1.18-2.65,2.65c0,1.46,1.18,2.65,2.65,2.65h1.42c0,0.02-0.01,0.04-0.01,0.06
		h24.35c0-0.02-0.01-0.04-0.01-0.06h1.42c1.46,0,2.65-1.18,2.65-2.65C60.48,104.89,59.29,103.7,57.83,103.7z M32.06,111.09v14.15
		c0,1.52,1.24,2.76,2.76,2.76h18.83c1.52,0,2.76-1.24,2.76-2.76v-16.12c0-0.02,0-0.04,0-0.06L32.06,111.09z"/>
													<path class="illust-col1" d="M28.85,19.26c-0.53,0.13-1.05,0.3-1.55,0.49c-0.24-0.34-0.5-0.66-0.79-0.97c-0.61-0.64-1.29-1.25-2.23-1.71
		c-0.12,1.04,0.01,1.94,0.22,2.8c0.1,0.38,0.22,0.74,0.35,1.09c-0.43,0.27-0.84,0.56-1.25,0.88c-0.77,0.63-1.51,1.34-2.11,2.31
		c1.14,0.11,2.15-0.04,3.12-0.27c0.53-0.13,1.04-0.29,1.55-0.48c0.24,0.34,0.5,0.66,0.79,0.97c0.6,0.64,1.29,1.25,2.23,1.71
		c0.12-1.04-0.01-1.94-0.22-2.8c-0.1-0.37-0.22-0.74-0.35-1.09c0.43-0.27,0.84-0.56,1.24-0.88c0.77-0.63,1.51-1.34,2.11-2.31
		C30.83,18.88,29.82,19.03,28.85,19.26z"/>
												</g>
											</svg>
										</div>
										<div className='inboxIllus-text'>صندوق الوارد فارغ</div>
										<div className='inboxIllus-description'>جميع الرسائل المتلقاة تجدها هنا</div>
										<div className={`${showNotification === false ? 'btn-hide' : 'btn-show'}`}>
											<div className='dspace-20'></div>
											<div className='btn-center'>
												<button type='button' onClick={requestNotificationPermission} className='btn-AllowNotif'>تفعيل الإشعارات</button>
											</div>
										</div>
									</div>

									<div className={`content_inbox${FoundNotification === true ? ' show' : ' hide'}`}>
										{getNotification.map((inbox, index) => (
											<div>
												{index === 0 && (
													// <div className='inbox-warning'>
													// 	<div className='inboxWarning-text'>الرسائل تُحذف تلقائيًا بعد مرور 30 يومًا من تلقيها.</div>
													// </div>
													<div className='dspace-20'></div>
												)}
												<div className='inbox_content'>
													<div className='flex'>
														<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" className='icon-grey'>
															<rect className='transparent' width="32" height="32" />
															<g>
																<path d="M14.2,15.4c1.06,0.79,2.54,0.79,3.6,0l11.96-8.97C29.23,6.16,28.64,6,28,6H4C3.36,6,2.77,6.16,2.24,6.43L14.2,15.4z" />
																<path d="M19,17c-0.88,0.66-1.94,0.99-3,0.99c-1.06,0-2.12-0.33-3-0.99L0.68,7.76C0.25,8.4,0,9.17,0,10v12c0,2.21,1.79,4,4,4h24
		c2.21,0,4-1.79,4-4V10c0-0.83-0.25-1.6-0.68-2.24L19,17z"/>
															</g>
														</svg>
													</div>
													<div className='space-20'></div>
													<div>
														<div className='inboxContent-text'>
															{inbox.inbox}
														</div>
														<div className='inboxContent-content'>
															{inbox.content}
														</div>
														<div className='inboxContent-options'>

														</div>
														<div className='inboxContent-date'>{formatDate(inbox.date)}</div>
													</div>
												</div>
												{totalInbox !== index + 1 && (
													<div className='dspace-20'></div>
												)}
												{totalInbox !== index + 1 && (
													<div className='solid-h-1'></div>
												)}
												{totalInbox !== index + 1 && (
													<div className='inCont-line'>
														<div className='ic-corner-bg'></div>
													</div>
												)}
												{totalInbox !== index + 1 && (
													<div className='solid-h-1'></div>
												)}
												{totalInbox !== index + 1 && (
													<div className='dspace-20'></div>
												)}
											</div>
										))}
										<div className='dspace-20'></div>
									</div>

								</div>
							</div>
							<div className='dspace-20'></div>
						</div>
					</div>
				)}
			</div>
		)
	}
}
