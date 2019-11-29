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
               color: this.gl.getAttribLocation(shaderProgram, "a_color")
            },
            uniformLocations: {
                resolution: this.gl.getUniformLocation(shaderProgram, "u_resolution"),
                color: this.gl.getUniformLocation(shaderProgram, "u_color")
            },
        };
          
        const buffers = this.initBuffers(this.gl);
        this.drawScene(this.gl, programInfo, buffers);
    }

    

    initBuffers = (gl) => {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
        const positions = [
            300, 300,
            550, 300,
            300, 400,
            300, 400,
            550, 300,
            550, 400,
        ];
        
        gl.bufferData(gl.ARRAY_BUFFER,
                        new Float32Array(positions),
                        gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        let r1 = Math.random();
        let b1 = Math.random();
        let g1 = Math.random();
       
        let r2 = Math.random();
        let b2 = Math.random();
        let g2 = Math.random();
       
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
              [ Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1]),
            gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            color: colorBuffer
        };
    }

    drawScene = (gl, programInfo, buffers, texture, deltaTime) => {
        // const shape = [
        //     {
        //         x: 300, 
        //         y: 300, 
        //         width: 250, 
        //         height: 100
        //     },
        //     {
        //         x: 300, 
        //         y: 300, 
        //         width: 250, 
        //         height: 100
        //     }
            // {
            //     x1: 300, 
            //     x2: 450, 
            //     x3: 250, 
            //     y1: 120,
            //     y2: 200,
            //     y3: 200,
            //     r: 0.6,
            //     g: 0.4,
            //     b: 0.7
            // }
        // ]
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
 