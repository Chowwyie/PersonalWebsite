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
        this.sunLight.shadow.camera.far = 30
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.camera.left = 19
        this.sunLight.shadow.camera.right = -15
        this.sunLight.shadow.camera.top = 20
        this.sunLight.shadow.camera.bottom = -10
        this.sunLight.shadow.normalBias = 0.05;
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);

        // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        // this.scene.add( light );

        // origin: x: 2.727238655090332, y: 12, z: -19
        this.sunLight.position.set(1.527238655090332, 9, -15.9);
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