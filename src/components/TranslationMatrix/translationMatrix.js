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

import './translationMatrix.scss';

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

export class TranslationMatrix extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rangeX: 60,
            rangeY: 40,
            deg: 0,
            rotation: [0, 1],
            scale: [0.85, 0.85]
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
                matrix: this.gl.getUniformLocation(shaderProgram, "u_matrix"),
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

        let translationMatrix = this.translationMatrix(this.state.rangeX, this.state.rangeY);
        let rotationMatrix = this.rotationMatrix(this.state.deg);
        let scaleMatrix = this.scalingMatrix(this.state.scale[0], this.state.scale[1]);

        let moveOriginMatrix = this.translationMatrix(-30, -40);

        // let matrix = this.multiplyMatrices(translationMatrix, rotationMatrix);
        // matrix = this.multiplyMatrices(matrix, scaleMatrix);
        
        //changing order
        // let matrix = this.multiplyMatrices(scaleMatrix, rotationMatrix);
        //     matrix = this.multiplyMatrices(matrix, translationMatrix);

        let matrix = this.identity();

        gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        // gl.uniformMatrix3fv(programInfo.uniformLocations.matrix, false, matrix);

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

        for (let i = 0; i < 5; ++i) {
            // Multiply the matrices.
            matrix = this.multiplyMatrices(matrix, translationMatrix);
            matrix = this.multiplyMatrices(matrix, rotationMatrix);
            matrix = this.multiplyMatrices(matrix, scaleMatrix);
            matrix = this.multiplyMatrices(matrix, moveOriginMatrix)
         
            // Set the matrix.
            gl.uniformMatrix3fv(programInfo.uniformLocations.matrix, false, matrix);
         
            // Draw the geometry.
            gl.drawArrays(gl.TRIANGLES, 0, 18);
        }

        // {
        //     const vertexCount = 18;
        //     const type = gl.TRIANGLES;
        //     const offset = 0;
        //     gl.drawArrays(type, offset, vertexCount);
        // }
       
    }

    multiplyMatrices = (firstMatrix, secondMatrix) => {
        const firstMatrix00 = firstMatrix[0 * 3 + 0];
        const firstMatrix01 = firstMatrix[0 * 3 + 1];
        const firstMatrix02 = firstMatrix[0 * 3 + 2];
        const firstMatrix10 = firstMatrix[1 * 3 + 0];
        const firstMatrix11 = firstMatrix[1 * 3 + 1];
        const firstMatrix12 = firstMatrix[1 * 3 + 2];
        const firstMatrix20 = firstMatrix[2 * 3 + 0];
        const firstMatrix21 = firstMatrix[2 * 3 + 1];
        const firstMatrix22 = firstMatrix[2 * 3 + 2];
        const secondMatrix00 = secondMatrix[0 * 3 + 0];
        const secondMatrix01 = secondMatrix[0 * 3 + 1];
        const secondMatrix02 = secondMatrix[0 * 3 + 2];
        const secondMatrix10 = secondMatrix[1 * 3 + 0];
        const secondMatrix11 = secondMatrix[1 * 3 + 1];
        const secondMatrix12 = secondMatrix[1 * 3 + 2];
        const secondMatrix20 = secondMatrix[2 * 3 + 0];
        const secondMatrix21 = secondMatrix[2 * 3 + 1];
        const secondMatrix22 = secondMatrix[2 * 3 + 2];
        return [
            secondMatrix00 * firstMatrix00 + secondMatrix01 * firstMatrix10 + secondMatrix02 * firstMatrix20,
            secondMatrix00 * firstMatrix01 + secondMatrix01 * firstMatrix11 + secondMatrix02 * firstMatrix21,
            secondMatrix00 * firstMatrix02 + secondMatrix01 * firstMatrix12 + secondMatrix02 * firstMatrix22,
            secondMatrix10 * firstMatrix00 + secondMatrix11 * firstMatrix10 + secondMatrix12 * firstMatrix20,
            secondMatrix10 * firstMatrix01 + secondMatrix11 * firstMatrix11 + secondMatrix12 * firstMatrix21,
            secondMatrix10 * firstMatrix02 + secondMatrix11 * firstMatrix12 + secondMatrix12 * firstMatrix22,
            secondMatrix20 * firstMatrix00 + secondMatrix21 * firstMatrix10 + secondMatrix22 * firstMatrix20,
            secondMatrix20 * firstMatrix01 + secondMatrix21 * firstMatrix11 + secondMatrix22 * firstMatrix21,
            secondMatrix20 * firstMatrix02 + secondMatrix21 * firstMatrix12 + secondMatrix22 * firstMatrix22,
        ];
    }

    identity = () => {
        return [
            1,0,0,
            0,1,0,
            0,0,1]
    }

    translationMatrix = (tx, ty) => {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    }

    rotationMatrix = (deg) => {
        let angle = 360 - deg;
        let c = Math.cos(angle*Math.PI/180);
        let s = Math.sin(angle*Math.PI/180);

        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    }

    scalingMatrix = (sx, sy) => {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
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

    handleRotationOnChange = (e) => {
        // let updateRotation = [this.state.rotation];
        let deg = +e.target.value;
        // let x = Math.cos(deg*Math.PI/180);
        // let y = Math.sin(deg*Math.PI/180);
    
        // updateRotation.splice(0, 1, x);
        // updateRotation.splice(1, 1, y);

        this.setState({
            deg: deg,
            // rotation: updateRotation
        })
        this.updateCanvas()
    }

    handleOnChangeScaleX = (e) => {
        let updatedScale = [...this.state.scale];
        let x = +e.target.value;
        updatedScale.splice(0, 1 , x)
        this.setState({
            scale: updatedScale
        })
        this.updateCanvas()
    }

    handleOnChangeScaleY = (e) => {
        let updatedScale = [...this.state.scale];
        let y = +e.target.value;
        updatedScale.splice(1, 1 , y)
        this.setState({
            scale: updatedScale
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
                    <div>X coordinate({this.state.rangeX})</div>
                    <input type="range" value={this.state.rangeX} min="0" max="500" onChange={() => this.handleOnChangeX(event)}/>
                    <div>Y coordinate ({this.state.rangeY})</div>
                    <input type="range" value={this.state.rangeY} min="0" max="500" onChange={() => this.handleOnChangeY(event)}/>
                    <div>Angle({this.state.deg})</div>
                    <input type="range" value={this.state.deg} min="0" max="360" onChange={() => this.handleRotationOnChange(event)}/>
                    <div>ScaleX ({this.state.scale[0]})</div>
                    <input type="range" value={this.state.scale[0]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleX(event)}/>
                    <div>ScaleY({this.state.scale[1]})</div>
                    <input type="range" value={this.state.scale[1]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleY(event)}/>
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
)(TranslationMatrix);
 