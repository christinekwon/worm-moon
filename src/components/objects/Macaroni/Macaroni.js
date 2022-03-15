import { Group, MeshPhongMaterial } from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Macaroni.obj';
import * as THREE from "three";

class Macaroni extends Group {
    constructor(parent, x, y, z, rotZ) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            bob: false,
            spin: this.spin.bind(this),
            twirl: 1,
            falling: 0,
            twirlSpeed: 0.0
        };

        let tenMins = 400000;
        // 0.005 -> 0.05
        // 300 -> 30
        this.factor0 = 0.005;
        this.factor0Interval =  (0.05 - 0.005) / tenMins;
        this.factor1 = 300;
        this.factor1Interval = (10 - 300) / tenMins;

        // Load object
        const loader = new OBJLoader();

        this.name = 'Macaroni';

        var material = new MeshPhongMaterial({
			color: 0xfc9803,
			specular: 0xffffff,
			shininess: 1
		});

        var mesh0;
        loader.load(MODEL, obj => {
            // obj.position.set(x, 10, z);
			// obj.position.set(0, -1.5, 0);
			// obj.rotation.set(Math.PI / 2, Math.sin(Math.PI / 4), 0);
			// obj.scale.multiplyScalar(0.1);

            obj.children[0].material = material;
            obj.matrixAutoUpdate = false;
            obj.updateMatrix();
            // this.add(obj);
            mesh0 = new THREE.Mesh(obj.children[0].geometry);
            mesh0.scale.multiplyScalar(0.07);
            mesh0.rotation.set(Math.PI / 2,0, rotZ);
            mesh0.material = material;

            var pivot = new THREE.Group();
            pivot.position.set(0,0,0);
            mesh0.position.set(x, 10, z)

            this.add(pivot);
            this.add(mesh0);

            this.pivot = pivot;

            this.mesh = mesh0;
            this.pivot.add(this.mesh);
        });

        
        

        this.drop = this.drop.bind(this);


        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.visible = false;

        // this.spin();
        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }


    drop() {
        this.state.falling = 1;
        this.visible = true;
        setTimeout(() => {
            this.state.bob = true;
        }, 1000);

        // end at 0.1
        setInterval(() => {
			// console.log(this.sphere.position);
				this.state.twirlSpeed += 0.01;
		}, 60000);

        // pouring out water
        setTimeout(() => {
            this.visible = false;
        }, 600000);

        //putting back in
        setTimeout(() => {
            this.visible = true;
        }, 605000);
    }

    spin() {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(timeStamp) {
        if (this.state.falling) {
            console.log(this.position);
            console.log('falling');
            if (this.position.y < -7) {
                console.log('done falling');
                this.state.falling = 0;
            }
            this.position.y -= 0.1;
        }
        if (this.state.bob) {
            // Bob back and forth
            // 0.005 -> 0.05
            // 300 -> 30
            // console.log(this.factor0);
            // console.log(this.factor1);
            this.factor0 += this.factor0Interval;
            this.factor1 += this.factor1Interval;
            // this.rotation.y = this.factor0 * Math.sin(timeStamp / this.factor1);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            // this.state.twirl += Math.PI / this.state.twirlSpeed;
            this.rotation.y += this.state.twirlSpeed;
            // this.rotation.y += Math.PI / 8;
            // this.state.twirlSpeed += 1;
            // console.log(this.state.twirlSpeed);
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Macaroni;
