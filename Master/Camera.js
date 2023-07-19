import Master from "./Master";
import * as THREE from 'three'
import Positions from "./World/Positions";

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor() {
        this.master = new Master();
        this.sizes = this.master.sizes;
        this.scene = this.master.scene;
        this.canvas = this.master.canvas;

        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        // this.setOrbitControls();
    }

    createPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(35, this.sizes.aspect, 0.1, 1000);
        this.scene.add(this.perspectiveCamera)

        this.perspectiveCamera.position.set(Positions.Start.position.x, Positions.Start.position.y, Positions.Start.position.z)
        this.perspectiveCamera.lookAt(Positions.Start.look_at.x, Positions.Start.look_at.y, Positions.Start.look_at.z)
    }

    createOrthographicCamera() {

        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum) / 2,
            (this.sizes.aspect * this.sizes.frustrum) / 2,
            this.sizes.frustrum / 2,
            -this.sizes.frustrum / 2,
            -50,
            50
        );
        this.scene.add(this.orthographicCamera)

        const size = 10;
        const divisions = 10;

        // const gridHelper = new THREE.GridHelper(size, divisions);
        // this.scene.add(gridHelper)

        // const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(axesHelper)
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        this.controls.panSpeed = 2
        this.controls.zoomSpeed = 2
        this.controls.enableDamping = false;
        this.controls.enablePan = true;
        // this.controls.target = new THREE.Vector3(Positions.Origin.look_at.x, Positions.Origin.look_at.y, Positions.Origin.look_at.z);
        // this.controls.update();
    }

    resize() {
        // Updating Perspective Camera on Resize
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        // Updating Orthographic Camera on Resize
        // this.orthographicCamera.left =
        //     (-this.sizes.aspect * this.sizes.frustrum) / 2;
        // this.orthographicCamera.right =
        //     (this.sizes.aspect * this.sizes.frustrum) / 2;
        // this.orthographicCamera.top = this.sizes.frustrum / 2;
        // this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
        // this.orthographicCamera.updateProjectionMatrix();
    }

    update() {
        // console.log(this.perspectiveCamera.position)
        // this.controls.update();
    }
}