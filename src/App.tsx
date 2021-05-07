import React, { Suspense, useRef } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';
import './App.global.css';

import { ToastContainer} from 'react-toastify';

import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import UploadPage from './components/UploadPage';

import 'model-viewer.min.js';

const tmp = require('tmp');

import { supabase } from './Store';
import HomePage from './components/HomePage';


export default function App() {
  const [user, updateUser] = React.useState<any>();

  const loadUser = async () => {
    const session = await supabase.auth.session();
    if (session != null) updateUser(session.user);
  };

  React.useEffect(() => {
    loadUser();
    supabase.auth.onAuthStateChange((event: any, session: any) => {
      console.log(event);
      if (session) updateUser(session.user);
      else updateUser(null);
    });
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/upload" exact>
          <UploadPage user={user} />
        </Route>
        <Route path="/login" component={LoginPage} />
      </Switch>
      <ToastContainer />
    </Router>
  );
}
