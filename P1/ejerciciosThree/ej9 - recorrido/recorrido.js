import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
 // lo que no se conecte al grafo de escena, no aparece en esta.
class recorrido extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // this.axis = new THREE.AxesHelper (5);
    // this.add (this.axis);

    var cargarTextura = new THREE.TextureLoader();
    var texture = cargarTextura.load('../imgs/textura-ajedrezada.jpg');
    texture.repeat.set(0.1,1);

    this.object = new THREE.Mesh(new THREE.ConeGeometry(0.5,1,3).rotateX(Math.PI / 2), new THREE.MeshPhongMaterial({map : texture}))
    this.add(this.object)


    this.curvaDcha();
    this.curvaIzq();
    this.createPath(this.splineDcha);
    this.createPath(this.splineIzq);
    
    var origen = {p:0};
    var destino = {p:1};
    var movimientoDch = new TWEEN.Tween(origen).to(destino, 4000)
    
    movimientoDch.easing(TWEEN.Easing.Quadratic.InOut)
    // movimientoDch.repeat(Infinity)
    
    movimientoDch.onUpdate((origen)=>{
      var posicion = this.splineDcha.getPoint(origen.p);
      this.object.position.copy(posicion)
      var tangente = this.splineDcha.getTangentAt(origen.p);
      posicion.add(tangente)
      this.object.lookAt(posicion)
    });
    
    origen = {p:0};
    destino = {p:1}; 
    var movimientoIzq = new TWEEN.Tween(origen).to(destino, 8000)
    movimientoIzq.easing(TWEEN.Easing.Quadratic.InOut)
    movimientoIzq.onUpdate(()=>{
      var posicion = this.splineIzq.getPoint(origen.p);
      this.object.position.copy(posicion)
      var tangente = this.splineIzq.getTangentAt(origen.p);
      posicion.add(tangente)
      this.object.lookAt(posicion)
    });

    movimientoDch.chain(movimientoIzq);
    movimientoIzq.chain(movimientoDch);
    
    movimientoDch.start();
    
  }

  updateMov(origen) {
    
  }

  onUpdate(spline) {

    var posicion = spline.getPoint(origen.p);
    this.object.position.copy(posicion)
    var tangente = spline.getTangentAt(origen.p);
    posicion.add(tangente)
    this.object.lookAt(posicion)

  };

  createPath(curve){
    const points = curve.getPoints( 100 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

    // Create the final object to add to the scene
    var spline = new THREE.Line( geometry, material ); 
    this.add(spline)
  }

  curvaDcha(){
    this.splineDcha = new THREE.CatmullRomCurve3( [
      // new THREE.Vector3( -5, 0, 10 ),
      // new THREE.Vector3( -5, 5, 5 ),
      // new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 5, 5, 7 ),
      new THREE.Vector3( 10, 3, 7 ),
      new THREE.Vector3( 13, 4, 6 ),
      new THREE.Vector3( 15, 6, -1 ),
      new THREE.Vector3( 7, 4, -1 ),
      new THREE.Vector3( 1, 3, 1 )
      
    ] );
  }
  curvaIzq(){
    this.splineIzq = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( 1, 3, 1 ),
      // new THREE.Vector3( 5, 2, 0 ),
      // new THREE.Vector3( 3, -1, -5 ),
      // new THREE.Vector3( 7, -6, 3 ),
      new THREE.Vector3( -10, 2, 3 ),
      new THREE.Vector3( -10, 6, 9 ),
      new THREE.Vector3( -5, 8, 9 ),
      new THREE.Vector3( 0, 7, 7 ),
      new THREE.Vector3( 5, 5, 7 )
    ] );
  }

  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      velocidad: 1,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.velocidad = 1;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
    folder.add (this.guiControls, 'velocidad', -12, 12, 1).name ('Velocidad (marcas/s) : ').listen();

  }

  setDetail(detail){
    var aux = this.recorrido;

  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    // this.segundos = this.clock.getDelta();
    // this.redSphere.rotation.y -= this.guiControls.velocidad * this.segundos * ((30 * Math.PI) / 180)
    // var time = Date.now();
    // var looptime = 4000; // 4s
    // var t = (time % looptime) / looptime

    // var posicion = this.spline.getPointAt(t);
    // this.object.position.copy(posicion)
    // var tangente = this.spline.getTangentAt(t);
    // posicion.add(tangente)
    // this.object.lookAt(posicion)
    TWEEN.update();
   
  }
}

export { recorrido };
