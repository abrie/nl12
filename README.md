# nl12
Another experiment using Copilot to make a game

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- Yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/abrie/nl12.git
   cd nl12
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```

### Running the Development Server

To start the development server, run:
```sh
yarn dev
```

This will start the Vite development server and you can view the game in your browser at `http://localhost:3000`.

### Building for Production

To build the project for production, run:
```sh
yarn build
```

The production-ready files will be in the `dist` directory.

### Game Mechanics

- Player movement (left, right, jump)
- Collision detection with platforms and obstacles
- Gravity and physics for player and objects
- Basic scoring system
