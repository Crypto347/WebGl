/**
* Libraries
*/

import React,{
   Component
} from 'react';

import {
   Route
} from 'react-router-dom';

/**
* Components
*/

import Cube from './components/Cube/cube';
import Ex from './components/example/ex';
import Translation from './components/Translation/translation';
import TranslationMatrix from './components/TranslationMatrix/translationMatrix';
import Orthographic3D from './components/Orthographic3D/orthographic3D';
import Perspective from './components/Perspective/perspective';
import Camera from './components/Camera/camera';

/**
* Styles
*/

import './app.scss';


/**
* App component definition and export
*/

export class App extends Component {

   /**
   * Markup
   */

   render(){
      return(
            <div className="app">
                <Route 
                  exact 
                  path="/"
                  component={ Camera }
               />
            </div>
      );
   }
}

export default App;
