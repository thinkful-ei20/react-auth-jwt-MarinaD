import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, clearAuth, toggleModal} from '../actions/auth';

export class App extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.loggedIn && this.props.loggedIn) {
      this.startPeriodicRefresh();
      this.startWarning();
      this.startInactivity();      
    } 
    else if (prevProps.loggedIn && !this.props.loggedIn) {
      this.stopPeriodicRefresh();
      this.stopInactivity();
      this.stopWarning();
    }
    else if (prevProps.modal && !this.props.modal){
      this.stopInactivity();      
      this.stopWarning();

      this.startWarning();
      this.startInactivity();
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
    this.stopInactivity();
    this.stopWarning();
  } 
  
  startWarning() {
    this.warningInterval = setInterval(
      () => {
        this.props.dispatch(toggleModal(true));
      },
      4 * 60 * 1000
    );
  }

  stopWarning() {
    if(!this.warningInterval){
      return;
    }
    clearInterval(this.warningInterval);
  }

  startInactivity() {
    this.inactivityInterval = setInterval(
      () => {
        this.props.dispatch(toggleModal(false));
        this.props.dispatch(clearAuth());
      },
      5* 60 * 1000
    );
  }

  stopInactivity() {
    if(!this.inactivityInterval){
      return;
    }
    clearInterval(this.inactivityInterval);
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()),
      10 * 60 * 1000
    );
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }

  render() {
    return (
      <div className="app">
        <HeaderBar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/register" component={RegistrationPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null,
  modal : state.auth.modal
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
