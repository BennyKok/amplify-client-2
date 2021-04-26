import React, { Suspense, useRef } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';
import icon from '../assets/icon.svg';
import './App.global.css';

import { ToastContainer} from 'react-toastify';

import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar.js';
import UploadPage from './components/UploadPage.tsx';

import 'model-viewer.min.js';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const tmp = require('tmp');

import { handleError } from './Utils';
import { supabase } from './Store';

import path from 'path';

const { exec } = require('child_process');

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
          <UploadPage user={user} />
        </Route>
        <Route path="/login" component={LoginPage} />
      </Switch>
      <ToastContainer />
    </Router>
  );
}
