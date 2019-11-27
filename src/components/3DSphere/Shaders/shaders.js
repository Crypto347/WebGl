// export const vert = `
//     precision mediump float;
//     attribute vec4 aVertexPosition;
//     attribute vec4 aVertexColor;

//     varying vec3 vColor;

//     uniform mat4 uModelViewMatrix;
//     uniform mat4 uProjectionMatrix;


//     void main(void) {
//     vColor = aVertexColor;
//       gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
//     }
// `;

// export const frag = `
//     varying vec3 vColor;

//     void main(void) {
//         gl_FragColor = vec4(vColor, 1.0);
//     }
// `;

// ;


// export const vert = `
//     attribute vec4 aVertexPosition;
    

//     uniform mat4 uModelViewMatrix;
//     uniform mat4 uProjectionMatrix;

//     void main(void) {
//       gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
//     }
// `;

// export const frag = `

//     void main(void) {
//         gl_FragColor = vec4(1,0,0, 1.0);
//     }
// `;

export const vert = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
`;

export const frag = `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`;