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

import './perspective.scss';

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
* Perspective component definition and export
*/

export class Perspective extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rangeX: 45,
            rangeY: 150,
            rangeZ: 0,
            deg: [0, 0, 0],
            rotation: [40, 25, 325],
            scale: [1, 1, 1],
            fudgeFactor: 0
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
                matrix: this.gl.getUniformLocation(shaderProgram, "u_matrix"),
                fudgeFactor: this.gl.getUniformLocation(shaderProgram, "u_fudgeFactor"),
                
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
            //up

            0, 0, 20,
            30, 0, 20,
            0, 0, 0,

            0, 0, 0,
            30, 0, 20,
            30, 0, 0,

            30, 40, 20,
            50, 40, 20,
            30, 40, 0,

            50, 40, 20,
            50, 40, 0,
            30, 40, 0,

            50, 0, 20,
            80, 0, 20,
            50, 0, 0,

            50, 0, 0,
            80, 0, 20,
            80, 0, 0,

            //down

            0, 100, 20,
            0, 100, 0,
            30, 100, 20,

            0, 100, 0,
            30, 100, 0,
            30, 100, 20,

            30, 60, 20,
            30, 60, 0,
            50, 60, 20,
         

            30, 60, 0,
            50, 60, 0,
            50, 60, 20,
          

            50, 100, 0,
            80, 100, 20,
            50, 100, 20,
           

            80, 100, 20,
            50, 100, 0,
            80, 100, 0,

            //front

            0, 0, 0,
            30, 0, 0, 
            0, 100, 0,

            30, 0, 0,
            30, 100, 0,
            0, 100, 0,

            30, 40, 0,
            50, 40, 0,
            30, 60, 0,
            

            30, 60, 0,
            50, 40, 0,
            50, 60, 0,
            

            50, 0, 0,
            80, 0, 0,
            50, 100, 0,
          
            

            50, 100, 0,
            80, 0, 0,
            80, 100, 0,
            

            //back

            0, 0, 20,
            0, 100, 20,
            30, 0, 20,

            0, 100, 20,
            30, 100, 20,
            30, 0, 20,

            30, 40, 20,
            30, 60, 20,
            50, 40, 20,

            50, 40, 20,
            30, 60, 20,
            50, 60, 20,

            50, 0, 20,
            50, 100, 20,
            80, 0, 20,

            50, 100, 20,
            80, 100, 20,
            80, 0, 20,

            //left

            0, 0, 0,
            0, 0, 20,
            0, 100, 20,

            0, 100, 20,
            0, 100, 0,
            0, 0, 0,
           

            50, 0, 20,
            50, 40, 20,
            50, 40, 0,

            50, 40, 0,
            50, 0, 0,
            50, 0, 20,

            50, 60, 0,
            50, 60, 20,
            50, 100, 20,

            50, 100, 20,
            50, 100, 0,
            50, 60, 0,

            //right

            30, 0, 0,
            30, 40, 20,
            30, 0, 20,

            30, 40, 20,
            30, 0, 0,
            30, 40, 0,

            30, 60, 0,
            30, 100, 20,
            30, 60, 20,

            30, 100, 20,
            30, 60, 0,
            30, 100, 0,

            80, 0, 0,
            80, 100, 20,
            80, 0, 20,
          

            80, 100, 20,
            80, 0, 0,
            80, 100, 0,


        ]), gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
        
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
        
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            1,   0,  0,
            
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
        
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
        
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,
            0,   1,  0,

            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
        
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
        
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,
            0,   0,  1,

            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
        
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
        
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,
            1,   1,  0,

            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
        
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
        
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,
            1,   0,  1,

            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
        
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
        
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
            0,   1,  1,
        
        ]), gl.STATIC_DRAW);
  
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
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing

        gl.useProgram(programInfo.program);

        // let projectionMatrix = this.projectionMatrix(gl.canvas.clientWidth, gl.canvas.clientHeight);

        // let moveOriginMatrix = this.translationMatrix(-30, -40);

        // let matrix = this.multiplyMatrices(translationMatrix, rotationMatrix);
        // matrix = this.multiplyMatrices(matrix, scaleMatrix);
        
        //changing order
        // let matrix = this.multiplyMatrices(scaleMatrix, rotationMatrix);
        //     matrix = this.multiplyMatrices(matrix, translationMatrix);

        let matrix = this.orthographic(0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, 400, -400);
        matrix = this.translate(matrix, this.state.rangeX, this.state.rangeY, this.state.rangeZ);
        matrix = this.rotateX(matrix, this.state.deg[0]);
        matrix = this.rotateY(matrix, this.state.deg[1]);
        matrix = this.rotateZ(matrix, this.state.deg[2]);
        matrix = this.scale(matrix, this.state.scale[0], this.state.scale[1], this.state.scale[2]);

        // gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniformMatrix4fv(programInfo.uniformLocations.matrix, false, matrix);
        gl.uniform1f(programInfo.uniformLocations.fudgeFactor, this.state.fudgeFactor);

        {
            const numComponents = 3;
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
            const numComponents = 3;
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

        // for (let i = 0; i < 5; ++i) {
        //     // Multiply the matrices.
        //     matrix = this.translate(matrix, this.state.rangeX, this.state.rangeY);
        //     matrix = this.rotate(matrix, this.state.deg);
        //     matrix = this.scale(matrix, this.state.scale[0], this.state.scale[1]);
        //     matrix = this.multiplyMatrices(matrix, moveOriginMatrix)
         
        //     // Set the matrix.
        //     gl.uniformMatrix3fv(programInfo.uniformLocations.matrix, false, matrix);
         
        //     // Draw the geometry.
        //     gl.drawArrays(gl.TRIANGLES, 0, 18);
        // }

        {
            const vertexCount = 18 * 9;
            const type = gl.TRIANGLES;
            const offset = 0;
            gl.drawArrays(type, offset, vertexCount);
        }
       
    }

    multiplyMatrices = (firstMatrix, secondMatrix) => {
        let dst = [];
        let secondMatrix00 = secondMatrix[0 * 4 + 0];
        let secondMatrix01 = secondMatrix[0 * 4 + 1];
        let secondMatrix02 = secondMatrix[0 * 4 + 2];
        let secondMatrix03 = secondMatrix[0 * 4 + 3];
        let secondMatrix10 = secondMatrix[1 * 4 + 0];
        let secondMatrix11 = secondMatrix[1 * 4 + 1];
        let secondMatrix12 = secondMatrix[1 * 4 + 2];
        let secondMatrix13 = secondMatrix[1 * 4 + 3];
        let secondMatrix20 = secondMatrix[2 * 4 + 0];
        let secondMatrix21 = secondMatrix[2 * 4 + 1];
        let secondMatrix22 = secondMatrix[2 * 4 + 2];
        let secondMatrix23 = secondMatrix[2 * 4 + 3];
        let secondMatrix30 = secondMatrix[3 * 4 + 0];
        let secondMatrix31 = secondMatrix[3 * 4 + 1];
        let secondMatrix32 = secondMatrix[3 * 4 + 2];
        let secondMatrix33 = secondMatrix[3 * 4 + 3];
        let firstMatrix00 = firstMatrix[0 * 4 + 0];
        let firstMatrix01 = firstMatrix[0 * 4 + 1];
        let firstMatrix02 = firstMatrix[0 * 4 + 2];
        let firstMatrix03 = firstMatrix[0 * 4 + 3];
        let firstMatrix10 = firstMatrix[1 * 4 + 0];
        let firstMatrix11 = firstMatrix[1 * 4 + 1];
        let firstMatrix12 = firstMatrix[1 * 4 + 2];
        let firstMatrix13 = firstMatrix[1 * 4 + 3];
        let firstMatrix20 = firstMatrix[2 * 4 + 0];
        let firstMatrix21 = firstMatrix[2 * 4 + 1];
        let firstMatrix22 = firstMatrix[2 * 4 + 2];
        let firstMatrix23 = firstMatrix[2 * 4 + 3];
        let firstMatrix30 = firstMatrix[3 * 4 + 0];
        let firstMatrix31 = firstMatrix[3 * 4 + 1];
        let firstMatrix32 = firstMatrix[3 * 4 + 2];
        let firstMatrix33 = firstMatrix[3 * 4 + 3];
        dst[ 0] = secondMatrix00 * firstMatrix00 + secondMatrix01 * firstMatrix10 + secondMatrix02 * firstMatrix20 + secondMatrix03 * firstMatrix30;
        dst[ 1] = secondMatrix00 * firstMatrix01 + secondMatrix01 * firstMatrix11 + secondMatrix02 * firstMatrix21 + secondMatrix03 * firstMatrix31;
        dst[ 2] = secondMatrix00 * firstMatrix02 + secondMatrix01 * firstMatrix12 + secondMatrix02 * firstMatrix22 + secondMatrix03 * firstMatrix32;
        dst[ 3] = secondMatrix00 * firstMatrix03 + secondMatrix01 * firstMatrix13 + secondMatrix02 * firstMatrix23 + secondMatrix03 * firstMatrix33;
        dst[ 4] = secondMatrix10 * firstMatrix00 + secondMatrix11 * firstMatrix10 + secondMatrix12 * firstMatrix20 + secondMatrix13 * firstMatrix30;
        dst[ 5] = secondMatrix10 * firstMatrix01 + secondMatrix11 * firstMatrix11 + secondMatrix12 * firstMatrix21 + secondMatrix13 * firstMatrix31;
        dst[ 6] = secondMatrix10 * firstMatrix02 + secondMatrix11 * firstMatrix12 + secondMatrix12 * firstMatrix22 + secondMatrix13 * firstMatrix32;
        dst[ 7] = secondMatrix10 * firstMatrix03 + secondMatrix11 * firstMatrix13 + secondMatrix12 * firstMatrix23 + secondMatrix13 * firstMatrix33;
        dst[ 8] = secondMatrix20 * firstMatrix00 + secondMatrix21 * firstMatrix10 + secondMatrix22 * firstMatrix20 + secondMatrix23 * firstMatrix30;
        dst[ 9] = secondMatrix20 * firstMatrix01 + secondMatrix21 * firstMatrix11 + secondMatrix22 * firstMatrix21 + secondMatrix23 * firstMatrix31;
        dst[10] = secondMatrix20 * firstMatrix02 + secondMatrix21 * firstMatrix12 + secondMatrix22 * firstMatrix22 + secondMatrix23 * firstMatrix32;
        dst[11] = secondMatrix20 * firstMatrix03 + secondMatrix21 * firstMatrix13 + secondMatrix22 * firstMatrix23 + secondMatrix23 * firstMatrix33;
        dst[12] = secondMatrix30 * firstMatrix00 + secondMatrix31 * firstMatrix10 + secondMatrix32 * firstMatrix20 + secondMatrix33 * firstMatrix30;
        dst[13] = secondMatrix30 * firstMatrix01 + secondMatrix31 * firstMatrix11 + secondMatrix32 * firstMatrix21 + secondMatrix33 * firstMatrix31;
        dst[14] = secondMatrix30 * firstMatrix02 + secondMatrix31 * firstMatrix12 + secondMatrix32 * firstMatrix22 + secondMatrix33 * firstMatrix32;
        dst[15] = secondMatrix30 * firstMatrix03 + secondMatrix31 * firstMatrix13 + secondMatrix32 * firstMatrix23 + secondMatrix33 * firstMatrix33;
        return dst;
    }

    translate = (m, tx, ty, tz) => {
        return this.multiplyMatrices(m, this.translationMatrix(tx, ty, tz));
    }

    rotateX = (m, deg) => {
        return this.multiplyMatrices(m, this.rotationMatrixX(deg));
    }

    rotateY = (m, deg) => {
        return this.multiplyMatrices(m, this.rotationMatrixY(deg));
    }

    rotateZ = (m, deg) => {
        return this.multiplyMatrices(m, this.rotationMatrixZ(deg));
    }

    scale = (m, sx, sy, sz) => {
        return this.multiplyMatrices(m, this.scalingMatrix(sx, sy, sz));
    }

    orthographic = (left, right, bottom, top, near, far) => {
        return[
            2/(right - left), 0, 0, 0,
            0, 2/(top - bottom), 0, 0,
            0, 0, 2/(near - far), 0,

            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1
        ]
    }

    // projectionMatrix = (width, height, depth) => {
    //     // Note: This matrix flips the Y axis so 0 is at the top.
    //     return [
    //         2 / width, 0, 0, 0,
    //         0, -2 / height, 0, 0,
    //         0, 0, 2 / depth, 0,
    //        -1, 1, 0, 1,
    //     ]
    // }

    identity = () => {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1]
    }

    translationMatrix = (tx, ty, tz) => {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ];
    }

    rotationMatrixX = (deg) => {
        let angle = 360 - deg;
        let c = Math.cos(angle*Math.PI/180);
        let s = Math.sin(angle*Math.PI/180);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    }

    rotationMatrixY = (deg) => {
        let angle = 360 - deg;
        let c = Math.cos(angle*Math.PI/180);
        let s = Math.sin(angle*Math.PI/180);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    }

    rotationMatrixZ = (deg) => {
        let angle = 360 - deg;
        let c = Math.cos(angle*Math.PI/180);
        let s = Math.sin(angle*Math.PI/180);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    scalingMatrix = (sx, sy, sz) => {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    }

    /**
    * Translation
    */ 

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

    handleOnChangeZ = (e) => {
        this.setState({
            rangeZ: +e.target.value
        })
        this.updateCanvas()
    }

    /**
    * Rotation
    */ 

    handleRotationOnChangeX = (e) => {
        let updatedDeg = [...this.state.deg];
        let degX = +e.target.value;
        updatedDeg.splice(0, 1, degX)

        this.setState({
            deg: updatedDeg
        })
        this.updateCanvas()
    }

    handleRotationOnChangeY = (e) => {
        let updatedDeg = [...this.state.deg];
        let degY = +e.target.value;
        updatedDeg.splice(1, 1, degY)

        this.setState({
            deg: updatedDeg
        })
        this.updateCanvas()
    }

    handleRotationOnChangeZ = (e) => {
        let updatedDeg = [...this.state.deg];
        let degZ = +e.target.value;
        updatedDeg.splice(2, 1, degZ)

        this.setState({
            deg: updatedDeg
        })
        this.updateCanvas()
    }

    /**
    * Scale
    */ 

    handleOnChangeScaleX = (e) => {
        let updatedScale = [...this.state.scale];
        let x = +e.target.value;
        updatedScale.splice(0, 1 , x)
        this.setState({
            scale: updatedScale
        });
        this.updateCanvas();
    }

    handleOnChangeScaleY = (e) => {
        let updatedScale = [...this.state.scale];
        let y = +e.target.value;
        updatedScale.splice(1, 1 , y)
        this.setState({
            scale: updatedScale
        });
        this.updateCanvas();
    }

    handleOnChangeScaleZ = (e) => {
        let updatedScale = [...this.state.scale];
        let z = +e.target.value;
        updatedScale.splice(2, 1 , z)
        this.setState({
            scale: updatedScale
        });
        this.updateCanvas();
    }

    /**
    * fudgeFactor
    */ 

    handleOnChangeFudgeFactor = (e) => {
        let updatedScale = +e.target.value;
        this.setState({
            fudgeFactor: updatedScale
        });
        this.updateCanvas();
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
                    <input type="range" value={this.state.rangeX} min="0" max="1424" onChange={() => this.handleOnChangeX(event)}/>
                    <div>Y coordinate ({this.state.rangeY})</div>
                    <input type="range" value={this.state.rangeY} min="0" max="642" onChange={() => this.handleOnChangeY(event)}/>
                    <div>Z coordinate ({this.state.rangeZ})</div>
                    <input type="range" value={this.state.rangeZ} min="0" max="400" onChange={() => this.handleOnChangeZ(event)}/>
                    <div>AngleX({this.state.deg[0]})</div>
                    <input type="range" value={this.state.deg[0]} min="0" max="360" onChange={() => this.handleRotationOnChangeX(event)}/>
                    <div>AngleY({this.state.deg[1]})</div>
                    <input type="range" value={this.state.deg[1]} min="0" max="360" onChange={() => this.handleRotationOnChangeY(event)}/>
                    <div>AngleZ({this.state.deg[2]})</div>
                    <input type="range" value={this.state.deg[2]} min="0" max="360" onChange={() => this.handleRotationOnChangeZ(event)}/>
                    <div>ScaleX ({this.state.scale[0]})</div>
                    <input type="range" value={this.state.scale[0]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleX(event)}/>
                    <div>ScaleY({this.state.scale[1]})</div>
                    <input type="range" value={this.state.scale[1]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleY(event)}/>
                    <div>ScaleZ({this.state.scale[2]})</div>
                    <input type="range" value={this.state.scale[2]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleZ(event)}/>
                    <div>fudgeFactor({this.state.fudgeFactor})</div>
                    <input type="range" value={this.state.sfudgeFactor} min="0" max="2" step="0.001" onChange={() => this.handleOnChangeFudgeFactor(event)}/>
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
)(Perspective);
 