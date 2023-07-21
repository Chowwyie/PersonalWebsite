import Master from "./Master";
import * as THREE from 'three'
import Positions from "./World/Positions";
import gsap from 'gsap';

export default class Animation {
    constructor() {
        this.master = new Master();
        this.camera = this.master.camera.perspectiveCamera
        this.master.world.on("ready", () => {
            this.animations = this.master.world.room.animations
            this.setNavBar()
        });
        this.timeline = gsap.timeline()
        this.navigating = false
        this.checkpointName = "Desktop_Screen"
        this.dummyCamera = new THREE.PerspectiveCamera();
        this.sizes = this.master.sizes
        
        this.setPowerButton()

        // window.addEventListener('mousedown', async () => {
        //     // await this.navigate('Monitor_Screen')
        //     // await this.sleep(100)
        //     // await this.navigateToOrigin()
        //     // await this.sleep(100)
        //     await this.navigate('Desktop_Screen')
        //     // this.transitionToIntroWebpage();
        // })
    }   

    async navigateToOrigin(duration) {
        this.animations.chair.reset().play()
        let startOrientation;
        let targetOrientation;

        const camera = this.camera
        const cameraDirection = new THREE.Vector3();
        camera.getWorldPosition(cameraDirection)

       document.getElementById("room-title").className = "" 
       await this.timeline.to(camera.position, {
            x: Positions.Origin.position.x,
            y: Positions.Origin.position.y,
            z: Positions.Origin.position.z,
            duration: duration,
            onUpdate: function() {
                startOrientation = camera.quaternion.clone();
                camera.lookAt(Positions.Origin.look_at.x, Positions.Origin.look_at.y, Positions.Origin.look_at.z)
                targetOrientation = camera.quaternion.clone();
                camera.quaternion.copy(startOrientation)
                camera.quaternion.copy(startOrientation).slerp(targetOrientation,  100 ** (this.progress()-1))
            },
        } )
        document.getElementById("room-title").className = "popIn"
        this.checkpointName = "origin"
    }

    async navigate(checkpointName, distance) {
        const normal = new THREE.Vector3(Positions[checkpointName].normal.x, Positions[checkpointName].normal.y, Positions[checkpointName].normal.z);
        const center = new THREE.Vector3(Positions[checkpointName].center.x, Positions[checkpointName].center.y, Positions[checkpointName].center.z);
        const finalCameraPosition = this.calculateCameraPosition(center,normal, distance)
        // // calculate start and target quaternion
        // const startOrientation = this.camera.quaternion.clone();
        // this.camera.lookAt(center.x, center.y, center.z)
        // const targetOrientation = this.camera.quaternion.clone();
        // this.camera.quaternion.copy(startOrientation)

        // resolves function namespace issue
        const camera = this.camera
        const dummyCamera = this.dummyCamera
        await this.timeline.to(camera.position, {
            x: finalCameraPosition.x,
            y: finalCameraPosition.y,
            z: finalCameraPosition.z,
            duration: 2,
            onUpdate: function() {
                // const startOrientation = camera.quaternion.clone();
                // camera.lookAt(center.x, center.y, center.z)
                // const targetOrientation = camera.quaternion.clone();
                // camera.quaternion.copy(startOrientation)
                // camera.quaternion.copy(startOrientation).slerp(targetOrientation, 100 ** (this.progress()-1));
                dummyCamera.position.copy(camera.position)
                dummyCamera.lookAt(center.x, center.y, center.z)
                camera.quaternion.slerp(dummyCamera.quaternion, 150 ** (this.progress()-1));
            },
        } )
        this.checkpointName = checkpointName
    }

    calculateCameraPosition(center, unitNormal, scalar) {
        unitNormal.multiplyScalar(scalar);
        const cameraPosition = new THREE.Vector3().addVectors(unitNormal, center);
        return cameraPosition
    }

