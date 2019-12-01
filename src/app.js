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
                  component={ Translation }
               />
            </div>
      );
   }
}

export default App;
