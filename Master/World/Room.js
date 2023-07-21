import { Animation } from "gsap/gsap-core";
import Master from "../Master";
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


export default class Room {
    constructor() {
        this.master = new Master();
        this.scene = this.master.scene
        this.resources = this.master.resources
        this.time = this.master.time
        this.room = this.resources.items.room;
        this.roomScene = this.room.scene;

        
        this.setModel();
        this.setAnimation();
        

    }

    createVector(worldPosition) {
        const points = [];
        points.push(new THREE.Vector3(0,0,0));
        points.push(new THREE.Vector3(worldPosition.x, worldPosition.y,worldPosition.z));
        // Transform the vector to world coordinates
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
        // Create a material for the vector visualization
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Example color (red)
        // Create a line or arrow object to represent the vector
        const vectorLine = new THREE.Line(lineGeometry, material); // Use Line for a simple line representation
        // Alternatively, use ArrowHelper for an arrow-shaped representation
        // const vectorArrow = new THREE.ArrowHelper(vector, new THREE.Vector3(0, 0, 0), vector.length(), 0xff0000);

        // Add the vector object to the scene
        this.roomScene.add(vectorLine);
    }

    createTwoPointVector(worldPosition1, worldPosition2) {
        const points = [];
        points.push(new THREE.Vector3(worldPosition1.x, worldPosition1.y,worldPosition1.z));
        points.push(new THREE.Vector3(worldPosition2.x, worldPosition2.y,worldPosition2.z));
        // Transform the vector to world coordinates
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
        // Create a material for the vector visualization
        const material = new THREE.LineBasicMaterial({ color: 0x0059ff }); // Example color (red)
        // Create a line or arrow object to represent the vector
        const vectorLine = new THREE.Line(lineGeometry, material); // Use Line for a simple line representation
        // Alternatively, use ArrowHelper for an arrow-shaped representation
        // const vectorArrow = new THREE.ArrowHelper(vector, new THREE.Vector3(0, 0, 0), vector.length(), 0xff0000);

        // Add the vector object to the scene
        this.roomScene.add(vectorLine);
    }

    vectorInfo(Mesh) {
        console.log(Mesh)
        var center = new THREE.Vector3();
        Mesh.getWorldPosition(center);
        this.createVector(center);
    
        const bufferGeometry = Mesh.geometry;
        // Calculate the normal vector
        bufferGeometry.computeVertexNormals();
        const positions = bufferGeometry.attributes.position.array
        console.log("positions", positions)
        const v1= new THREE.Vector3(positions[0], positions[1], positions[2])
        const wv1 = v1.clone().applyMatrix4(Mesh.matrixWorld);
        const v2= new THREE.Vector3(positions[3], positions[4], positions[5])
        const wv2 = v2.clone().applyMatrix4(Mesh.matrixWorld);
        const v3= new THREE.Vector3(positions[6], positions[7], positions[8])
        const wv3 = v3.clone().applyMatrix4(Mesh.matrixWorld);
        const v4= new THREE.Vector3(positions[9], positions[10], positions[11])
        const wv4 = v4.clone().applyMatrix4(Mesh.matrixWorld);
        this.createVector(wv1)
        this.createVector(wv2)
        this.createVector(wv3)
        this.createVector(wv4)
        console.log("verticies", wv1, wv2, wv3, wv4)

        const pointA = center;
        const pointB = wv2;
        const pointC = wv4;

        const vectorAB = new THREE.Vector3().subVectors(pointB, pointA);
        const vectorAC = new THREE.Vector3().subVectors(pointC, pointA);

        const normal = new THREE.Vector3().crossVectors(vectorAB, vectorAC)
        const normalScreen = new THREE.Vector3().addVectors(normal, center);
        normal.normalize()
        console.log("n",normal)
        this.createVector(normal)
        console.log("c", center)
        console.log("nc", normalScreen)
        this.createTwoPointVector(center,normalScreen)
        
    }

    renderCartoonMesh(Mesh) {
        // let material = new THREE.MeshToonMaterial()
        let material = new THREE.MeshLambertMaterial()
        material.gradientMap = THREE.three
        let color = Mesh.material.color;
        
        Mesh.material = material
        Mesh.material.color = color
        Mesh.castShadow = true
        Mesh.receiveShadow = true
        if (Mesh.name === "References") {
            this.vectorInfo(Mesh)
        }
    }


    setModel() {
        this.scene.add(this.roomScene);
        // this.roomScene.scale.set(0.1, 0.1, 0.1)
        // this.roomScene.rotation.y = Math.PI
        for (const index in this.roomScene.children) {

            if (this.roomScene.children[index].isMesh === true) {
                
                // this.renderCartoonMesh(this.roomScene.children[index])
                this.roomScene.children[index].castShadow = true;
                this.roomScene.children[index].receiveShadow = true;
            } else {
                this.roomScene.children[index].children.forEach((groupchild) => {
                    // this.renderCartoonMesh(groupchild)
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }
        }
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.roomScene);
        this.animations = {}
        this.animations.pokeballShell= this.mixer.clipAction(this.room.animations[32]);
        this.animations.pokeballInterior = this.mixer.clipAction(this.room.animations[34]);
        this.animations.chair = this.mixer.clipAction(this.room.animations[57]);
        // this.animations.pages.push(this.mixer.clipAction(this.room.animations[38]))
        // this.animations.pages.push(this.mixer.clipAction(this.room.animations[39]))
        // this.animations.pages.push(this.mixer.clipAction(this.room.animations[40]))
        // this.animations.pages.push(this.mixer.clipAction(this.room.animations[41]))
        for (let action in this.animations) {
            // if(Array.isArray(this.animations[action])) {
            //     this.animations[action].forEach(page => {
            //         page.loop = THREE.LoopOnce; // Set the loop mode to play once
            //         page.clampWhenFinished = true; 
            //     })
            this.animations[action].setLoop(THREE.LoopOnce);
            this.animations[action].clampWhenFinished = true; 
        
        }
    }

    resize() {}

    update() {  
        this.mixer.update(this.time.delta * 0.001)
    }
}