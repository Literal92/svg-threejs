import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
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
  private previousLabelConfig: LabelConfig;
  private ShapeConfig: ShapeConfig;
  private shape: string;
  private labelPosition: THREE.Vector3;
  private isDragging = false;

  labelText = 'Label';

  constructor(private ngZone: NgZone,
    public dialog: MatDialog,
  ) {
    this.labelPosition = new THREE.Vector3();
  }

  ngAfterViewInit(): void {
    this.init();
    this.animate();
  }


  private init() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: this.container.nativeElement });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.set(0, 0, 200);

    this.loadSVG('../assets/Image/timer.svg');
  }

  private animate() {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(animate);
      };
      animate();
    });
  }

  private loadSVG(url: string) {
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

  private updateLabelPosition() {
    const labelDiv = this.labelDivRef.nativeElement;
    labelDiv.style.transform = `translate(-50%, -50%) translate(${this.labelPosition.x}px, ${this.labelPosition.y}px)`;
  }

  private createLabel() {

    // Update label position based on the 3D object's position
    const labelPosition = new THREE.Vector3();
    this.scene.getWorldPosition(labelPosition);

    const labelDiv = this.labelDivRef.nativeElement;
    const container = this.container.nativeElement.getBoundingClientRect();

    // Convert 3D position to 2D screen coordinates
    const screenPosition = labelPosition.clone().project(this.camera);

    // Convert normalized screen coordinates to pixel values
    this.labelPosition.set(((screenPosition.x + this.LabelConfig.labelx) * 0.25 * container.width),
      ((-screenPosition.y + this.LabelConfig.labelY) * 0.25 * container.height), 0);

    labelDiv.style.display = 'flex'
    labelDiv.style.width = this.ShapeConfig.width + 'px';
    labelDiv.style.height = this.ShapeConfig.height + 'px';
    labelDiv.style.fontSize = this.LabelConfig.labelSize + 'px';
    labelDiv.style.color = this.LabelConfig.labelColor;
    labelDiv.style.stroke = 'black';
    labelDiv.style.borderRadius = this.shape === 'Circle' || this.shape === 'Ellipse' ? '50%' : 'unset';
    labelDiv.style.backgroundColor = this.shape === 'Text' ? 'transparent' : this.ShapeConfig.fill;

    // Update label position
    this.updateLabelPosition();

    this.sendDatatoApi()
  }

  private sendDatatoApi() {

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

  // Draggable Label Component
  onMouseMove(event) {
    if (this.isDragging && this.LabelConfig) {
      const container = this.container.nativeElement.getBoundingClientRect();
      this.LabelConfig.labelx = ((event.clientX / 0.25) / container.width) - 0.4;
      this.LabelConfig.labelY = (event.clientY / 0.25) / container.height;

      const labelPosition = new THREE.Vector3();
      this.scene.getWorldPosition(labelPosition);


      // Convert 3D position to 2D screen coordinates
      const screenPosition = labelPosition.clone().project(this.camera);

      // Convert normalized screen coordinates to pixel values
      this.labelPosition.set(((screenPosition.x + this.LabelConfig.labelx) * 0.25 * container.width),
        ((-screenPosition.y + this.LabelConfig.labelY) * 0.25 * container.height), 0);

      this.updateLabelPosition();
    }
  }

  onMouseDown() {
    this.isDragging = true;
  }

  onMouseUp() {
    if (this.isDragging && this.LabelConfig) {
      if (this.LabelConfig.labelx !== this.previousLabelConfig.labelx || this.LabelConfig.labelY !== this.previousLabelConfig.labelY) {
        this.previousLabelConfig = { ...this.LabelConfig };
        this.selectShape(this.shape);
      }
    }
    this.isDragging = false;
  }

  selectShape(shapeName: string) {
    const dialogRef = this.dialog.open(LabelConfigComponent, {
      data: { shape: this.ShapeConfig, label: this.LabelConfig, shapeName: shapeName },
      width: '50%',
      height: '70%'
    });

    dialogRef.afterClosed().subscribe((result: { text: LabelConfig, shape: ShapeConfig }) => {
      if (result) {
        this.shape = shapeName
        this.LabelConfig = result.text;
        this.previousLabelConfig = { ...result.text };
        this.ShapeConfig = result.shape;

        this.labelText = result.text.labelText;

        this.createLabel();
      }
    });
  }
}
