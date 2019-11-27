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

import Button from '../../library/Button/button';

/**
* Styles
*/

import './threeDSphere.scss';

/**
* Selectors
*/

import * as Selectors from '../../reducers/selectors';

/**
* Actions
*/

import * as Actions from '../../actions';

/**
* Utility
*/

import * as Utility from '../../utility';

/**
* Shaders
*/

import * as Shaders from './Shaders';

/**
* threeDSphere component definition and export
*/

export class ThreeDSphere extends Component {

    
    /**
    * Methods
    */

    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas = () => {
        const canvas = this.refs.canvas;
        // const gl = useWebGLContext();
        this.gl = canvas.getContext("webgl");
        let then = 0;
        // this.squareRotation = 0.0;
        this.cubeRotation = 0.0;
        if (this.gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const shaderProgram = this.initShaderProgram(this.gl, Shaders.vert, Shaders.frag);
        
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
              vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
              vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
              projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
              modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };
          
        const buffers =  this.initBuffers(this.gl);
        // this.drawScene(this.gl, programInfo, buffers);
        // this.renderRectangle(this.gl, programInfo, buffers, then);
        // requestAnimationFrame(this.renderRectangle(gl, programInfo, buffers, then, now));

        const render = (now) => {
            now *= 0.001;  // convert to seconds
            const deltaTime = now - then;
            then = now;
            // console.log(deltaTime)
            this.drawScene(this.gl, programInfo, buffers, deltaTime);
        
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    // renderRectangle = ( now) => {
    //     now *= 0.001;  // convert to seconds
    //     const deltaTime = now - then;
    //     then = now;

    //     this.drawScene(gl, programInfo, buffers, deltaTime);
    //     console.log(deltaTime)
    //     requestAnimationFrame(this.renderRectangle);
        
    // }

    initShaderProgram = (gl, vsSource, fsSource) => {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
        // Create the shader program
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        
        // If creating the shader program failed, alert
        
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        
        return shaderProgram;
    }

    loadShader = (gl, type, source) => {
        const shader = gl.createShader(type);
        
        // Send the source to the shader object
        
        gl.shaderSource(shader, source);
        
        // Compile the shader program
        
        gl.compileShader(shader);
        
        // See if it compiled successfully
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
      
        return shader;
    }

    initBuffers = (gl) => {
        var colors = [];
        //cube

        const positions = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
            
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
            
            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
          ];

        //square

        // const positions = [
        // -1.0,  1.0,
        // 1.0,  1.0,
        // -1.0, -1.0,
        // 1.0, -1.0,
        // ];

        //triangle

        // const positions = [
        //     -0.5,  -0.5,
        //     0.5,  -0.5,
        //     0.0, 0.5,
        // ];

        //color of each surface

        const faceColors = [
            [1.0,  1.0,  1.0,  1.0],    // Front face: white
            [1.0,  0.0,  0.0,  1.0],    // Back face: red
            [0.0,  1.0,  0.0,  1.0],    // Top face: green
            [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
            [1.0,  0.0,  1.0,  1.0],    // Left face: purple
        ];

        faceColors.map((el, i) => {
            colors = colors.concat(el, el, el, el)
        })
        console.log(colors)

        //gradient color

        // const colors = [
        //     1.0,  1.0,  1.0, 1.0,    // white
        //     1.0,  0.0,  0.0, 1.0,   // red
        //     0.0,  1.0,  0.0, 1.0,   // green
        //     0.0,  0.0,  1.0, 1.0,   // blue
        // ];

        // Create a buffer for the square's positions.
        
        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        
        gl.bufferData(gl.ARRAY_BUFFER,
                        new Float32Array(positions),
                        gl.STATIC_DRAW);



        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 
                        new Float32Array(colors), 
                        gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                        new Uint16Array(indices), 
                        gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
    }

    drawScene = (gl, programInfo, buffers, deltaTime) => {
   
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
       
        // Clear the canvas before we start drawing on it.
      
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
      
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
      
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
                         fieldOfView,
                         aspect,
                         zNear,
                         zFar);
      
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();
      
        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        mat4.translate(modelViewMatrix,     // destination matrix
                       modelViewMatrix,     // matrix to translate
                       [-0.0, 0.0, -10.0]);  // amount to translate
        // square rotation

        // mat4.rotate(modelViewMatrix,  // destination matrix
        //             modelViewMatrix,  // matrix to rotate
        //             this.squareRotation,   // amount to rotate in radians
        //             [0, 0, 1]);       // axis to rotate around

        // cube rotation

        mat4.rotate(modelViewMatrix, 
                    modelViewMatrix, 
                    this.cubeRotation * .7, 
                    [1, 1, 1]);
      
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 3;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                        // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }
  
        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        // Tell WebGL to use our program when drawing
      
        gl.useProgram(programInfo.program);
      
        // Set the shader uniforms
      
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
      
        // {
        //     const offset = 0;
        //     const vertexCount = 4;
        //     gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        // }

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
          }

        // Update the rotation for the next draw

        // this.squareRotation += deltaTime;
        this.cubeRotation += deltaTime;
    }

    /**
    * Markup
    */

    render(){
        return(
            <div className="threeDSphere-input">
                {/* <Button
                    onClick={this.props.fillCirclesArray}
                    text={"Press"}
                    disabled={isNaN(this.props.numberOfBalls)}
                /> */}
                <canvas width={window.innerWidth - 35} height={window.innerHeight} style={{border: "2px solid pink"}} ref="canvas" ></canvas>
            </div> 
        );
    }
}

export default connect(
    (state) => {
        return {
            circles: Selectors.getCirclesState(state),
            numberOfBalls: Selectors.getNumberOfBallsState(state)
        };
    },
    (dispatch) => {
        return {
            moveCircleXCoordinate: bindActionCreators(Actions.moveCircleXCoordinate, dispatch),
            moveCircleYCoordinate: bindActionCreators(Actions.moveCircleYCoordinate, dispatch),
            changeDirectionOfXMove: bindActionCreators(Actions.changeDirectionOfXMove, dispatch),
            changeDirectionOfYMove: bindActionCreators(Actions.changeDirectionOfYMove, dispatch),
            updateCoordinates: bindActionCreators(Actions.updateCoordinates, dispatch),
            updateVelocities: bindActionCreators(Actions.updateVelocities, dispatch),
            fillCirclesArray: bindActionCreators(Actions.fillCirclesArray, dispatch),
            getNumbersOfBalls: bindActionCreators(Actions.getNumbersOfBalls, dispatch),
        };
    }
)(ThreeDSphere);
 