/**
* Libraries
*/

import React,{
    Component
} from 'react';
 
import {
    connect
} from 'react-redux';

import {
    bindActionCreators
} from 'redux';

import {
    useProgram,
    useWebGLContext,
} from '@react-vertex/core';

import {
    mat4
} from 'gl-matrix';

/**
* Components
*/

/**
* Styles
*/

import './translation.scss';

/**
* Selectors
*/

import * as Selectors from '../../reducers/selectors';

/**
* Actions
*/

import * as Actions from '../../actions';

/**
* Shaders
*/

import * as Shaders from './Shaders';

/**
* WebGl Utility
*/

import * as WebGlUtility from '../../WebGlUtility';


/**
* Images
*/

import logo from '../../images/kuQpOb-logo-instagram-images.png';

/**
* Utility
*/

import * as Utility from '../../utility';


/**
* Ex component definition and export
*/

export class Translation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rangeX: 0,
            rangeY: 0
        };
    }

    /**
    * Methods
    */

    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas = () => {
        const canvas = this.refs.canvas;
        this.gl = canvas.getContext("webgl");

        if (this.gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const shaderProgram = WebGlUtility.initShaderProgram(this.gl, Shaders.vert, Shaders.frag);
        
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                position: this.gl.getAttribLocation(shaderProgram, "a_position"),
                color: this.gl.getAttribLocation(shaderProgram, "a_color")
               
            },
            uniformLocations: {
                resolution: this.gl.getUniformLocation(shaderProgram, "u_resolution"),
                translation: this.gl.getUniformLocation(shaderProgram, "u_translation"),
            },
        };

        const buffers = this.initBuffers(this.gl);
       
        this.drawScene(this.gl, programInfo, buffers);
        // const texture = this.initTexture(this.gl, logo);

        
    }
    
    initBuffers = (gl) => {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
       
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0,0,
            0,80,
            20,0,
            20,0,
            20,80,
            0,80,

            20,30,
            40,30,
            20,50,
            20,50,
            40,50,
            40,30,
            
            40,0,
            60,0,
            40,80,
            40,80,
            60,80,
            60,0
        ]), gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.8,0,1,0.6,
            0.6,0.8,0.2,1,
            0.6,0.6,1,0.6,
            0.2,0,1,1,
            0.8,0,0.2,1,
            0.6,0.8,0.6,1,
        
            0.8,0,1,0.6,
            0.6,0.8,0.2,1,
            0.6,0.6,1,0.6,
            0.2,0,1,1,
            0.8,0,0.2,1,
            0.6,0.8,0.6,1,
        
            0.8,0,1,0.6,
            0.6,0.8,0.2,1,
            0.6,0.6,1,0.6,
            0.2,0,1,1,
            0.8,0,0.2,1,
            0.6,0.8,0.6,1]), gl.STATIC_DRAW);
  
        return {
            position: positionBuffer,
            color: colorBuffer,
        };
    }

    drawScene = (gl, programInfo, buffers) => {
       
        /**
        * Clear the canvas before we start drawing on it.
        */  
       
        gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
      
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programInfo.program);

        gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(programInfo.uniformLocations.translation, this.state.rangeX, this.state.rangeY);
            
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.position,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.position);
        }

        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.color,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.color);
        }

        {
            const vertexCount = 18;
            const type = gl.TRIANGLES;
            const offset = 0;
            gl.drawArrays(type, offset, vertexCount);
        }
       
    }

    handleOnChangeX = (e) => {
        this.setState({
            rangeX: +e.target.value
        })
        this.updateCanvas()
    }

    handleOnChangeY = (e) => {
        this.setState({
            rangeY: +e.target.value
        })
        this.updateCanvas()
    }

    /**
    * Markup
    */

    render(){
        return(
            <div className="threeDSphere-input">
                <canvas width={window.innerWidth - 35} height={window.innerHeight} style={{border: "2px solid pink"}} ref="canvas" ></canvas>
                <div className="input-wrapper">
                    <input type="range" value={this.state.rangeX} min="0" max="500" onChange={() => this.handleOnChangeX(event)}/>
                    <input type="range" value={this.state.rangeY} min="0" max="500" onChange={() => this.handleOnChangeY(event)}/>
                </div>
            </div> 
        );
    }
}

export default connect(
    (state) => {
        return {
            // circles: Selectors.getCirclesState(state),
        };
    },
    (dispatch) => {
        return {
            // moveCircleXCoordinate: bindActionCreators(Actions.moveCircleXCoordinate, dispatch),
        };
    }
)(Translation);
 