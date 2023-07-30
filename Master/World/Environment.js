import Master from "../Master";
import * as THREE from 'three';

export default class Environment {
    constructor() {
        this.master = new Master();
        this.scene = this.master.scene
        this.resources = this.master.resources
        
        this.setSunlight();
        

    }

    setSunlight() {
        this.sunLight = new THREE.DirectionalLight("#FFFFFF", 7);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 14
        this.sunLight.shadow.mapSize.set(400, 400);
        this.sunLight.shadow.camera.left = 6
        this.sunLight.shadow.camera.right = -10
        this.sunLight.shadow.camera.top = 14
        this.sunLight.shadow.camera.bottom = -10
        this.sunLight.shadow.normalBias = 0.1;
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);

        // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        // this.scene.add( light );

        // origin: x: 2.727238655090332, y: 12, z: -19
        this.sunLight.position.set(0.6, 3, -5);
        this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight("#FFFFFF", 4);
        // this.ambientLight.castShadow = true
        this.scene.add(this.ambientLight);
        
    }

    resize() {
    }

    update() {  
    }
}