import * as THREE from "three";
import Master from "../Master.js";

export default class Floor {
    constructor() {
        this.master = new Master();
        this.scene = this.master.scene;

        this.setFloor();
    }

    setFloor() {
        this.geometry = new THREE.PlaneGeometry(100, 100);
        this.material = new THREE.MeshStandardMaterial({
            color: 0xFFFEC8,
            side: THREE.BackSide,
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
        this.plane.position.z = 10
    }


    resize() {}

    update() {}
}