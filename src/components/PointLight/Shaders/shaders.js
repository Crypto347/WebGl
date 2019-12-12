export const vert = `
   attribute vec4 a_position;
   attribute vec3 a_normal;

   uniform vec3 u_lightWorldPosition;
   uniform mat4 u_world;
   uniform mat4 u_worldViewProjection;
   uniform mat4 u_worldInverseTranspose;

   varying vec3 v_normal;

   varying vec3 v_surfaceToLight;

   void main() {
      // Multiply the position by the matrix.
      gl_Position = u_worldViewProjection * a_position;

      // orient the normals and pass to the fragment shader
      v_normal = mat3(u_worldInverseTranspose) * a_normal;
      // v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;

      // compute the world position of the surface
      vec3 surfaceWorldPosition = (u_world * a_position).xyz;

      // compute the vector of the surface to the light
      // and pass it to the fragment shader
      v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
   }
`;

export const frag = `
   precision mediump float;

   varying vec3 v_normal;
   varying vec3 v_surfaceToLight;
   
   uniform vec4 u_color;

   void main() {

      // because v_normal is a varying it's interpolated
      // so it will not be a unit vector. Normalizing it
      // will make it a unit vector again

      vec3 normal = normalize(v_normal);
      vec3 surfaceToLightDirection = normalize(v_surfaceToLight);

      float light = dot(v_normal, surfaceToLightDirection);

      gl_FragColor = u_color;

      // Lets multiply just the color portion (not the alpha)
      // by the light
      gl_FragColor.rgb *= light;
   }
`;
