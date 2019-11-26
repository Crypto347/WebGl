export const vert = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

export const frag = `
    void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;