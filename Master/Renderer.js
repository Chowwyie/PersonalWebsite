import Master from "./Master";
import * as THREE from 'three'

export default class Renderer {
    constructor() {
        this.master = new Master();
        this.sizes = this.master.sizes;
        this.scene = this.master.scene;
        this.canvas = this.master.canvas;
        this.camera = this.master.camera;

        this.setRenderer();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });

        this.renderer.useLegacyLights = true;
        // this.renderer.toneMapping = THREE.LinearToneMapping ;
        // this.renderer.toneMappingExposure = 0.1;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.11;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {  
        this.renderer.render(this.scene, this.camera.perspectiveCamera); 
    }
}