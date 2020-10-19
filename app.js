import * as THREE from './libs/three/three.module.js';
import { VRButton } from './libs/three/jsm/VRButton.js';
import { XRControllerModelFactory } from './libs/three/jsm/XRControllerModelFactory.js';
import { BoxLineGeometry } from './libs/three/jsm/BoxLineGeometry.js';
import { Stats } from './libs/stats.module.js';
import { OrbitControls } from './libs/three/jsm/OrbitControls.js';


class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        // this.clock = new THREE.Clock();

        // create camera
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 0, 15 );
        
        // create scene
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );
		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        // create light
        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
            
        // create renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        // create user controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        // create stats
        this.stats = new Stats();
        container.appendChild( this.stats.dom );
        
        // setup scene and XR
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }
    
    initScene(){
        // Constants
        this.radius = 0.08

        // create a room
        this.room = new THREE.LineSegments(
            new BoxLineGeometry(6,6,6,5,5,5),
            new THREE.LineBasicMaterial({ color: 0xaaaaaa })
        )
        this.room.geometry.translate(0,3,0)
        this.scene.add(this.room)

        // create geometry
        const geo = new THREE.IcosahedronBufferGeometry(this.radius, 2)
        
        this.balls_array = []

        let ctrx2 = 0
        let ctry2 = 1
        let ctrz2 = 2

        //make 200 balls of geo in a for loop.
        for(let i=0;i<200;i++) {
            let temp = []
            const mat = new THREE.MeshStandardMaterial({ color: Math.random()*0xffffff })
            const ball = new THREE.Mesh(geo, mat)
            ball.position.x = this.random(-3,3)
            ball.position.y = this.random(0,6)
            ball.position.z = this.random(-3,3)
            temp.push(ball)
            temp.push((ctrx2%2)==0 ? 0 : 1)
            temp.push((ctry2%2)==0 ? 0 : 1)
            temp.push((ctrz2%2)==0 ? 0 : 1)
            ctrx2++
            ctry2++
            ctrz2++
            this.balls_array.push(temp)
            this.scene.add(ball)
        }
    }
    
    setupXR(){
        this.renderer.xr.enabled = true
        document.body.appendChild(VRButton.createButton(this.renderer))
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.stats.update();
        const speed_pos = 0.03
        const speed_neg = -0.03
        for(let i=0;i<200;i++) {
            if(this.balls_array[i][0].position.x >= 3) {
                this.balls_array[i][1]++;
                this.balls_array[i][0].translateX(speed_neg)
            }
            else if(this.balls_array[i][0].position.x <= -3) {
                this.balls_array[i][1]++;
                this.balls_array[i][0].translateX(speed_pos)
            }
            else {
                if(this.balls_array[i][1]%2==0) {
                    this.balls_array[i][0].translateX(speed_pos)
                }
                else {
                    this.balls_array[i][0].translateX(speed_neg)
                }
            }
            if(this.balls_array[i][0].position.y >= 6) {
                this.balls_array[i][2]++;
                this.balls_array[i][0].translateY(speed_neg)
            }
            else if(this.balls_array[i][0].position.y <= 0) {
                this.balls_array[i][2]++;
                this.balls_array[i][0].translateY(speed_pos)
            }
            else {
                if(this.balls_array[i][2]%2==0) {
                    this.balls_array[i][0].translateY(speed_pos)
                }
                else {
                    this.balls_array[i][0].translateY(speed_neg)
                }
            }
            if(this.balls_array[i][0].position.z >= 3) {
                this.balls_array[i][3]++;
                this.balls_array[i][0].translateZ(speed_neg)
            }
            else if(this.balls_array[i][0].position.z <= -3) {
                this.balls_array[i][3]++;
                this.balls_array[i][0].translateZ(speed_pos)
            }
            else {
                if(this.balls_array[i][3]%2==0) {
                    this.balls_array[i][0].translateZ(speed_pos)
                }
                else {
                    this.balls_array[i][0].translateZ(speed_neg)
                }
            }
        }
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };