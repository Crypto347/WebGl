export const vert = `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;
  }
`;

export const frag = `
  precision mediump float;

  void main(void) {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }
`;
