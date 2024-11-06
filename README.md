# nl12
Another experiment using Copilot to make a game

## Development Scaffolding

This project uses Yarn and Vite for development scaffolding, and is built using TypeScript and Phaser for a 2D platformer game.

### Project Structure

* `src/` - Contains all the source code for the game
  * `index.ts` - Entry point for the game
  * `scenes/` - Contains different scenes of the game
    * `MainScene.ts` - Main game scene
  * `assets/` - Contains game assets like images, audio, and tilemaps
    * `images/` - Contains image assets
    * `audio/` - Contains audio assets
    * `tilemaps/` - Contains tilemap assets
* `public/` - Contains static files to be served
  * `index.html` - Main HTML file to load the game
* `package.json` - Contains project dependencies and scripts
* `tsconfig.json` - TypeScript configuration file
* `vite.config.ts` - Vite configuration file

### Getting Started

1. Install dependencies:
   ```sh
   yarn install
   ```

2. Start the development server:
   ```sh
   yarn dev
   ```

3. Build the project:
   ```sh
   yarn build
   ```

4. Preview the build:
   ```sh
   yarn serve
   ```

### Dependencies

* Phaser
* TypeScript
* Vite
