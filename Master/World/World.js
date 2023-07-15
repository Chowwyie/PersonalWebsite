import Master from "../Master";
import Room from "./Room";
import Environment from "./Environment";
import Floor from "./Floor";
import * as THREE from 'three'
import { EventEmitter } from "events";

export default class World extends EventEmitter {
    constructor() {
        super();
        this.master = new Master();
        this.sizes = this.master.sizes;
        this.scene = this.master.scene;
        this.canvas = this.master.canvas;
        this.camera = this.master.camera;
        this.resources = this.master.resources;

        this.resources.on("ready", () => {
            this.environment = new Environment();
            this.room = new Room();
            this.floor = new Floor();
            this.emit("ready")
        })
        
    }

    resize() {
    }

    update() {  
        if (this.room) {
            this.room.update()
        }
    }
}