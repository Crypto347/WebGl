export const vert = `
   attribute vec4 a_position;
   attribute vec3 a_normal;

   uniform mat4 u_worldViewProjection;
   uniform mat4 u_worldInverseTranspose;

   varying vec3 v_normal;

   void main() {
      // Multiply the position by the matrix.
      gl_Position = u_worldViewProjection * a_position;

      // orient the normals and pass to the fragment shader
      v_normal = mat3(u_worldInverseTranspose) * a_normal;
      // v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
   }
`;

export const frag = `
   precision mediump float;

   varying vec3 v_normal;

   uniform vec3 u_reverseLightDirection;
   uniform vec4 u_color;

   void main() {

      // because v_normal is a varying it's interpolated
      // so it will not be a unit vector. Normalizing it
      // will make it a unit vector again

      vec3 normal = normalize(v_normal);
      float light = dot(normal, u_reverseLightDirection);

      gl_FragColor = u_color;

      gl_FragColor.rgb *= light;
   }
`;