    convertWorldToScreenCoordinates(vectorCoords) {
        const vector = new THREE.Vector3(vectorCoords.x, vectorCoords.y, vectorCoords.z)
        var widthHalf = window.innerWidth / 2, heightHalf = window.innerHeight / 2;
        vector.project(this.camera);
        return [(vector.x+1)*widthHalf, (-vector.y+1)*heightHalf]
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setNavBar() {
        const homeButton = document.getElementById("Home-Nav");
        const aboutMeButton = document.getElementById("About-Me-Nav");
        const experienceButton = document.getElementById("Experience-Nav");
        const projectsButton = document.getElementById("Projects-Nav");
        const resumeButton = document.getElementById("Resume-Nav");
        const referencesButton = document.getElementById("References-Nav");
        homeButton.addEventListener("click", async () => {
            if (this.navigating || this.checkpointName === "origin") {
                return
            }
            this.setSelectButton(homeButton)
            this.disableNavBar()
            await this.turnOffAllPages(); 
            await this.navigateToOrigin(3)
            this.enableNavBar()
        })
        aboutMeButton.addEventListener("click", async () => {
            if (this.navigating || this.checkpointName === "Desktop_Screen") return
            this.setSelectButton(aboutMeButton)
            this.disableNavBar()
            await this.turnOffAllPages(); 
            await this.navigate("Desktop_Screen", Positions.Scale.Desktop_Screen[this.sizes.device]); 
            this.desktopTransitionOn();
            this.enableNavBar()
        })
        experienceButton.addEventListener("click", async () => {
            if (this.navigating || this.checkpointName === "Monitor_Screen") return
            this.setSelectButton(experienceButton)
            this.disableNavBar()
            await this.turnOffAllPages(); 
            await this.navigate("Monitor_Screen", Positions.Scale.Monitor_Screen[this.sizes.device]); 
            this.monitorTransitionOn();
            this.enableNavBar()
        })
        projectsButton.addEventListener("click", async () => {
            if (this.navigating || this.checkpointName === "Display_Page") return
            this.setSelectButton(projectsButton)
            this.disableNavBar()
            await this.turnOffAllPages(); 
            // this.animations.pages.forEach(page => {page.play()})
            await this.navigate("Display_Page", Positions.Scale.Display_Page[this.sizes.device])
            this.displayPageTransitionOn();
            this.enableNavBar()
        })
        resumeButton.addEventListener("click", async () => {
            if (this.navigating || this.checkpointName === "Resume") return
            this.setSelectButton(resumeButton)
            this.disableNavBar()
            await this.turnOffAllPages(); 
            await this.navigate("Resume", Positions.Scale.Resume[this.sizes.device]);
            document.getElementById("resume").className = "fadeIn"
            this.animations.pokeballShell.reset().play()
            this.animations.pokeballInterior.reset().play()
            await this.sleep(1600)
            this.animations.pokeballShell.paused = true
            this.animations.pokeballInterior.paused = true
            this.enableNavBar()
        })
        referencesButton.addEventListener("click", async () => {
            if (this.navigating || this.checkpointName === "References") return
            this.setSelectButton(referencesButton)
            this.disableNavBar()
            await this.turnOffAllPages(); 
            await this.navigate("References", Positions.Scale.References[this.sizes.device]);
            this.enableNavBar()
        })
        
            // this.animations.chair.reset().play()
            // this.animations.pokeballShell.reset().play()
            // this.animations.pokeballInterior.reset().play()
        // referencesButton.addEventListener("click", () => {this.navigate("Resume", 2.8)})
    }

    monitorTransitionOn() {
        const monitorWebpage = document.getElementById('monitor-screen')
        monitorWebpage.scrollTop = 0;
        this.monitorResize();
        // monitorWebpage.className = 'black';
        // await this.sleep(200)
        // monitorWebpage.className = 'appear';
        // await this.sleep(100)
        // monitorWebpage.className = 'black';
        // await this.sleep(200)
        monitorWebpage.className = 'appear';
    }

    monitorResize() {
        const monitorWebpage = document.getElementById('monitor-screen')
        const topLeftScreenCoords =  this.convertWorldToScreenCoordinates(Positions.Monitor_Screen.top_left)
        const topRightScreenCoords =  this.convertWorldToScreenCoordinates(Positions.Monitor_Screen.top_right)
        const bottomLeftScreenCoords =  this.convertWorldToScreenCoordinates(Positions.Monitor_Screen.bottom_left)
        monitorWebpage.style.top = Math.max(topLeftScreenCoords[1],0) + "px"
        monitorWebpage.style.left = Math.max(topLeftScreenCoords[0],0) + "px"
        monitorWebpage.style.width = Math.min(topRightScreenCoords[0] - topLeftScreenCoords[0], window.innerWidth) + "px"
        monitorWebpage.style.height = Math.min(bottomLeftScreenCoords[1] - topLeftScreenCoords[1], window.innerHeight) + "px"
        monitorWebpage.style.fontSize = (bottomLeftScreenCoords[1] - topLeftScreenCoords[1])/50 + "px"
    }

    monitorTransitionOff() {
        const monitorWebpage = document.getElementById('monitor-screen')
        monitorWebpage.className = 'disappear';
    }

    desktopTransitionOn() {
        document.getElementById('desktop-screen').scrollTop = 0;
        const intro = document.getElementById("intro-webpage");
        const canvas = document.getElementById("three");
        intro.className = "appear"
        canvas.className = "disappear"
        const screen = [];
        screen.push(document.getElementById('top-black'));
        screen.push(document.getElementById('bottom-black'));
        screen.forEach(element => {element.className = "on"})
    }

    async desktopTransitionOff(waitTime) {
        const screen = [];
        screen.push(document.getElementById('top-black'));
        screen.push(document.getElementById('bottom-black'));
        screen.forEach(element => {element.className = "off"})
        await this.sleep(waitTime);
        const intro = document.getElementById("intro-webpage");
        const canvas = document.getElementById("three");
        intro.className = "disappear"
        canvas.className = "appear"
    }

    setPowerButton() {
        const power = document.getElementById("power-button");
        power.addEventListener("click", async () => {
            this.turnOffAllPages();
            await this.desktopTransitionOff(1000)
            await this.navigateToOrigin(3);
            document.getElementById("navbar").className = "fadeIn"
            this.setSelectButton(document.getElementById("Home-Nav"))
            this.enableNavBar()
        });        
    }

    async displayPageTransitionOn() {
        const projectWebpage = document.getElementById('display-page')
        projectWebpage.scrollTop = 0;
        this.displayPageResize();
        // monitorWebpage.className = 'black';
        // await this.sleep(200)
        // monitorWebpage.className = 'appear';
        // await this.sleep(100)
        // monitorWebpage.className = 'black';
        // await this.sleep(200)
        projectWebpage.className = 'appear';
        await this.sleep(1500)
    }

    displayPageResize() {
        const projectWebpage = document.getElementById('display-page')
        const topLeftScreenCoords =  this.convertWorldToScreenCoordinates(Positions.Display_Page.top_left)
        const topRightScreenCoords =  this.convertWorldToScreenCoordinates(Positions.Display_Page.top_right)
        const bottomLeftScreenCoords =  this.convertWorldToScreenCoordinates(Positions.Display_Page.bottom_left)
        projectWebpage.style.top = Math.max(topLeftScreenCoords[1],0) + "px"
        projectWebpage.style.left = Math.max(topLeftScreenCoords[0],0) + "px"
        projectWebpage.style.width = Math.min(topRightScreenCoords[0] - topLeftScreenCoords[0], window.innerWidth) + "px"
        projectWebpage.style.height = Math.min(bottomLeftScreenCoords[1] - topLeftScreenCoords[1], window.innerHeight) + "px"
        projectWebpage.style.fontSize = (bottomLeftScreenCoords[1] - topLeftScreenCoords[1])/50 + "px"
    }

    async displayPageTransitionOff() {
        const displayPage = document.getElementById('display-page');
        // displayPage.className = "fadeOut"
        // await this.sleep(1500)
        displayPage.className = "disappear"
    }

    async turnOffAllPages() {
        if (this.checkpointName === "Desktop_Screen") {
            await this.desktopTransitionOff(500);
        } else if (this.checkpointName === "Display_Page"){
            await this.displayPageTransitionOff();
        } else if (this.checkpointName === "Resume") {
            this.animations.pokeballShell.paused = false
            this.animations.pokeballInterior.paused = false
            await this.sleep(1200)
            document.getElementById("resume").className = "fadeOut"
        } else if (this.checkpointName === "Monitor_Screen") {
            this.monitorTransitionOff();
        }
        const appearList = document.querySelectorAll(".appear")
        appearList.forEach(element => {element.classList.remove("appear")})
    }

    disableNavBar() {
        const buttonList = document.querySelectorAll("#navbar > ul > li > button")
        buttonList.forEach(button => {button.setAttribute('disabled', '');})
    }

    enableNavBar() {
        const buttonList = document.querySelectorAll("#navbar > ul > li > button")
        buttonList.forEach(button => {
            if (!button.classList.contains('selected')) {
                button.removeAttribute('disabled');
            }
        })
    }

    setSelectButton(button) {
        const selectedButton = document.querySelector("#navbar > ul > li > button.selected")
        if (selectedButton) {
            selectedButton.classList.remove('selected')
        }
        button.setAttribute('disabled', '')
        button.classList.add('selected')
    }

    resize() {
        if (this.checkpointName === "Display_Page") {
            this.displayPageResize()
        } else if (this.checkpointName === "Monitor_Screen") {
            this.monitorResize()
        }
    }
}
