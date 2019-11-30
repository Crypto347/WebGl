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

import './ex.scss';

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

export class Ex extends Component {

    
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
                // color: this.gl.getAttribLocation(shaderProgram, "a_color")
                texture: this.gl.getAttribLocation(shaderProgram, "a_texCoord")
            },
            uniformLocations: {
                resolution: this.gl.getUniformLocation(shaderProgram, "u_resolution"),
                color: this.gl.getUniformLocation(shaderProgram, "u_color"),
                offset: this.gl.getUniformLocation(shaderProgram, "u_offset"),
                textureSizeLocation: this.gl.getUniformLocation(shaderProgram, "u_textureSize"),
                kernelLocation: this.gl.getUniformLocation(shaderProgram, "u_kernel[0]"),
                kernelWeightLocation: this.gl.getUniformLocation(shaderProgram, "u_kernelWeight")
            },
        };
        const image = new Image();
        image.src = logo;  // MUST BE SAME DOMAIN!!!

        const buffers = this.initBuffers(this.gl);
       
        
        image.onload = () => {
          this.drawScene(this.gl, programInfo, buffers, image);
        };
        // const texture = this.initTexture(this.gl, logo);

        
    }
    
    initBuffers = (gl) => {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // this.setRectangle(gl, 0, 0, image.width, image.height);
        const x1 = 0;
        const x2 = 0 + 400;
        const y1 = 0;
        const y2 = 0 + 400;
       
        // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
        // whatever buffer is bound to the `ARRAY_BUFFER` bind point
        // but so far we only have one buffer. If we had more than one
        // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
           x1, y1,
           x2, y1,
           x1, y2,
           x1, y2,
           x2, y1,
           x2, y2]), gl.STATIC_DRAW);

        // const colorBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // let r1 = Math.random();
        // let b1 = Math.random();
        // let g1 = Math.random();
       
        // let r2 = Math.random();
        // let b2 = Math.random();
        // let g2 = Math.random();
       
        // gl.bufferData(
        //     gl.ARRAY_BUFFER,
        //     new Uint8Array(
        //       [ Math.random()* 256, Math.random()* 256, Math.random()* 256, 255,
        //         Math.random()* 256, Math.random()* 256, Math.random()* 256, 255,
        //         Math.random()* 256, Math.random()* 256, Math.random()* 256, 255,
        //         Math.random()* 256, Math.random()* 256, Math.random()* 256, 255,
        //         Math.random()* 256, Math.random()* 256, Math.random()* 256, 255,
        //         Math.random()* 256, Math.random()* 256, Math.random()* 256, 255]),
        //     gl.STATIC_DRAW);

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0,
        ]), gl.STATIC_DRAW);


        return {
            position: positionBuffer,
            // color: colorBuffer,
            texture: texCoordBuffer
        };
    }

    drawScene = (gl, programInfo, buffers, image, deltaTime) => {

        const  kernels = {
            normal: [
              0, 0, 0,
              0, 1, 0,
              0, 0, 0
            ],
            gaussianBlur: [
              0.045, 0.122, 0.045,
              0.122, 0.332, 0.122,
              0.045, 0.122, 0.045
            ],
            gaussianBlur2: [
              1, 2, 1,
              2, 4, 2,
              1, 2, 1
            ],
            gaussianBlur3: [
              0, 1, 0,
              1, 1, 1,
              0, 1, 0
            ],
            unsharpen: [
              -1, -1, -1,
              -1,  9, -1,
              -1, -1, -1
            ],
            sharpness: [
               0,-1, 0,
              -1, 5,-1,
               0,-1, 0
            ],
            sharpen: [
               -1, -1, -1,
               -1, 16, -1,
               -1, -1, -1
            ],
            edgeDetect: [
               -0.125, -0.125, -0.125,
               -0.125,  1,     -0.125,
               -0.125, -0.125, -0.125
            ],
            edgeDetect2: [
               -1, -1, -1,
               -1,  8, -1,
               -1, -1, -1
            ],
            edgeDetect3: [
               -5, 0, 0,
                0, 0, 0,
                0, 0, 5
            ],
            edgeDetect4: [
               -1, -1, -1,
                0,  0,  0,
                1,  1,  1
            ],
            edgeDetect5: [
               -1, -1, -1,
                2,  2,  2,
               -1, -1, -1
            ],
            edgeDetect6: [
               -5, -5, -5,
               -5, 39, -5,
               -5, -5, -5
            ],
            sobelHorizontal: [
                1,  2,  1,
                0,  0,  0,
               -1, -2, -1
            ],
            sobelVertical: [
                1,  0, -1,
                2,  0, -2,
                1,  0, -1
            ],
            previtHorizontal: [
                1,  1,  1,
                0,  0,  0,
               -1, -1, -1
            ],
            previtVertical: [
                1,  0, -1,
                1,  0, -1,
                1,  0, -1
            ],
            boxBlur: [
                0.111, 0.111, 0.111,
                0.111, 0.111, 0.111,
                0.111, 0.111, 0.111
            ],
            triangleBlur: [
                0.0625, 0.125, 0.0625,
                0.125,  0.25,  0.125,
                0.0625, 0.125, 0.0625
            ],
            emboss: [
               -2, -1,  0,
               -1,  1,  1,
                0,  1,  2
            ]
          };

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
       
        /**
        * Clear the canvas before we start drawing on it.
        */
      
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programInfo.program);
        gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(programInfo.uniformLocations.offset, [0, 0, 0, 0]);
        gl.uniform2f(programInfo.uniformLocations.textureSizeLocation, image.width, image.height);
        gl.uniform1fv(programInfo.uniformLocations.kernelLocation, kernels.previtHorizontal);
        gl.uniform1f(programInfo.uniformLocations.kernelWeightLocation, this.computeKernelWeight(kernels.previtHorizontal));
            
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

        // {
        //     const numComponents = 4;
        //     const type = gl.UNSIGNED_BYTE;
        //     const normalize = true;
        //     const stride = 0;
        //     const offset = 0;
        //     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        //     gl.vertexAttribPointer(
        //         programInfo.attribLocations.color,
        //         numComponents,
        //         type,
        //         normalize,
        //         stride,
        //         offset);
        //     gl.enableVertexAttribArray(
        //         programInfo.attribLocations.color);
        // }

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture);
            gl.vertexAttribPointer(
                programInfo.attribLocations.texture,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.texture);
        }

        // shape.map((el,i) => {
            // this.setRectangle(gl, el.x, el.y, el.width, el.height)
            // gl.uniform4f(programInfo.uniformLocations.color, el.r, el.g, el.b, 1);
            {
                const vertexCount = 6;
                const type = gl.TRIANGLES;
                const offset = 0;
                gl.drawArrays(type, offset, vertexCount);
            }
        // })
       
    }

    computeKernelWeight = (kernel) => {
        var weight = kernel.reduce(function(prev, curr) {
            return prev + curr;
        });
        return weight <= 0 ? 1 : weight;
    }

    setTriangle = (gl, x1, x2, x3, y1, y2, y3) => {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
           x1, y1,
           x2, y2,
           x3, y3,
        ]), gl.STATIC_DRAW);
    }

    setRectangle = (gl, x, y, width, height) => {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
       
        // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
        // whatever buffer is bound to the `ARRAY_BUFFER` bind point
        // but so far we only have one buffer. If we had more than one
        // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
           x1, y1,
           x2, y1,
           x1, y2,
           x1, y2,
           x2, y1,
           x2, y2]), gl.STATIC_DRAW);
    }

    /**
    * Markup
    */

    render(){
        return(
            <div className="threeDSphere-input">
                <canvas width={window.innerWidth - 35} height={window.innerHeight} style={{border: "2px solid pink"}} ref="canvas" ></canvas>
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
)(Ex);
 