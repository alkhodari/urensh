import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';
import userState from '../../response/res-auth';



export default function headerApp() {


    return (
        <div>
            <footer>
                <div className='footer_section'>
                    <div className='logo-footer'>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 48 47.6">
                            <path class="icon-color" d="M48,24c0,11.76-8.46,21.54-19.62,23.6C26.95,47.86,25.5,48,24,48s-2.95-0.14-4.38-0.4C8.46,45.54,0,35.76,0,24
	C0,10.74,10.74,0,24,0S48,10.74,48,24z"/>
                            <polygon class="icon-white" points="35.86,14.72 28.57,10.5 27.49,11.12 27.49,22.49 24,24.51 20.51,22.49 20.51,11.12 19.43,10.5 
	12.14,14.72 11.78,15.34 11.78,27.14 12.14,27.76 19.07,31.76 19.07,37.44 19.43,38.08 23.64,40.5 24.36,40.5 28.57,38.08 
	28.93,37.44 28.93,31.76 35.86,27.76 36.22,27.14 36.22,15.34 "/>
                        </svg> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="70px"
                            height="16px" viewBox="0 0 81.41 16" className='icon-black'>
                            <g>
                                <path d="M8.79,10.83c0,0.89-0.24,1.53-0.72,1.93c-0.48,0.39-1.2,0.59-2.15,0.59c-0.91,0-1.6-0.2-2.07-0.59
		c-0.48-0.39-0.71-1.03-0.71-1.93V0.27H0v10.45c0,1.3,0.23,2.34,0.68,3.12c0.45,0.78,1.12,1.33,2.01,1.67
		C3.57,15.83,4.65,16,5.91,16c1.32,0,2.41-0.17,3.3-0.51c0.88-0.34,1.56-0.9,2.02-1.69c0.46-0.78,0.69-1.83,0.69-3.13V0.27H8.79
		V10.83z"/>
                                <path d="M25.73,8.17c0.4-0.76,0.6-1.7,0.6-2.82c0-1.27-0.21-2.27-0.62-3.01c-0.42-0.74-1.04-1.27-1.88-1.59
		c-0.84-0.32-1.88-0.48-3.12-0.48h-6.05v15.48h3.13v-5.19h3.22l2.04,5.19h3.29l-2.43-5.89C24.73,9.5,25.33,8.93,25.73,8.17z
		 M22.91,6.74c-0.15,0.4-0.4,0.71-0.75,0.93C21.82,7.89,21.36,8,20.78,8h-2.99V2.83h2.92c0.83,0,1.44,0.21,1.84,0.63
		c0.39,0.42,0.59,1.06,0.59,1.9C23.14,5.88,23.06,6.34,22.91,6.74z"/>
                                <polygon points="28.62,15.75 38.91,15.75 38.91,13.14 31.75,13.14 31.75,9.2 37.55,9.2 37.55,6.64 31.75,6.64 31.75,2.88 
		38.91,2.88 38.91,0.27 28.62,0.27 	"/>
                                <polygon points="50.56,11.15 50.15,11.15 45.19,0.27 41.11,0.27 41.11,15.75 44.24,15.75 44.24,4.69 44.65,4.69 49.66,15.75 
		53.69,15.75 53.69,0.27 50.56,0.27 	"/>
                                <path d="M65.85,7.91c-0.39-0.32-0.89-0.59-1.52-0.82c-0.63-0.23-1.39-0.44-2.28-0.63c-0.76-0.17-1.35-0.32-1.78-0.48
		s-0.74-0.35-0.92-0.59c-0.18-0.24-0.27-0.59-0.27-1.04c0-0.39,0.09-0.72,0.27-0.97c0.18-0.26,0.46-0.45,0.84-0.57
		c0.38-0.12,0.85-0.18,1.41-0.18c0.41,0,0.9,0.02,1.48,0.07c0.58,0.05,1.17,0.09,1.77,0.15c0.6,0.05,1.12,0.11,1.58,0.17l0.14-2.49
		c-0.44-0.09-0.97-0.17-1.6-0.25c-0.63-0.08-1.26-0.14-1.9-0.19C62.42,0.03,61.85,0,61.35,0c-1.1,0-2.06,0.14-2.88,0.43
		c-0.82,0.29-1.44,0.77-1.88,1.44c-0.44,0.67-0.66,1.6-0.66,2.78c0,0.76,0.09,1.4,0.28,1.93c0.19,0.53,0.49,0.96,0.9,1.3
		c0.41,0.34,0.93,0.62,1.58,0.85c0.64,0.23,1.42,0.42,2.32,0.59c0.72,0.14,1.29,0.28,1.7,0.42c0.41,0.14,0.69,0.33,0.85,0.57
		c0.16,0.24,0.24,0.55,0.24,0.94c0,0.48-0.09,0.88-0.26,1.19c-0.17,0.31-0.44,0.54-0.8,0.69c-0.36,0.15-0.83,0.23-1.41,0.23
		c-0.45,0-0.99-0.02-1.6-0.07c-0.61-0.05-1.23-0.1-1.85-0.17s-1.16-0.13-1.63-0.19l-0.2,2.47c0.45,0.08,1,0.16,1.64,0.26
		c0.64,0.1,1.3,0.18,1.98,0.25c0.68,0.07,1.31,0.1,1.88,0.1c1.13,0,2.1-0.16,2.91-0.49c0.81-0.32,1.43-0.85,1.86-1.59
		c0.43-0.73,0.65-1.7,0.65-2.91c0-0.76-0.09-1.38-0.27-1.88C66.52,8.63,66.23,8.23,65.85,7.91z"/>
                                <polygon points="78.28,0.27 78.28,6.73 72.27,6.73 72.27,0.27 69.15,0.27 69.15,15.75 72.27,15.75 72.27,9.36 78.28,9.36 
		78.28,15.75 81.41,15.75 81.41,0.27 	"/>
                            </g>
                        </svg>
                        <div className='space-10'></div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32">
                            <path class="icon-color" d="M32,16c0,7.84-5.64,14.36-13.08,15.73C17.97,31.91,17,32,16,32s-1.97-0.09-2.92-0.27C5.64,30.36,0,23.84,0,16
	C0,7.16,7.16,0,16,0S32,7.16,32,16z"/>
                            <polygon class="icon-white" points="23.91,9.82 19.05,7 18.33,7.41 18.33,15 16,16.34 13.67,15 13.67,7.41 12.95,7 8.09,9.82 7.85,10.23 
	7.85,18.09 8.09,18.5 12.71,21.18 12.71,24.96 12.95,25.39 15.76,27 16.24,27 19.05,25.39 19.29,24.96 19.29,21.18 23.91,18.5 
	24.15,18.09 24.15,10.23 "/>
                        </svg>
                    </div>
                    <div className='dspace-20'></div>
                    <div className='fc_text'>
                        العلامة التجارية لقطع غيار السيارات
                    </div>
                    <div className='dspace-00'></div>
                    <div className='fc_descritpion'>
                        جميع الحقوق محفوظة لدي © Urensh LLC {new Date().getFullYear()}
                    </div>
                    <div className='dspace-10'></div>
                    <div className='fc_txsocial'>تابعنا علي</div>
                    <div className='dspace-10'></div>
                    <div className='fc_social'>
                        <a href='https://www.facebook.com/' target="_blank" className='icon btn-social' title='facebook'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-social'>
                                <path d="M16,8c0-4.42-3.58-8-8-8S0,3.58,0,8c0,3.99,2.93,7.3,6.75,7.9v-5.59H4.72V8h2.03V6.24
		c0-2.01,1.19-3.11,3.02-3.11c0.88,0,1.79,0.16,1.79,0.16v1.97h-1.01c-0.99,0-1.3,0.62-1.3,1.25V8h2.22l-0.35,2.31H9.25v5.59
		C13.07,15.3,16,11.99,16,8z"/>
                                <path className='icon-white' d="M11.11,10.31L11.47,8H9.25V6.5c0-0.63,0.31-1.25,1.3-1.25h1.01V3.28c0,0-0.92-0.16-1.79-0.16
		c-1.83,0-3.02,1.11-3.02,3.11V8H4.72v2.31h2.03v5.59C7.16,15.97,7.57,16,8,16s0.84-0.03,1.25-0.1v-5.59H11.11z"/>
                            </svg>
                        </a>
                        <div className='uspace-10'></div>

                        <a href='https://www.instagram.com/' target="_blank" className='icon btn-social' title='Instagram'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-social'>
                                <path d="M8,0C5.83,0,5.55,0.01,4.7,0.05C3.85,0.09,3.27,0.22,2.76,0.42C2.23,0.62,1.79,0.9,1.34,1.34S0.62,2.23,0.42,2.76
	C0.22,3.27,0.09,3.85,0.05,4.7C0.01,5.55,0,5.83,0,8c0,2.17,0.01,2.45,0.05,3.3c0.04,0.85,0.17,1.43,0.37,1.94
	c0.2,0.53,0.48,0.97,0.92,1.42c0.44,0.44,0.89,0.72,1.42,0.92c0.51,0.2,1.09,0.33,1.94,0.37C5.55,15.99,5.83,16,8,16
	c2.17,0,2.45-0.01,3.3-0.05c0.85-0.04,1.43-0.17,1.94-0.37c0.53-0.2,0.97-0.48,1.42-0.92c0.44-0.44,0.72-0.89,0.92-1.42
	c0.2-0.51,0.33-1.09,0.37-1.94C15.99,10.45,16,10.17,16,8c0-2.17-0.01-2.45-0.05-3.3c-0.04-0.85-0.17-1.43-0.37-1.94
	c-0.2-0.53-0.48-0.97-0.92-1.42c-0.44-0.44-0.89-0.72-1.42-0.92c-0.51-0.2-1.09-0.33-1.94-0.37C10.45,0.01,10.17,0,8,0z M8,1.44
	c2.14,0,2.39,0.01,3.23,0.05c0.78,0.04,1.2,0.17,1.49,0.28c0.37,0.15,0.64,0.32,0.92,0.6c0.28,0.28,0.45,0.55,0.6,0.92
	c0.11,0.28,0.24,0.71,0.28,1.49c0.04,0.84,0.05,1.1,0.05,3.23c0,2.14-0.01,2.39-0.05,3.23c-0.04,0.78-0.17,1.2-0.28,1.49
	c-0.15,0.37-0.32,0.64-0.6,0.92c-0.28,0.28-0.55,0.45-0.92,0.6c-0.28,0.11-0.71,0.24-1.49,0.28c-0.84,0.04-1.1,0.05-3.23,0.05
	c-2.14,0-2.39-0.01-3.23-0.05c-0.78-0.04-1.2-0.17-1.49-0.28c-0.37-0.15-0.64-0.32-0.92-0.6c-0.28-0.28-0.45-0.55-0.6-0.92
	c-0.11-0.28-0.24-0.71-0.28-1.49C1.45,10.39,1.44,10.14,1.44,8c0-2.14,0.01-2.39,0.05-3.23c0.04-0.78,0.17-1.2,0.28-1.49
	c0.15-0.37,0.32-0.64,0.6-0.92c0.28-0.28,0.55-0.45,0.92-0.6c0.28-0.11,0.71-0.24,1.49-0.28C5.61,1.45,5.86,1.44,8,1.44z"/>
                                <path d="M8,10.67c-1.47,0-2.67-1.19-2.67-2.67c0-1.47,1.19-2.67,2.67-2.67c1.47,0,2.67,1.19,2.67,2.67
	C10.67,9.47,9.47,10.67,8,10.67z M8,3.89C5.73,3.89,3.89,5.73,3.89,8c0,2.27,1.84,4.11,4.11,4.11c2.27,0,4.11-1.84,4.11-4.11
	C12.11,5.73,10.27,3.89,8,3.89z"/>
                                <path d="M13.23,3.73c0,0.53-0.43,0.96-0.96,0.96c-0.53,0-0.96-0.43-0.96-0.96s0.43-0.96,0.96-0.96C12.8,2.77,13.23,3.2,13.23,3.73z"
                                />
                            </svg>
                        </a>

                        <div className='uspace-10'></div>
                        <a href='https://www.youtube.com/' target="_blank" className='icon btn-social' title='youtube'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="11.2px" viewBox="0 0 16 11.2" className='icon-social'>
                                <path d="M15.67,1.75c-0.18-0.69-0.73-1.23-1.41-1.41C13,0,8,0,8,0S3,0,1.75,0.33C1.06,0.52,0.52,1.06,0.33,1.75C0,3,0,5.6,0,5.6
		s0,2.6,0.33,3.85c0.18,0.69,0.73,1.23,1.41,1.41C3,11.2,8,11.2,8,11.2s5,0,6.25-0.33c0.69-0.18,1.23-0.73,1.41-1.41
		C16,8.2,16,5.6,16,5.6S16,3,15.67,1.75L15.67,1.75z"/>
                                <path className="icon-white" d="M6.4,8l4.16-2.4L6.4,3.2L6.4,8L6.4,8z" />
                            </svg>
                        </a>

                        <div className='uspace-10'></div>
                        <a href='https://www.linkedin.com/' target="_blank" className='icon btn-social' title='linkedin'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-social'>
                                <path d="M14.82,0C15.47,0,16,0.52,16,1.15v13.69c0,0.64-0.53,1.15-1.18,1.15H1.18C0.53,16,0,15.48,0,14.85V1.15
	C0,0.52,0.53,0,1.18,0C1.18,0,14.82,0,14.82,0z M13.63,13.63V9.45c0-2.06-0.44-3.64-2.85-3.64c-1.15,0-1.93,0.63-2.25,1.23H8.51V6
	H6.23v7.64h2.37V9.86c0-1,0.19-1.96,1.42-1.96c1.22,0,1.23,1.14,1.23,2.02v3.71H13.63L13.63,13.63z M4.75,6H2.37v7.64h2.38V6z
	 M3.56,2.2c-0.76,0-1.38,0.62-1.38,1.38c0,0.76,0.61,1.38,1.38,1.38c0.76,0,1.38-0.62,1.38-1.38C4.93,2.82,4.32,2.2,3.56,2.2
	L3.56,2.2z"/>
                            </svg>
                        </a>

                        <div className='uspace-10'></div>
                        <a href='https://www.x.com/' target="_blank" className='icon btn-social' title='X (Twitter)'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15.65px" height="15.99px" viewBox="0 0 15.65 15.99" className='icon-social'>
                                <path d="M9.31,6.77L15.14,0h-1.38L8.7,5.88L4.66,0H0l6.11,8.89L0,15.99h1.38l5.34-6.21l4.27,6.21h4.66L9.31,6.77L9.31,6.77z
		 M7.42,8.97L6.8,8.08L1.88,1.04H4l3.97,5.69l0.62,0.89L13.76,15h-2.12L7.42,8.97L7.42,8.97z"/>
                            </svg>
                        </a>
                    </div>

                    <div className='dspace-20'></div>

                </div>

                <div className='footer_expl'>
                    <div className='uspace-10'></div>

                    <div className='footer_column'>
                        <div className='footer_type'>عنا</div>

                        <a href='#' className='fc_section'>عن Urensh
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>
                        <div className='dspace-10'></div>
                        <a href='#' className='fc_section'>Urensh للأعمال
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>
                        {/* <div className='dspace-10'></div>
                        <a href='#' className='fc_section'>وظائف
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a> */}
                        {/* <div className='dspace-10'></div>
                        <a href='#' className='fc_section'>المطورين
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a> */}
                        <div className='dspace-10'></div>
                        <a href='#' className='fc_section'>التواصل معنا
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className='uspace-10'></div>

                    <div className='footer_column'>
                        <div className='footer_type'>قانوني</div>
                        <a href='/terms' className='fc_section'>شروط الإستخدام
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>
                        <div className='dspace-10'></div>
                        <a href='#' className='fc_section'>سياسة الخصوصية
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>
                        <div className='dspace-10'></div>
                        <a href='#' className='fc_section'>حماية المستهلك
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className='uspace-10'></div>

                    <div className='footer_column'>
                        <div className='footer_type'>مساعدة
                        </div>

                        <a href='#' className='fc_section'>الدليل السريع
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>

                        <div className='dspace-10'></div>
                        <a href='#' className='fc_section'>مركز المساعدة
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10.33px"
                                        height="10.33px" viewBox="0 0 10.33 10.33" className='icon-solid'>
                                        <polyline points="10.33,1 1,1 1,10.33 " />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

            </footer>
        </div>
    );
}