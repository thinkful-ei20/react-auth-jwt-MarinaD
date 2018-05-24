import React from 'react';
import {connect} from 'react-redux';
import {clearAuth, toggleModal} from '../actions/auth';
import {clearAuthToken} from '../local-storage';

export class HeaderBar extends React.Component {
  logOut() {
    this.props.dispatch(clearAuth());
    // clearAuthToken();
  }

  render() {
    // Only render the log out button if we are logged in

    let logOutButton;
    if (this.props.loggedIn) {
      logOutButton = (
        <button onClick={() => this.logOut()}>Log out</button>
      );
    }

    let inactivityModal;
    if (this.props.modal){
      inactivityModal = (
        <div>
          <p>You will be logged out in one minute</p>
          <button onClick={()=> this.props.dispatch(toggleModal(false))}>I am still here</button>
        </div>
      );
    }

    return (
      <div className="header-bar">
        <h1>Foo App</h1>
        {inactivityModal}
        {logOutButton}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null,
  modal : state.auth.modal
});

export default connect(mapStateToProps)(HeaderBar);
