import React from 'react';
import './App.css';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { api } from '../../utils/Api/Api';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup';
import ImagePopup from '../ImagePopup/ImagePopup';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUserData, setСurrentUserData] = React.useState({ name: '', about: '', avatar: '', email: '', _id: '', password: '' });
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [values, setValues] = React.useState({email: '', password: ''});
  const [isOpenTooltip, setIsOpenTooltip] = React.useState(false);
  const [tooltipName, setTooltipName]  = React.useState('');
  const history = useHistory();
  let token = localStorage.getItem('token');
  
  const handleChangeInputFormSignUp = (event) => { 
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value}))
  };

  const handleChangeInputFormLogIn = (event) => { 
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value}))
  };

  function handleEditProfileClick() {setIsEditProfilePopupOpen(true)};
  function handleEditAvatarClick() {setIsEditAvatarPopupOpen(true)};
  function handleAddPlaceClick() {setIsAddPlacePopupOpen(true)};
  function handleCardImgClick(card) {setSelectedCard({name: card.name, link: card.link})};
  
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsOpenTooltip(false)
    setSelectedCard(null)
  };


  React.useEffect(() => {
    api.getUserInfo(token) 
      .then((data) => {setСurrentUserData({name: data.name, about: data.about, avatar: data.avatar, email: data.email, _id: data._id.toString(), password: data.password }); })
      .catch(err => {console.log(`Ошибка авторизации пользователя: ${err}`)});
        
    api.getInitialCards(token) 
      .then((data) => {setCards(data.reverse())}) 
      .catch(err => console.log(`Ошибка загрузки карточек: ${err}`))

  }, [loggedIn]); 


  function handleSubmitFormSignUp(evt) {
    evt.preventDefault()
    api.signUp(values.email, values.password)
    .then((res) => {
      if(res) {setTooltipName('success'); setIsOpenTooltip(true); history.push('/signin')} 
      else {setTooltipName('fail'); setIsOpenTooltip(true)}
    })
    .catch(err => {setTooltipName('fail'); console.log(`Ошибка регистрации пользователя: ${err}`)})
  };
 
  
  function handleSubmitFormLogIn(evt) {
    evt.preventDefault()
    api.signIn(values.email, values.password) 
    .then(res => { 
      if(res) {
        localStorage.setItem('token', res.token);
        setLoggedIn(true); 
        history.push('/') 
      } else {setTooltipName('fail'); setIsOpenTooltip(true)} 
    }) 
    .catch((err) => {setTooltipName('fail'); console.log(`Ошибка авторизации пользователя: ${err}`)}) 
  };


  function handleCardLikeClick(card) {
    const isLiked = card.likes.some(l => l === currentUserData._id);
    api.changeLikesStatus(card._id, !isLiked, token)
    .then((newCard) => {setCards((cards) => cards.map((c) => c._id === card.owner ? newCard : c))
      api.getInitialCards(token) 
      .then((data) => {setCards(data)})
      .catch(err => console.log(`Ошибка загрузки карточек: ${err}`))
    })
    .catch(err => console.log(`Ошибка изменения состояния лайка: ${err}`))
  };

  function handleCardDeleteClick(card) {
    api.deleteUserCard(card._id, token)
    .then(() => {setCards(cards => cards.filter(c => {return c._id !== card._id}))})
    .catch(err => console.log(`Ошибка удаления карточки: ${err}`))
  };

  function handleUpdateUser(data) {
    setIsSending(true)
    api.changeUserInfo(data, token)
    .then(res => {setСurrentUserData(res); closeAllPopups(); setIsSending(false)})
    .catch(err => console.log(`Ошибка изменения данных пользователя: ${err}`))
  };

  function handleUpdateAvatar(data) {
    setIsSending(true)
    api.changeUserAvatar(data, token)
    .then(res => {setСurrentUserData(res); closeAllPopups(); setIsSending(false)})
    .catch(err => console.log(`Ошибка изменения аватара пользователя: ${err}`))
  };

  function handleAddPlaceSubmit(data) {
    setIsSending(true)
    api.createUserCard(data, currentUserData._id, token)
    .then(res => {setCards([res.newCard, ...cards]); closeAllPopups(); setIsSending(false)})
    .catch(err => console.log(`Ошибка добавления карточки пользователя: ${err}`))
  };

  return (
    <CurrentUserContext.Provider value={currentUserData}>
      <div className="app">
        <Header email={currentUserData.email}/>
        <Switch>
          <ProtectedRoute exact path="/" component={Main} isLogged={loggedIn} onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onCardImgClick={handleCardImgClick}
            cards={cards} onCardLike={handleCardLikeClick} onCardDelete={handleCardDeleteClick}/>
          <Route path="/signup">
            <Register values={values} onSubmit={handleSubmitFormSignUp} onChange={handleChangeInputFormSignUp}/>
          </Route>
          <Route path="/signin">
            <Login values={values} onSubmit={handleSubmitFormLogIn} onChange={handleChangeInputFormLogIn}/>
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
        <Footer/>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} isSending={isSending}/> 
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar} isSending={isSending}/>
        <AddPlacePopup  isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} isSending={isSending}/>
        {selectedCard && <ImagePopup name = "image" card={selectedCard} onClose={closeAllPopups}/>}
        <InfoTooltip name={tooltipName} isOpen={isOpenTooltip} onClose={closeAllPopups}/>
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;