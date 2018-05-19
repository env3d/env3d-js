
var shader = {

    uniforms: {

	'color': {
	    type: 'c',
	    value: null
	},

	'reflectivity': {
	    type: 'f',
	    value: 0
	},

	'tReflectionMap': {
	    type: 't',
	    value: null
	},

	'tRefractionMap': {
	    type: 't',
	    value: null
	},

	'tNormalMap0': {
	    type: 't',
	    value: null
	},

	'tNormalMap1': {
	    type: 't',
	    value: null
	},

	'textureMatrix': {
	    type: 'm4',
	    value: null
	},

	'config': {
	    type: 'v4',
	    value: new THREE.Vector4()
	}

    },

    vertexShader: [

	'#include <fog_pars_vertex>',

	'uniform mat4 textureMatrix;',

	'varying vec4 vCoord;',
	'varying vec2 vUv;',
	'varying vec3 vToEye;',

	'void main() {',

	'	vUv = uv;',
	'	vCoord = textureMatrix * vec4( position, 1.0 );',

	'	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
	'	vToEye = cameraPosition - worldPosition.xyz;',

	'	vec4 mvPosition =  viewMatrix * worldPosition;', // used in fog_vertex
	'	gl_Position = projectionMatrix * mvPosition;',

	'	#include <fog_vertex>',

	'}'

    ].join( '\n' ),

    fragmentShader: [

	'#include <fog_pars_fragment>',

	'uniform sampler2D tReflectionMap;',
	'uniform sampler2D tRefractionMap;',
	'uniform sampler2D tNormalMap0;',
	'uniform sampler2D tNormalMap1;',

	'#ifdef USE_FLOWMAP',
	'	uniform sampler2D tFlowMap;',
	'#else',
	'	uniform vec2 flowDirection;',
	'#endif',

	'uniform vec3 color;',
	'uniform float reflectivity;',
	'uniform vec4 config;',

	'varying vec4 vCoord;',
	'varying vec2 vUv;',
	'varying vec3 vToEye;',

	'void main() {',

	'	float flowMapOffset0 = config.x;',
	'	float flowMapOffset1 = config.y;',
	'	float halfCycle = config.z;',
	'	float scale = config.w;',

	'	vec3 toEye = normalize( vToEye );',

	// determine flow direction
	'	vec2 flow;',
	'	#ifdef USE_FLOWMAP',
	'		flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;',
	'	#else',
	'		flow = flowDirection;',
	'	#endif',
	'	flow.x *= - 1.0;',

	// sample normal maps (distort uvs with flowdata)
	'	vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );',
	'	vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );',

	// linear interpolate to get the final normal color
	'	float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;',
	'	vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );',

	// calculate normal vector
	'	//vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );',

	// calculate the fresnel term to blend reflection and refraction maps
	'	//float theta = max( dot( toEye, normal ), 0.0 );',
	'	//float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );',

	// calculate final uv coords
	'	//vec3 coord = vCoord.xyz / vCoord.w;',
	'	//vec2 uv = coord.xy + coord.z * normal.xz * 0.05;',

	'	//vec4 reflectColor = texture2D( tReflectionMap, vec2( 1.0 - uv.x, uv.y ) );',
	'	//vec4 refractColor = texture2D( tRefractionMap, uv );',

	// multiply water color with the mix of both textures
	'	//gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );',
        '	gl_FragColor = vec4( color, 1.0 ) * normalColor;',
        
	'	#include <tonemapping_fragment>',
	'	#include <encodings_fragment>',
	'	#include <fog_fragment>',

	'}'

    ].join( '\n' )
};

export default class EnvWater {
    constructor(options) {
        
        options = options || {};
        
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.z = options.z || 0;
        this.rotateX = options.rotateX || 0;
        this.rotateY = options.rotateY || 0;
        this.rotateZ = options.rotateZ || 0;
        this.scale = options.scale || 1;
        
        this.mesh = new THREE.Water( new THREE.PlaneBufferGeometry( 1, 1 ), {
	    color: '#ffffff',
	    scale: 4,
	    flowDirection: new THREE.Vector2( 1, 1 ),
	    textureWidth: 1024,
	    textureHeight: 1024,
            shader: shader
	} );
        this.mesh.rotation.order = "YXZ";
    }

    update() {
        this.mesh.scale.x = this.scale;
        this.mesh.scale.y = this.scale;
        this.mesh.scale.z = this.scale;

        this.mesh.position.x = this.x; 
        this.mesh.position.y = this.y;
        this.mesh.position.z = this.z;

        this.mesh.rotation.x = this.rotateX * (Math.PI/180);
        this.mesh.rotation.y = this.rotateY * (Math.PI/180);
        this.mesh.rotation.z = this.rotateZ * (Math.PI/180);
    }
}

