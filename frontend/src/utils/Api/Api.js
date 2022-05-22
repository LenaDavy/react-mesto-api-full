import React from 'react';


class Api extends React.Component {

  handleResponce = res => {if (res.ok) {return res.json()} return Promise.reject(`Error: ${res.status}`)};
    
  signUp = (email, password) => {
    return fetch(`${this.props.url}/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password, email})
    })
    .then(this.handleResponce)
  };

  signIn = (email, password) => {
    return fetch(`${this.props.url}/signin`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password, email})
    })
    .then(this.handleResponce)
  };

  signOut = () => {
    return fetch(`${this.props.url}/signout`, {
      headers: {'Content-Type': 'application/json'},
    })
    .then(this.handleResponce)
  };

  getUserInfo = (token) => { 
    return fetch(`${this.props.url}/users/me`, { 
      headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${token}` },
    })
    .then(this.handleResponce)
  }; 
  
  changeUserAvatar = (avatarPopupValue) => { 
    return fetch(`${this.props.url}/users/me/avatar`, { 
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${localStorage.getItem('token')}`}, 
      body: JSON.stringify({ 
        avatar: avatarPopupValue.avatar, 
      }) 
    }) 
    .then(this.handleResponce) 
  }; 
  
  changeUserInfo = (profilePopupValues, token) => { 
    return fetch(`${this.props.url}/users/me`, { 
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${token}`},
      body: JSON.stringify({ 
        name: profilePopupValues.name, 
        about: profilePopupValues.about 
      }) 
    }) 
      .then(this.handleResponce) 
    }; 

    getInitialCards = (token) => { 
      return fetch(`${this.props.url}/cards`, { 
        headers: { 'Content-Type': 'application/json', "Authorization" : `Bearer ${token}` },
      })
      .then(this.handleResponce)
    }; 
    
    createUserCard = (cardPopupValues, userId, token) => {
      return fetch(`${this.props.url}/cards`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${token}` },
        body: JSON.stringify({ 
          name: cardPopupValues.name, 
          link: cardPopupValues.link,
          owner: userId,
        }) 
      }) 
      .then(this.handleResponce) 
    }; 

  changeLikesStatus = (cardId, like, token) => { 
    return fetch(`${this.props.url}/cards/${cardId}/likes`, { 
      method: like ? 'PUT' : 'DELETE',
      headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${token}`}
    }) 
    .then(this.handleResponce) 
  }; 
   
  deleteUserCard = (id, token) => { 
    return fetch(`${this.props.url}/cards/${id}`, { 
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${token}`},
    }) 
    .then(this.handleResponce) 
  }; 
};

export const api = new Api({ 
    url: 'https://api.mestoru.nomoreparties.sbs',
})