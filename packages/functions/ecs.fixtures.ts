import type { EcsWorld } from './ecs'
import { EcsComponent, EcsPlugin, EcsResource, EcsSystem } from './ecs'

// --- Component fixtures ---

export class PositionComponent extends EcsComponent {
  constructor(public x: number, public y: number) {
    super()
  }
}

export class VelocityComponent extends EcsComponent {
  constructor(public vx: number, public vy: number) {
    super()
  }
}

export class HealthComponent extends EcsComponent {
  constructor(public health: number) {
    super()
  }
}

// --- Resource fixtures ---

export class TextureRegistry extends EcsResource {
  private textures = new Map<string, string>()

  register(name: string, path: string): void {
    this.textures.set(name, path)
  }

  get(name: string): string | undefined {
    return this.textures.get(name)
  }
}

export class ConfigResource extends EcsResource {
  constructor(public debug = false) {
    super()
  }
}

// --- System fixtures ---

export class MovementSystem extends EcsSystem {
  updateCount = 0
  onUpdate(deltaTime: number): void {
    this.updateCount++
    for (const { components: [position, velocity] } of this.world.queryAll([PositionComponent, VelocityComponent])) {
      position.x += velocity.vx * deltaTime
      position.y += velocity.vy * deltaTime
    }
  }
}

export class HealthSystem extends EcsSystem {
  updateCount = 0
  onUpdate(_deltaTime: number): void {
    this.updateCount++
  }
}

export class LifecycleSystem extends EcsSystem {
  created = false
  destroyed = false

  onCreate(): void {
    this.created = true
  }

  onDestroy(): void {
    this.destroyed = true
  }

  onUpdate(_deltaTime: number): void {}
}

export class ErrorOnCreateSystem extends EcsSystem {
  onCreate(): void {
    throw new Error('onCreate error')
  }
}

export class ErrorOnUpdateSystem extends EcsSystem {
  onUpdate(_deltaTime: number): void {
    throw new Error('onUpdate error')
  }
}

export class ErrorOnDestroySystem extends EcsSystem {
  onDestroy(): void {
    throw new Error('onDestroy error')
  }
}

// --- Plugin fixtures ---

export class CorePlugin extends EcsPlugin {
  built = false
  cleanedUp = false

  build(_world: EcsWorld): void {
    this.built = true
  }

  cleanup(_world: EcsWorld): void {
    this.cleanedUp = true
  }
}

export class PhysicsPlugin extends EcsPlugin {
  dependencies = [CorePlugin]
  built = false

  build(world: EcsWorld): void {
    this.built = true
    world.addResource(new ConfigResource(true))
    world.addSystem(new MovementSystem(world))
  }
}

export class RenderingPlugin extends EcsPlugin {
  dependencies = [CorePlugin]
  built = false

  build(_world: EcsWorld): void {
    this.built = true
  }
}

export class GamePlugin extends EcsPlugin {
  dependencies = [PhysicsPlugin, RenderingPlugin]
  built = false

  build(_world: EcsWorld): void {
    this.built = true
  }
}

export class ErrorOnBuildPlugin extends EcsPlugin {
  build(_world: EcsWorld): void {
    throw new Error('build error')
  }
}

export class ErrorOnCleanupPlugin extends EcsPlugin {
  build(_world: EcsWorld): void {}

  cleanup(_world: EcsWorld): void {
    throw new Error('cleanup error')
  }
}

// --- System ordering fixtures ---

export class InputSystem extends EcsSystem {
  onUpdate(_deltaTime: number): void {}
}

export class PhysicsSystem extends EcsSystem {
  static readonly runAfter = [InputSystem]

  onUpdate(_deltaTime: number): void {}
}

export class RenderSystem extends EcsSystem {
  static readonly runAfter = [PhysicsSystem]

  onUpdate(_deltaTime: number): void {}
}

export class AudioSystem extends EcsSystem {
  static readonly runBefore = [RenderSystem]

  onUpdate(_deltaTime: number): void {}
}

// Forward declaration workaround: use a function to defer resolution
export class CyclicSystemB extends EcsSystem {
  static readonly runAfter: Array<new (...args: any[]) => EcsSystem> = []

  onUpdate(_deltaTime: number): void {}
}

export class CyclicSystemA extends EcsSystem {
  static readonly runAfter = [CyclicSystemB]

  onUpdate(_deltaTime: number): void {}
}

// Complete the cycle after both classes are defined
CyclicSystemB.runAfter.push(CyclicSystemA)
