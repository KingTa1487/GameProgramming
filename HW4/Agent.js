//import {Steve} from "./Steve.js";

class Agent {
	constructor(pos, group, mesh2) {
		this.pos = pos.clone();
		this.vel = new THREE.Vector3();
		this.force = new THREE.Vector3();
		this.target = null;
		this.size = 3;
		this.model = group;
		scene.add (group);
    
		this.MAXSPEED = 80;
		this.ARRIVAL_R = 30;
    
		// for orientable agent
		this.angle = 0;
	}
  
	update(dt) {
    this.accumulateForce();
    this.vel.add(this.force.clone().multiplyScalar(dt));

		// ARRIVAL: velocity modulation
    if (this.target !== null) {   
		let dst = this.target.distanceTo(this.pos);
		if (dst < this.ARRIVAL_R) {  // close enough
			this.vel.setLength(dst);
		}
    }
    
   	// MAXSPEED modulation
	this.speed = this.vel.length();
	this.vel.setLength(clamp (this.speed, 0, this.MAXSPEED));
	this.pos.add(this.vel.clone().multiplyScalar(dt));
    this.model.position.copy(this.pos);
    
    // for orientable agent
    // non PD version
    if (this.vel.length() > 1) {
	   	this.angle = Math.atan2 (-this.vel.z, this.vel.x);
    	this.model.rotation.y = this.angle;
   	}
 }
  
	setTarget(x,y,z) {
		if (this.target !== null){
			this.target.set(x,y,z);
			
		}
		else {
			this.target = new THREE.Vector3(x,y,z);
		}
	}
  
	targetInducedForce(targetPos) { // seek
		return targetPos.clone().sub(this.pos).setLength(this.MAXSPEED).sub(this.vel);
	}

	accumulateForce() {
		if (this.target) 
			this.force.copy(this.targetInducedForce(this.target));
	}
}