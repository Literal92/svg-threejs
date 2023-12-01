import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { LabelData, LabelConfig, ShapeConfig } from './model/labelData';
import { MatDialog } from '@angular/material/dialog';
import { LabelConfigComponent } from './components/labelConfig/labelConfig.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChild('labelDiv') labelDivRef!: ElementRef<HTMLDivElement>;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private labelData: LabelData;
  private LabelConfig: LabelConfig;
  private ShapeConfig: ShapeConfig;
  private shape: string;

  constructor(private ngZone: NgZone, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.init();
    this.animate();
  }


  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container.nativeElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, 0, 200);

    this.loadSVG('../assets/Image/timer.svg');
  }

  animate() {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);

        this.renderer.render(this.scene, this.camera);

      };

      animate();
    });
  }

  loadSVG(url: string) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb0b0b0);

    const loader = new SVGLoader();

    loader.load(url, (data) => {
      const group = new THREE.Group();
      group.scale.multiplyScalar(0.75);
      group.position.x = - 80;
      group.position.y = 70;
      group.scale.y *= - 1;

      let renderOrder = 0;

      for (const path of data.paths) {
        const fillColor = path.userData['style'].fill;

        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(fillColor),
          opacity: path.userData['style'].fillOpacity,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          wireframe: false
        });

        const shapes = SVGLoader.createShapes(path);

        for (const shape of shapes) {
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = renderOrder++;

          group.add(mesh);
        }
      }

      // Add the group to the scene
      this.scene.add(group);
    });
  }

  updateLabelPosition(position: THREE.Vector3) {

  }

  selectShape(shape: string) {
    const dialogRef = this.dialog.open(LabelConfigComponent, {
      data: shape,
      width: '50%',
      height: '70%'
    });

    dialogRef.afterClosed().subscribe((result: { text: LabelConfig, shape: ShapeConfig }) => {
      if (result) {
        this.shape = shape
        this.LabelConfig = result.text;
        this.ShapeConfig = result.shape;
        this.createLabel();
      }
    });
  }

  createLabel() {

    // Update label position based on the 3D object's position
    const labelPosition = new THREE.Vector3();
    this.scene.getWorldPosition(labelPosition);

    const labelDiv = this.labelDivRef.nativeElement;
    const container = this.container.nativeElement.getBoundingClientRect();

    // Convert 3D position to 2D screen coordinates
    const screenPosition = labelPosition.clone().project(this.camera);

    // Convert normalized screen coordinates to pixel values
    const x = (screenPosition.x + this.LabelConfig.labelx) * 0.25 * container.width;
    const y = (-screenPosition.y + this.LabelConfig.labelY) * 0.25 * container.height;

    labelDiv.style.display = 'flex'
    labelDiv.style.width = this.ShapeConfig.width + 'px';
    labelDiv.style.height = this.ShapeConfig.height + 'px';
    labelDiv.style.fontSize = this.LabelConfig.labelSize + 'px';
    labelDiv.style.color = this.LabelConfig.labelColor;
    labelDiv.style.stroke = 'black';
    labelDiv.style.borderRadius = this.shape === 'Circle' || this.shape === 'Ellipse' ? '50%' : 'unset';
    labelDiv.style.backgroundColor = this.shape === 'Text' ? 'transparent' : this.ShapeConfig.fill;

    // Update label position
    labelDiv.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    this.sendDatatoApi()
  }

  sendDatatoApi() {

    this.labelData = {
      data: {
        id: `label_${Math.floor(Math.random() * (999999 - 100000)) + 100000}`,
        shape: {
          elementId: `label_${Math.floor(Math.random() * (999999 - 100000)) + 100000}`,
          shape: this.shape,
          view: {
            fill: this.ShapeConfig.fill,
            width: this.ShapeConfig.width,
            height: this.ShapeConfig.height
          }
        },
        text: {
          elementId: `label_${Math.floor(Math.random() * (999999 - 100000)) + 100000}`,
          view: {
            'font-size': this.LabelConfig.labelSize,
            fill: this.LabelConfig.labelColor,
            x: this.LabelConfig.labelx,
            y: this.LabelConfig.labelY
          },
          content: {
            label: this.LabelConfig.labelText,
            dynamic: {
              topic: "",
              output: "",
              isLinked: false
            }
          }
        },
        action: {
          type: null
        },
        animation: {
          type: null
        },
        type: "[Hmi] update dynamic label"
      }
    }

    console.log('labelData: ', this.labelData);
  }
}
