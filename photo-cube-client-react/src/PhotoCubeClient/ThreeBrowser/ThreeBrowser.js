import React, { Component } from 'react';
import './ThreeBrowser.css';
/* Using tutorial to use ThreeJS with React: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
/* https://medium.com/@colesayershapiro/using-three-js-in-react-6cb71e87bdf4 */
const THREE = require('three');
const OrbitControl = require('three-orbitcontrols')

/*
 TODO: 
- Add own Threejs code
- Continue with tutorial: https://reactjs.org/tutorial/tutorial.html#completing-the-game
- 
*/

/*import './canvasThreejsCode.js';*/

class ThreeBrowser extends Component{
    componentDidMount(){
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
            )
        this.camera.position.z = 4
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        //ADD CUBE
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: '#433F81'     })
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)
        this.start()
    }
        
    componentWillUnmount(){
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }
        
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
        
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }
        
    animate = () => {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }
        
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    resizeBrowser = () => {
        var width = document.getElementById('ThreeBrowser').clientWidth;
        var height = document.getElementById('ThreeBrowser').clientHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            console.log('enter press here! ')
        }
    }
        
    render(){
        return(
            <div className="grid-item" id="ThreeBrowser">
                <div style={{ width: '400px', height: '400px' }}
                ref = {(mount) => { this.mount = mount }}/>
            </div>
        );
    }
}
        
    export default ThreeBrowser;