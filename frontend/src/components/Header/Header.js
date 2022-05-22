import React from 'react'; 
import { Route, Link } from 'react-router-dom';
import headerLogo from '../../images/header__logo.svg'; 

function Header(props) { 
  const [displayHeaderTop, setDisplayHeaderTop] = React.useState(false) 

  function handleClickMenuHeaderTop() { 
    setDisplayHeaderTop(!displayHeaderTop) 
  } 

  function handleClickSignOut() { 
    localStorage.removeItem('token'); 
  } 

  return ( 
    <header className="header"> 
      <Route exact path='/'>  
        <div className={displayHeaderTop ? 'header__top' : 'header__top_hidden'}> 
          <p className="header__top-email">{props.email}</p> 
          <Link className="header__top-button" to='/signin' onClick={handleClickSignOut}>Выйти</Link> 
        </div> 
      </Route> 
      <div className="header__main"> 
      <img className="header__logo" src={headerLogo} alt="Логотип проекта Место"/> 
      <Route exact path='/'> 
        <div className='header__signout'> 
          <p className="header__email">{props.email}</p> 
          <Link className="header__button" to='/signin' onClick={handleClickSignOut}>Выйти</Link> 
          <button className="header__menu" onClick={handleClickMenuHeaderTop}/> 
        </div> 
      </Route> 
      <Route path='/signup'><Link className="header__enter" to="/signin">Войти</Link></Route> 
      <Route path='/signin'><Link className="header__registration" to='/signup'>Зарегистрироваться</Link></Route> 
      </div> 
    </header> 
  ); 
}; 

export default Header; 
