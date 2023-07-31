import * as THREE from 'three'
import { EventEmitter } from "events";
import Master from "../Master";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

export default class Resources extends EventEmitter {
    constructor(assets) {
        super();
        this.master = new Master();
        this.renderer = this.master.renderer;

        this.assets = assets;
        
        this.items = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    }

    startLoading(){
        for(const asset of this.assets) {
            if(asset.type === "glbModel") {
                this.loaders.gltfLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset.name, file);
                }, function (xhr) {
                    // inside the onProgress callback (Optional)
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },)
            } 
            if (asset.type == "png") {
                this.loaders.textureLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset.name, file);
                }); 
            }
        }
    }

    singleAssetLoaded(assetName, file) {
        this.items[assetName] = file;
        this.loaded++;

        if (this.loaded === this.queue) {
            this.emit("ready")
        }
    }
}