# Three.js Angular Application

This project is an Angular application that integrates the Three.js library to create a 3D scene. The application includes a label component that can be configured dynamically. The label shape can be changed between a rectangle, circle, or ellipse. Additionally, you can configure the label text, scale factor, offset, and aspect ratio.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/threejs-angular-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd threejs-angular-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Development Server

Run the application in development mode:

```bash
npm start
```

Navigate to `http://localhost:4200/` in your web browser to view the application.

### Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Configuration

The application allows dynamic configuration of the label through a configuration component. You can change the label text, shape (rectangle, circle, or ellipse), scale factor, offset, and aspect ratio.

1. Open the configuration panel by clicking the "Configure Label" button.

2. Modify the configuration parameters as needed.

3. Click the "Apply Changes" button to see the updated label in the 3D scene.

## Scripts

- `npm start`: Run the development server.
- `npm run build`: Build the application for production.
- `npm run watch`: Build the application in watch mode for development.
- `npm test`: Run unit tests.

## Dependencies

- Angular: Framework for building web applications.
- Three.js: Library for 3D graphics in the browser.
- Other libraries for Angular and testing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
