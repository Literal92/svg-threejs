Three.js Angular Application
This project is an Angular application that integrates the Three.js library to create a 3D scene. The application includes a label component that can be configured dynamically. The label shape can be changed between a rectangle, circle, or ellipse. Additionally, you can configure the label text, scale factor, offset, and aspect ratio.

Getting Started
Prerequisites
Make sure you have Node.js and npm installed on your machine.

Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/threejs-angular-app.git
Navigate to the project directory:

bash
Copy code
cd threejs-angular-app
Install dependencies:

bash
Copy code
npm install
Development Server
Run the application in development mode:

bash
Copy code
npm start
Navigate to http://localhost:4200/ in your web browser to view the application.

Build
To build the application for production:

bash
Copy code
npm run build
The build artifacts will be stored in the dist/ directory.

Configuration
The application allows dynamic configuration of the label through a configuration component. You can change the label text, shape (rectangle, circle, or ellipse), scale factor, offset, and aspect ratio.

Open the configuration panel by clicking the "Configure Label" button.

Modify the configuration parameters as needed.

Click the "Apply Changes" button to see the updated label in the 3D scene.

Scripts
npm start: Run the development server.
npm run build: Build the application for production.
npm run watch: Build the application in watch mode for development.
npm test: Run unit tests.
Dependencies
Angular: Framework for building web applications.
Three.js: Library for 3D graphics in the browser.
Other libraries for Angular and testing.
License
This project is licensed under the MIT License - see the LICENSE file for details.
