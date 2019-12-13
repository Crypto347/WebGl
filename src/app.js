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
import CameraLookAt from './components/CameraLookAt/cameraLookAt';
import DirectionalLighting from './components/DirectionalLighting/directionalLighting';
import PointLight from './components/PointLight/pointLight';
import SpotLight from './components/SpotLight/spotLight';

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
                  component={ SpotLight }
               />
            </div>
      );
   }
}

export default App;
