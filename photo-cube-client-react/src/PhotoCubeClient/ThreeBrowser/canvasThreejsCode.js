//Public variables:
var camera;
var renderer;

//Function to resize browser dynamically
function ResizeBrowser(){
    var width = document.getElementById('browser').clientWidth;
    var height = document.getElementById('browser').clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

$(document).ready(function(){
    //Colors used throughout the document:
    var red = 0xF00000;
    var green = 0x00F000;
    var blue = 0x0000F0;

    //Setup scene:
    var scene = new THREE.Scene();

    //Setup camera:
    var containerWidth = document.getElementById('browser').clientWidth;
    var containerHeight = document.getElementById('browser').clientHeight;
    //THREE.PerspectiveCamera(fov, aspect, near, far)
    camera = new THREE.PerspectiveCamera( 75, containerWidth / containerHeight, 0.01, 1000);
    camera.position.z = 5;
    camera.rotation.y = 90 * Math.PI;

    //Setup renderer:
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerWidth, containerHeight)

    //Add the render element to the DOM:
    document.getElementById('browser').appendChild( renderer.domElement );

    //Window resize listener:
    window.addEventListener( 'resize', function () {
        console.log("windows resized!");
        var width = document.getElementById('browser').clientWidth;
        var height = document.getElementById('browser').clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    //Set control to OrbitControls.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //Load image as mesh:
    //Create a loader to get an image from a URL
    var textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = true;
    var imageMaterial = new THREE.MeshBasicMaterial({
        map : textureLoader.load('images/download.jpg')
    });

    //Make box geometry and materials
    var box1 = new THREE.BoxGeometry( 1, 1, 1 );
    var material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
    
    //Create cubes and place them:
    var cube = new THREE.Mesh( box1, material1 );
    cube.position.x = 1;
    cube.position.y = 1;
    cube.position.z = 1;

    var cube2 = new THREE.Mesh( box1, imageMaterial );
    cube2.position.x = 3;
    cube2.position.y = 3;
    cube2.position.z = 3;

    //Add cubes to scene:
    scene.add( cube );
    scene.add( cube2 );

    function newCube(imageUrl, aPosition) {
        //Load image as material:
        var anImageMaterial = new THREE.MeshBasicMaterial({
            map : textureLoader.load(imageUrl)
        });
        //Make box geometry:
        var box = new THREE.BoxGeometry( 1, 1, 1 );
        //Create mesh:
        var boxMesh = new THREE.Mesh( box, anImageMaterial );
        //Position in (x,y,z):
        boxMesh.position.x = aPosition.x;
        boxMesh.position.y = aPosition.y;
        boxMesh.position.z = aPosition.z;
        //Add to scene:
        scene.add( boxMesh );
    }

    //Examples of use:
    newCube('images/download.jpg', { x:2, y:2, z:2 } );
    newCube('images/download.jpg', { x:4, y:4, z:4 } );
    newCube('images/download.jpg', { x:1, y:1, z:0 } );

    //Function that given two Vector3's (from and to points), and a color, creates these and add them to scene.
    function newLine(from, to, _color) {
        var aLineMaterial = new THREE.LineBasicMaterial( { color: _color } );
        var aline = new THREE.Geometry();
        aline.vertices.push( from );
        aline.vertices.push( to );
        var aline = new THREE.Line( aline, aLineMaterial );
        scene.add( aline );
    }

    //Adding x, y and z axis:
    newLine(new THREE.Vector3(0,0,0), new THREE.Vector3(5,0,0), red); //x is red
    newLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,5,0), green); //y is green
    newLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,5), blue); //z is blue

    //Add text function:
    var textMeshes = [];
    var textLoader = new THREE.FontLoader();
    function addText(someText, aColor, aPosition){
        textLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
            //Define text geometry:
            var textGeo = new THREE.TextGeometry( someText, {
                font: font,
                size: 0.2,  //height
                height: 0.1 //depth
                //curveSegments: 1,
                //bevelThickness: 1,
                //bevelSize: 1
                //bevelEnabled: true
            } );
            //Define the material:
            var textMaterial = new THREE.MeshBasicMaterial( { color: aColor } );
            //Create the mesh:
            var mesh = new THREE.Mesh( textGeo, textMaterial );
            //Position the mesh:
            mesh.position.set( aPosition.x, aPosition.y, aPosition.z );
            //Add text mesh to collection that get updated to look at camera
            textMeshes.push(mesh);
            //Add mesh to scene:
            scene.add( mesh );
        } );
    }

    //Examples of inserting text:
    addText("1", green, { x: 0, y: 1, z: 0 } );
    addText("2", green, { x: 0, y: 2, z: 0 } );
    addText("3", green, { x: 0, y: 3, z: 0 } );

    addText("1", red, { x: 1, y: 0, z: 0 } );
    addText("2", red, { x: 2, y: 0, z: 0 } );
    addText("3", red, { x: 3, y: 0, z: 0 } );

    addText("1", blue, { x: 0, y: 0, z: 1 } );
    addText("2", blue, { x: 0, y: 0, z: 2 } );
    addText("3", blue, { x: 0, y: 0, z: 3 } );

    
    //Animation loop that output FPS to console.
    var lastLoop = new Date;
    function animate() {
        /* //Output logic:
        var thisLoop = new Date;
        var fps = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;
        console.log(fps);
        */

        //camera.position.x += 0.01;
        pointTextToCamera();
        //cube.rotation.y += 0.05;
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();

    function pointTextToCamera(){
        textMeshes.forEach(t => t.lookAt( camera.position ) );
    }

    //Reset camera on esc.
    
    $(document).keyup( function(e) {
         if (e.keyCode == 27) { // Escape key maps to keycode `27`
            controls.reset();
            camera.position.z = 5;
            camera.rotation.y = 90 * Math.PI;   
        }
    });
    
});