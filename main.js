var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Adjusted aspect ratio to make it square
camera.position.z = 500;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500); // Set the size to 300px by 300px
document.getElementById("canvas").appendChild(renderer.domElement);

// Add ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light to the scene
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

var distance = Math.min(100, window.innerWidth / 6);
var geometry = new THREE.Geometry();

for (var i = 0; i < 2500; i++) {
  var vertex = new THREE.Vector3();
  var theta = Math.random() * Math.PI * 2;
  var phi = Math.acos(Math.random() * 2 - 1);
  vertex.x = distance * Math.sin(theta) * Math.cos(phi);
  vertex.y = distance * Math.sin(theta) * Math.sin(phi);
  vertex.z = distance * Math.cos(theta);
  geometry.vertices.push(vertex);
}
var particles = new THREE.Points(
  geometry,
  new THREE.PointsMaterial({ color: 0x4444ff, size: 0.1 })
);

var geometry2 = new THREE.Geometry();
for (var i = 0; i < 1500; i++) {
  var vertex = new THREE.Vector3();
  var theta = Math.random() * Math.PI * 2;
  var phi = Math.acos(Math.random() * 2 - 1);
  vertex.x = distance * Math.sin(theta);
  vertex.y = distance * Math.sin(theta) * Math.sin(phi);
  vertex.z = distance * Math.cos(theta);
  geometry2.vertices.push(vertex);
}
var particles2 = new THREE.Points(
  geometry2,
  new THREE.PointsMaterial({ color: 0x4444ff, size: 0.1 })
);

var animProps = { scale: 1, xRot: 0, yRot: 0 };

var animations = [
  [
    { duration: 10, scale: 1, repeat: -1, yoyo: true, ease: "sine" },
    {
      duration: 120,
      xRot: Math.PI * 2,
      yRot: Math.PI * 4,
      repeat: -1,
      yoyo: true,
      ease: "none",
    },
    { duration: 5, scale: 1, repeat: -1, yoyo: true, ease: "power1.inOut" },
  ],
  [
    { duration: 2.5, scale: 10, repeat: 1, yoyo: true, ease: "sine" },

    {
      duration: 120,
      xRot: Math.PI * 4,
      yRot: Math.PI * 2,
      repeat: -1,
      yoyo: true,
      ease: "none",
    },
    { duration: 10, scale: 1, repeat: -1, yoyo: true, ease: "power1.inOut" },
  ],
  [
    { duration: 8, scale: 1, repeat: -1, yoyo: true, ease: "sine" },

    {
      duration: 100,
      xRot: Math.PI,
      yRot: Math.PI * 3,
      repeat: -1,
      yoyo: true,
      ease: "none",
    },
    { duration: 7, scale: 1, repeat: -1, yoyo: true, ease: "power1.inOut" },
  ],
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
    // Adjust the horizontal position
    if (
      (row == 2 && animIndex == 0) ||
      (row == 2 && animIndex == 1) ||
      (row == 1 && animIndex == 2)
    ) {
      var clonedParticles = particles2.clone();
      clonedParticles.position.x = (animIndex - 1) * 270;
      renderingParent.add(clonedParticles);
      applyAnimation(clonedParticles, props);
    } else {
      var clonedParticles = particles.clone();
      clonedParticles.position.x = (animIndex - 1) * 270;
      renderingParent.add(clonedParticles);
      applyAnimation(clonedParticles, props);
    }
  }
}

function applyAnimation(particles, props) {
  gsap.to(animProps, {
    ...props,
    onUpdate: function () {
      particles.scale.set(animProps.scale, animProps.scale, animProps.scale);
      particles.rotation.set(animProps.xRot, animProps.yRot, 0);
    },
  });
}

function applyAnimation2(particles2, props) {
  gsap.to(animProps, {
    ...props,
    onUpdate: function () {
      particles2.scale.set(animProps.scale, animProps.scale, animProps.scale);
      particles2.rotation.set(animProps.xRot, animProps.yRot, 0);
    },
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
