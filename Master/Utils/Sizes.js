import { EventEmitter } from "events";

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.frustrum = 5;
        this.device = "mobile"

        window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            if (this.innerWidth <= "890") {
                this.device = "mobile"
            } else {
                this.device = "computer"
            }
            this.height = window.innerHeight;
            this.aspect = this.width / this.height;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.emit("resize");
        })
    }
}