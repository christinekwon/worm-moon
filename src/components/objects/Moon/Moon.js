import { Group, MeshPhongMaterial, CubeTextureLoader, MeshStandardMaterial } from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MOON from './moon.obj';
// import POSX from "../../scenes/textures/Forest/posx.jpg";
// import NEGX from "../../scenes/textures/Forest/negx.jpg";
// import POSY from "../../scenes/textures/Forest/posy.jpg";
// import NEGY from "../../scenes/textures/Forest/negy.jpg";
// import POSZ from "../../scenes/textures/Forest/posz.jpg";
// import NEGZ from "../../scenes/textures/Forest/negz.jpg";
// import CLOUDS from "../../scenes/textures/Clouds/clouds.jpg";


class Moon extends Group {
    constructor(parent, metalMap) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            bob: false,
            spin: this.spin.bind(this),
            twirl: 0,
        };

        // Load object
        const loader = new OBJLoader();

        this.name = 'Moon';

        var material = new MeshStandardMaterial( {
			color: 0xffffff,
            emissive: 0x666666,
			metalness: 1,
			roughness: 0,
			envMap: metalMap,
			envMapIntensity: 1
		} );

        loader.load(MOON, obj => {
            obj.position.set(0, 0, 0);
            obj.rotation.set(0,0,0);
			obj.scale.multiplyScalar(3.0);
            obj.children[0].material = material;
            obj.matrixAutoUpdate = false;
            obj.updateMatrix();
            this.add(obj);
        });


        // Add self to parent's update list
        parent.addToUpdateList(this);

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
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);

            // false jumpy
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 30);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Moon;
