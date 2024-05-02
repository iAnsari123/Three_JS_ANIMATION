var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Adjusted aspect ratio to make it square
camera.position.z = 500;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(400, 400); // Set the size to 300px by 300px
document.body.appendChild(renderer.domElement);

// Add ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light to the scene
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

var distance = Math.min(100, window.innerWidth / 6);
var geometry = new THREE.Geometry();

for (var i = 0; i < 400; i++) {
  var vertex = new THREE.Vector3();
  var theta = Math.random() * Math.PI * 2;
  var phi = Math.acos((Math.random() * 2) - 1);
  vertex.x = distance * Math.sin(theta) * Math.cos(phi);
  vertex.y = distance * Math.sin(theta) * Math.sin(phi);
  vertex.z = distance * Math.cos(theta);
  geometry.vertices.push(vertex);
}

var particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x4444ff, size: 0.1 }));

var animProps = { scale: 1, xRot: 0, yRot: 0 };

var animations = [
  [
    { duration: 10, scale: 1.3, repeat: -1, yoyo: true, ease: "sine" },
    { duration: 120, xRot: Math.PI * 2, yRot: Math.PI * 4, repeat: -1, yoyo: true, ease: "none" },
    { duration: 5, scale: 1.3, repeat: -1, yoyo: true, ease: "power1.inOut" }
  ],
  [
    { duration: 10, scale: 1.2, repeat: -1, yoyo: true, ease: "sine" },
    { duration: 120, xRot: Math.PI * 4, yRot: Math.PI * 2, repeat: -1, yoyo: true, ease: "none" },
    { duration: 5, scale: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut" }
  ],
  [
    { duration: 8, scale: 1.5, repeat: -1, yoyo: true, ease: "sine" },
    { duration: 100, xRot: Math.PI, yRot: Math.PI * 3, repeat: -1, yoyo: true, ease: "none" },
    { duration: 7, scale: 1.2, repeat: -1, yoyo: true, ease: "power1.inOut" }
  ]
];

var rowSpacing = 250; // Adjust the spacing between rows

var renderingParents = [];
for (var row = 0; row < 3; row++) {
  var renderingParent = new THREE.Group();
  renderingParent.position.y = (row - 1) * rowSpacing; // Adjust the vertical position
  renderingParents.push(renderingParent);
  scene.add(renderingParent);

  for (var animIndex = 0; animIndex < animations[row].length; animIndex++) {
    var props = animations[row][animIndex];
    var clonedParticles = particles.clone();
    clonedParticles.position.x = (animIndex - 1) * 270; // Adjust the horizontal position
    renderingParent.add(clonedParticles);
    applyAnimation(clonedParticles, props);
  }
}

var hoverTween = null;

renderer.domElement.addEventListener('mousemove', function (event) {
  if (hoverTween) hoverTween.kill();
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    var obj = intersects[0].object;
    hoverTween = gsap.to(obj.position, { duration: 1, x: obj.userData.originalPosition.x, y: obj.userData.originalPosition.y, z: obj.userData.originalPosition.z });
  }
});

function applyAnimation(particles, props) {
  gsap.to(animProps, {
    ...props,
    onUpdate: function () {
      particles.scale.set(animProps.scale, animProps.scale, animProps.scale);
      particles.rotation.set(animProps.xRot, animProps.yRot, 0);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();



