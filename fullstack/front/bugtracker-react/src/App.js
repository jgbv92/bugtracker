import React, { Component } from 'react';
import {Routes, Route} from 'react-router-dom';
import MobilePage from './componentes/MobilePage/MobilePage'
import PressPage from './componentes/PressPage/PressPage'
import WebPage from './componentes/WebPage/WebPage'
import Layout from './Layout/Layout'
import Home from './componentes/Home/Home';
import Profile from './componentes/Profile/Profile';

class App extends Component {

  render() { 
    return (
      <Layout>
        <Routes>
          <Route element={<Home/>} path='/' />
          <Route element={<MobilePage/>} path= '/mobilepage'/>
          <Route element={<WebPage/>} path= '/webpage'/>
          <Route element={<PressPage/>} path= '/presspage'/>
          <Route element={<Profile/>} path= '/profile'/>
        </Routes>
      </Layout>
    );
  }
}
 
export default App;