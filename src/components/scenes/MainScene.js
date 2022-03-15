import * as Dat from 'dat.gui';
import { Scene, Color, CubeTextureLoader, TextureLoader } from 'three';
import { Moon, Heart } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from "three";

import POSX from "./textures/Skybox/posx.jpg";
import NEGX from "./textures/Skybox/negx.jpg";
import POSY from "./textures/Skybox/posy.jpg";
import NEGY from "./textures/Skybox/negy.jpg";
import POSZ from "./textures/Skybox/posz.jpg";
import NEGZ from "./textures/Skybox/negz.jpg";
import CLOUDS from "./textures/Clouds/clouds.jpg";

class MainScene extends Scene {
    
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            color: 0,
            count: 1,
        };

        // lite pink 0xffd9f0
        // darker pink 0xffa6db
        // lav e3c4ff
        // purp c280ff
        // mint bffff9
        // dark mint 70fff2

        this.interval = 70;

        const colors = [
            [0, 4, 33],
            [41, 0, 11],
            [0, 26, 12],
            [26, 11, 0],

            
            // 0xffd9f0,
            // 0xffa6db,
            // 0xead4ff,
            // 0xc280ff,
            // 0xbffff9,
            // 0x70fff2,
            // ffdede ffcccc
        ]


        colors.forEach(color => {
            color[0] = color[0] / 255.0;
            color[1] = color[1] / 255.0;
            color[2] = color[2] / 255.0;
        })

        this.colors = colors;


        // Set background to a nice color
        this.background = new Color(0xffd9f0);

        var metalMap = new CubeTextureLoader()
        .load( [
            POSX, NEGX,
            POSY, NEGY,
            POSZ, NEGZ
        ] );

        this.moon = new Moon(this, metalMap);

        let bubPos = 4;
        let interBub = bubPos*Math.sin(Math.PI / 4);
        this.hearts = [
            //front right back left
            new Heart(this, metalMap, 0, 0, -bubPos, 0, 1),
            new Heart(this, metalMap, -interBub, 0, -interBub, Math.PI / 4, 1),
            new Heart(this, metalMap, -bubPos, 0, 0, Math.PI / 2, 1),
            new Heart(this, metalMap, -interBub, 0, interBub, 3 * Math.PI / 4, 1),
            new Heart(this, metalMap, 0, 0, bubPos, 0, 1),
            new Heart(this, metalMap, interBub, 0, interBub, Math.PI / 4, 1),
            new Heart(this, metalMap, bubPos, 0, 0, Math.PI / 2, 1),
            new Heart(this, metalMap, interBub, 0, -interBub, 3 * Math.PI / 4, 1),
        ]

        this.add(this.moon);
        for (let heart of this.hearts) {
            this.add(heart);
        }

        // this.getRandom = this.getRandom.bind(this);
        
        
        // setInterval(function () {
        //     const heart = new Heart(this, metalMap, 
        //         Math.random() * (5 - (-5)) + (-5), 
        //         Math.random() * (5 - (-5)) + (-5), 
        //         Math.random() * (5 - (-5)) + (-5), 
        //         Math.random() * (Math.PI - 0) + 0, 
        //         1);
        //     // const x = this.getRandom(-5, 5);
        //     this.add(heart);

        // }, 2000);
        
        // console.log(this.getRandom(-5, 5));
        const lights = new BasicLights();
        this.add(lights);
    }

    // begin() {
    //     setInterval(function () {
    //         // const x = this.getRandom(-5, 5);
    //         this.add(new Heart(this, metalMap, 
    //             Math.random() * (5 - (-5)) + (-5), 
    //             Math.random() * (5 - (-5)) + (-5), 
    //             Math.random() * (5 - (-5)) + (-5), 
    //             Math.random() * (Math.PI - 0) + 0, 
    //             1));

    //     }, 2000);
    // }



    // getRandom(min, max) {
    //     return Math.random() * (max - min) + min;
    // }


    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        if (this.state.count == this.colors.length * this.interval) {
            this.state.count = 0;
            this.state.color = 0;
        }
        else if (this.state.count % this.interval == 0) {
            this.state.color += 1;
            this.state.count += 1;
        }
        let distance = (this.state.count % this.interval)
        // change bg
        if (this.state.color < this.colors.length - 1) {
            let color = new Color(
                this.colors[this.state.color][0] + (this.state.count % this.interval) * ((this.colors[this.state.color + 1][0] - this.colors[this.state.color][0]) / this.interval),
                this.colors[this.state.color][1] + (this.state.count % this.interval) * ((this.colors[this.state.color + 1][1] - this.colors[this.state.color][1]) / this.interval),
                this.colors[this.state.color][2] + (this.state.count % this.interval) * ((this.colors[this.state.color + 1][2] - this.colors[this.state.color][2]) / this.interval)
            );
            this.background = color;
        }
        else {
            let color = new Color(
                this.colors[this.state.color][0] + (this.state.count % this.interval) * ((this.colors[0][0] - this.colors[this.state.color][0]) / this.interval),
                this.colors[this.state.color][1] + (this.state.count % this.interval) * ((this.colors[0][1] - this.colors[this.state.color][1]) / this.interval),
                this.colors[this.state.color][2] + (this.state.count % this.interval) * ((this.colors[0][2] - this.colors[this.state.color][2]) / this.interval)
            );
            this.background = color;
        }

        this.state.count++;
    }

    
}

export default MainScene;
