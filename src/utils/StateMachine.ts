export enum PlayerState {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  FALLING = "FALLING",
  JUMPING = "JUMPING",
  GLIDING = "GLIDING",
}

export const stateMachine = {
  [PlayerState.IDLE]: [PlayerState.RUNNING, PlayerState.JUMPING],
  [PlayerState.RUNNING]: [PlayerState.JUMPING, PlayerState.IDLE, PlayerState.GLIDING],
  [PlayerState.JUMPING]: [PlayerState.FALLING],
  [PlayerState.FALLING]: [PlayerState.IDLE, PlayerState.GLIDING],
  [PlayerState.GLIDING]: [PlayerState.FALLING, PlayerState.RUNNING, PlayerState.IDLE],
};
