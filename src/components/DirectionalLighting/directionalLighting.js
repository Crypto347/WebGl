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

import './directionalLighting.scss';

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
* DirectionalLighting component definition and export
*/

export class DirectionalLighting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rangeX: 177,
            rangeY: 177,
            rangeZ: -390,
            deg: [0, 0, 0],
            rotation: [40, 25, 325],
            scale: [1, 1, 1],
            fudgeFactor: 0,
            fieldOfView: 100,
            cameraAngle: 0,
            cameraRadius: 400,
            numberOfH: 5
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
                // fudgeFactor: this.gl.getUniformLocation(shaderProgram, "u_fudgeFactor"),
                
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
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let zNear = 1;
        let zFar = 2000;

        let matrix = this.perspective(this.state.fieldOfView, aspect, zNear, zFar);
        matrix = this.translate(matrix, this.state.rangeX, this.state.rangeY, this.state.rangeZ);
        matrix = this.rotateX(matrix, this.state.deg[0]);
        matrix = this.rotateY(matrix, this.state.deg[1]);
        matrix = this.rotateZ(matrix, this.state.deg[2]);
        matrix = this.scale(matrix, this.state.scale[0], this.state.scale[1], this.state.scale[2]);

        // Compute the position of the first F
        // let fPosition = [this.state.cameraRadius, 0, 0];

        // let cameraMatrix = this.rotationMatrixY(this.state.cameraAngle);
        // cameraMatrix = this.translate(cameraMatrix, 0, 0, this.state.cameraRadius * 1.5);

        // Get the camera's position from the matrix we computed
        // let cameraPosition = [
        //     cameraMatrix[12],
        //     cameraMatrix[13],
        //     cameraMatrix[14],
        // ];
        // let up = [0, 1, 0];

        // cameraMatrix = this.lookAt(cameraPosition, fPosition, up);
        // let viewMatrix = this.inverseMatrix(cameraMatrix);

        // let viewProjectionMatrix = this.multiplyMatrices(projectionMatrix, viewMatrix);

        // gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniformMatrix4fv(programInfo.uniformLocations.matrix, false, matrix);
        // gl.uniform1f(programInfo.uniformLocations.fudgeFactor, this.state.fudgeFactor);

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

        // for (let i = 0; i < this.state.numberOfH; ++i) {
        //     let angle = i * Math.PI * 2 / this.state.numberOfH;
        //     let x = Math.cos(angle) * this.state.cameraRadius;
        //     let y = Math.sin(angle) * this.state.cameraRadius;

        //     // Multiply the matrices.
        //     let matrix = this.translate(viewProjectionMatrix, x, 0, y);
         
        //     // Set the matrix.
        //     gl.uniformMatrix4fv(programInfo.uniformLocations.matrix, false, matrix);
         
        //     // Draw the geometry.
        //     gl.drawArrays(gl.TRIANGLES, 0, 18 * 9);
        // }

        {
            const vertexCount = 18 * 9;
            const type = gl.TRIANGLES;
            const offset = 0;
            gl.drawArrays(type, offset, vertexCount);
        }
       
    }

    lookAt = (cameraPosition, target, up) => {
        var zAxis = this.normalizeVector(
            this.subtractVectors(cameraPosition, target)
        );
        var xAxis = this.normalizeVector(this.crossProductOfVectors(up, zAxis));
        var yAxis = this.normalizeVector(this.crossProductOfVectors(zAxis, xAxis));
     
        return [
           xAxis[0], xAxis[1], xAxis[2], 0,
           yAxis[0], yAxis[1], yAxis[2], 0,
           zAxis[0], zAxis[1], zAxis[2], 0,
           cameraPosition[0],
           cameraPosition[1],
           cameraPosition[2],
           1,
        ];
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

    perspective = (fieldOfViewInDegree, aspect, near, far) => {
        let fieldOfViewInRadians = fieldOfViewInDegree * Math.PI / 180;
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        let rangeInv = 1.0 / (near - far);
     
        return [
          f / aspect, 0, 0, 0,
          0, f, 0, 0,
          0, 0, (near + far) * rangeInv, -1,
          0, 0, near * far * rangeInv * 2, 0
        ];
    }

    makeZToWMatrix = (fudgeFactor) => {
        return [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, fudgeFactor,
          0, 0, 0, 1,
        ];
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

    projectionMatrix = (width, height, depth) => {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
           -1, 1, 0, 1,
        ]
    }

    identityMatrix = () => {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1]
    }

    inverseMatrix = (m) => {
        let m00 = m[0 * 4 + 0];
        let m01 = m[0 * 4 + 1];
        let m02 = m[0 * 4 + 2];
        let m03 = m[0 * 4 + 3];
        let m10 = m[1 * 4 + 0];
        let m11 = m[1 * 4 + 1];
        let m12 = m[1 * 4 + 2];
        let m13 = m[1 * 4 + 3];
        let m20 = m[2 * 4 + 0];
        let m21 = m[2 * 4 + 1];
        let m22 = m[2 * 4 + 2];
        let m23 = m[2 * 4 + 3];
        let m30 = m[3 * 4 + 0];
        let m31 = m[3 * 4 + 1];
        let m32 = m[3 * 4 + 2];
        let m33 = m[3 * 4 + 3];
        let tmp_0  = m22 * m33;
        let tmp_1  = m32 * m23;
        let tmp_2  = m12 * m33;
        let tmp_3  = m32 * m13;
        let tmp_4  = m12 * m23;
        let tmp_5  = m22 * m13;
        let tmp_6  = m02 * m33;
        let tmp_7  = m32 * m03;
        let tmp_8  = m02 * m23;
        let tmp_9  = m22 * m03;
        let tmp_10 = m02 * m13;
        let tmp_11 = m12 * m03;
        let tmp_12 = m20 * m31;
        let tmp_13 = m30 * m21;
        let tmp_14 = m10 * m31;
        let tmp_15 = m30 * m11;
        let tmp_16 = m10 * m21;
        let tmp_17 = m20 * m11;
        let tmp_18 = m00 * m31;
        let tmp_19 = m30 * m01;
        let tmp_20 = m00 * m21;
        let tmp_21 = m20 * m01;
        let tmp_22 = m00 * m11;
        let tmp_23 = m10 * m01;
    
        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    
        return [
          d * t0,
          d * t1,
          d * t2,
          d * t3,
          d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
          d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
          d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
          d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
          d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
          d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
          d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
          d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
          d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
          d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
          d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
          d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
    }

    crossProductOfVectors = (a, b) => {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    subtractVectors = (a, b) => {
        return [
            a[0] - b[0], a[1] - b[1], a[2] - b[2]
        ];
    }

    normalizeVector = (v) => {
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
          return [v[0] / length, v[1] / length, v[2] / length];
        } else {
          return [0, 0, 0];
        }
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
    * Fudge factor
    */ 

    handleOnChangeFudgeFactor = (e) => {
        let updatedScale = +e.target.value;
        this.setState({
            fudgeFactor: updatedScale
        });
        this.updateCanvas();
    }

    /**
    * Field of view
    */ 

    handleOnChangeFieldOfView = (e) => {
        let updatedFieldOfView = +e.target.value;
        this.setState({
            fieldOfView: updatedFieldOfView
        });
        this.updateCanvas();
    }

    /**
    * Camera angle
    */ 

    handleOnChangeCameraAngle = (e) => {
        let updatedCameraAngle = +e.target.value;
        this.setState({
            cameraAngle: updatedCameraAngle
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
                    <input type="range" value={this.state.rangeX} min="-750" max="500" onChange={() => this.handleOnChangeX(event)}/>
                    <div>Y coordinate ({this.state.rangeY})</div>
                    <input type="range" value={this.state.rangeY} min="-378" max="277" onChange={() => this.handleOnChangeY(event)}/>
                    <div>Z coordinate ({this.state.rangeZ})</div>
                    <input type="range" value={this.state.rangeZ} min="-1000" max="1" onChange={() => this.handleOnChangeZ(event)}/>
                    <div>AngleX({this.state.deg[0]})</div>
                    <input type="range" value={this.state.deg[0]} min="0" max="360" onChange={() => this.handleRotationOnChangeX(event)}/>
                    <div>AngleY({this.state.deg[1]})</div>
                    <input type="range" value={this.state.deg[1]} min="0" max="360" onChange={() => this.handleRotationOnChangeY(event)}/>
                    <div>AngleZ({this.state.deg[2]})</div>
                    <input type="range" value={this.state.deg[2]} min="0" max="360" onChange={() => this.handleRotationOnChangeZ(event)}/>
                    {/* <div>ScaleX ({this.state.scale[0]})</div>
                    <input type="range" value={this.state.scale[0]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleX(event)}/>
                    <div>ScaleY({this.state.scale[1]})</div>
                    <input type="range" value={this.state.scale[1]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleY(event)}/>
                    <div>ScaleZ({this.state.scale[2]})</div>
                    <input type="range" value={this.state.scale[2]} min="-5" max="5" step="0.01" onChange={() => this.handleOnChangeScaleZ(event)}/> */}
                    {/* <div>fudgeFactor({this.state.fudgeFactor})</div>
                    <input type="range" value={this.state.sfudgeFactor} min="0" max="2" step="0.001" onChange={() => this.handleOnChangeFudgeFactor(event)}/> */}
                    <div>fieldOfView({this.state.fieldOfView})</div>
                    <input type="range" value={this.state.fieldOfView} min="0" max="179" step="1" onChange={() => this.handleOnChangeFieldOfView(event)}/>
                    {/* <div>cameraAngle({this.state.cameraAngle})</div>
                    <input type="range" value={this.state.cameraAngle} min="-360" max="360" step="1" onChange={() => this.handleOnChangeCameraAngle(event)}/> */}
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
)(DirectionalLighting);
 