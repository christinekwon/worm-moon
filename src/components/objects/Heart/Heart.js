import { Group, Scene } from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import HEART from './heart.obj';
// import POSX from "../../scenes/textures/Skybox/posx.jpg";
// import NEGX from "../../scenes/textures/Skybox/negx.jpg";
// import POSY from "../../scenes/textures/Skybox/posy.jpg";
// import NEGY from "../../scenes/textures/Skybox/negy.jpg";
// import POSZ from "../../scenes/textures/Skybox/posz.jpg";
// import NEGZ from "../../scenes/textures/Skybox/negz.jpg";

class Heart extends Group {
  constructor(parent, metalMap, x, y, z, yRot, grow) {
    // Call parent Group() constructor
	super();

    // Init state
    this.state = {
		// gui: parent.state.gui,
		bob: false,
		spin: this.spin.bind(this),
		// twirl: 0,
		count: 0,
		// count: radius * 100,
		grow: grow,
		startGrowing: 0,
		rise: false,
		riseCount: 0
	};

	this.initTimestamp = 0;
	this.translationFactor = 2.0 / 300;
  
	let initY = 0;
	this.name = "HEART"; 

	let colors = [
		0xfaa4bd, //lite pink
		0xff99c8,  // pink
		0xda9f93, // muted pink
		0xfcab64, // orange
		0xede7b1, // yellow
		// 0xffbc0a, // cheese
		0x7dce82, // green
		// 0xc3f73a, // lime
		0x30f2f2, // blue
		0xa1fcdf, // aqua
		0x7699d4, // periwinkle
		0xbcb6ff, // purple
		0x8d86c9, // lavender
	];

	// color= 0xbcb6ff;
	let color = 0xff9cb8;

	const loader = new OBJLoader();

	var material = new THREE.MeshStandardMaterial( {
		color: color,
		// emissive: 0x444444,
		emissive: 0x555555,
		metalness: 1,   // between 0 and 1
		roughness: 0, // between 0 and 1
		envMap: metalMap,
		envMapIntensity: 2
	} );

	let mesh;

	loader.load(HEART, obj => {
		mesh = obj.children[0];
		obj.position.set(x, y, z);
		obj.rotation.set(0,yRot,0);
		obj.scale.multiplyScalar(1);
		obj.children[0].material = material;
		obj.matrixAutoUpdate = false;
		obj.updateMatrix();
		this.add(obj);
		this.sphere = mesh;

	});

    parent.addToUpdateList(this);

	setTimeout(() => {
		this.state.startGrowing = 1;
	}, 3000);
  }

  spin() {

	// 1.002 0.998 200
	}

	update(timeStamp) {
		if (this.state.startGrowing) {
			if (this.state.grow) {
				this.state.count++;
				this.sphere.scale.addScalar(0.01);
				if (this.state.count == 50) {
					this.state.grow = 0;
				}
			}
			else {
				this.state.count--;
				this.sphere.scale.addScalar(-0.01);
				if (this.state.count == 0) {
					this.state.grow = 1;
				}
			}
		}
	}
}

export default Heart;
