$(document).ready(function(){
    //Setup scene:
    var scene = new THREE.Scene();

    //Setup camera:
    var containerWidth = document.getElementById('browser').clientWidth;
    var containerHeight = document.getElementById('browser').clientHeight;
    var camera = new THREE.PerspectiveCamera( 75, containerWidth / containerHeight, 0.1, 1000 );
    camera.position.x = -5;
    camera.position.y = -5;
    camera.position.z = -2;

    //Setup renderer:
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerWidth, containerHeight)

    //renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('browser').appendChild( renderer.domElement );

    //Window resize listener:
    window.addEventListener( 'resize', function () {
        var width = document.getElementById('browser').clientWidth;
        var height = document.getElementById('browser').clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        console.log(width);
    });

    //Set control to OrbitControls.
    controls = new THREE.OrbitControls( camera, renderer.domElement);

    //Load image as mesh:
    //Create a loader to get an image from a URL
    var textureLoader = new THREE.TextureLoader();

    //We've gotta set this to use cross-origin images
    textureLoader.crossOrigin = true;
    var imageMaterial = new THREE.MeshBasicMaterial({
        map : textureLoader.load('images/download.jpg')
    });

    //Make box geometry and materials
    var box1 = new THREE.BoxGeometry( 1, 1, 1 );
    var material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
    var box2 = new THREE.BoxGeometry( 1, 1, 1 );

    //Create cubes:
    var cube = new THREE.Mesh( box1, material1 );
    cube.position.x = 1;
    cube.position.y = 1;

    var cube2 = new THREE.Mesh( box2, imageMaterial );
    cube2.position.x = 3;
    cube2.position.y = 3;
    cube2.position.z = 3;

    //Add cubes to scene:
    scene.add( cube );
    scene.add( cube2 );

    //Function that given two Vector3's (from and to points), and a color, creates these and add them to scene.
    function newLine(from, to, _color) {
        var aLineMaterial = new THREE.LineBasicMaterial( { color: _color } );
        var aline = new THREE.Geometry();
        aline.vertices.push( from );
        aline.vertices.push( to );
        var aline = new THREE.Line( aline, aLineMaterial );
        scene.add( aline );
    }

    newLine(new THREE.Vector3(0,0,0), new THREE.Vector3(5,0,0), 0xF00000); //x is red
    newLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,5,0), 0x00F000); //y is green
    newLine(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,5), 0x0000F0); //z is blue

    function addText(string, aColor, position){
        var someText = new THREE.TextGeometry( color:aColor);
    }

    //Animation loop that logs FPS to console.
    var lastLoop = new Date;
    function animate() {
        /*
        var thisLoop = new Date;
        var fps = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;
        console.log(fps);
        */

        //camera.position.x += 0.01;
        cube.rotation.y += 0.1;
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();

    //Reset camera on esc.
    $(document).keyup(function(e) {
         if (e.keyCode == 27) { // Escape key maps to keycode `27`
            controls.reset();
            camera.position.z = 10;
        }
    });
});

