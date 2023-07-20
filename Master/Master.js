import * as THREE from 'three';

import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import assets from './Utils/Assets';

import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Animation from './Animation';

export default class Master {
    static instance;
    constructor(canvas) {
        if (Master.instance) {
            return Master.instance;
        }
        Master.instance = this;
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resources = new Resources(assets);

        //must be below other instantiations.
        this.world = new World();
        this.animation = new Animation();

        this.time.on("update", () => {
            this.update();
        })

        this.sizes.on("resize", () => {
            this.resize();
        })
    }

    update() {
        console.log(this.sizes.device)
        this.camera.update();
        this.renderer.update();
        this.world.update()
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
        this.world.resize();
        this.animation.resize();
    }
    
}