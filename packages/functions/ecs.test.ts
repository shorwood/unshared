import type { EcsSystem } from './ecs'
import { EcsPlugin, EcsWorld } from './ecs'
import {
  AudioSystem,
  ConfigResource,
  CorePlugin,
  CyclicSystemA,
  CyclicSystemB,
  ErrorOnUpdateSystem,
  GamePlugin,
  HealthComponent,
  HealthSystem,
  InputSystem,
  LifecycleSystem,
  MovementSystem,
  PhysicsPlugin,
  PhysicsSystem,
  PositionComponent,
  RenderingPlugin,
  RenderSystem,
  TextureRegistry,
  VelocityComponent,
} from './ecs.fixtures'

describe('ecsWorld', () => {
  describe('entity management', () => {
    it('should create entities with unique IDs', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      const entity3 = world.spawn()
      expect(entity1).toBe(0)
      expect(entity2).toBe(1)
      expect(entity3).toBe(2)
    })

    it('should return true when entity exists', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      const result = world.exists(entity)
      expect(result).toBe(true)
    })

    it('should return false when entity does not exist', () => {
      const world = new EcsWorld()
      const result = world.exists(999)
      expect(result).toBe(false)
    })

    it('should destroy entity', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.destroy(entity)
      expect(world.exists(entity)).toBe(false)
    })

    it('should remove all components when entity is destroyed', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponents(entity, new PositionComponent(10, 20))
      world.addComponents(entity, new VelocityComponent(1, 2))
      world.destroy(entity)
      expect(world.hasComponent(entity, PositionComponent)).toBe(false)
      expect(world.hasComponent(entity, VelocityComponent)).toBe(false)
    })

    it('should handle destroying non-existent entity gracefully', () => {
      const world = new EcsWorld()
      world.destroy(999)
      expect(world.exists(999)).toBe(false)
    })

    it('should create entity with components', () => {
      const world = new EcsWorld()
      const entity = world.spawn(new PositionComponent(10, 20), new VelocityComponent(1, 2))
      expect(entity).toBe(0)
      expect(world.hasComponent(entity, PositionComponent)).toBe(true)
      expect(world.hasComponent(entity, VelocityComponent)).toBe(true)
      const position = world.getComponent(entity, PositionComponent)
      const velocity = world.getComponent(entity, VelocityComponent)
      expect(position?.x).toBe(10)
      expect(position?.y).toBe(20)
      expect(velocity?.vx).toBe(1)
      expect(velocity?.vy).toBe(2)
    })

    it('should create entity with a single component', () => {
      const world = new EcsWorld()
      const entity = world.spawn(new HealthComponent(100))
      expect(world.hasComponent(entity, HealthComponent)).toBe(true)
      expect(world.getComponent(entity, HealthComponent)?.health).toBe(100)
    })

    it('should dispatch componentAdded events when creating entity with components', () => {
      const world = new EcsWorld()
      const handler = vi.fn()
      world.on('added', handler)
      const entity = world.spawn(new PositionComponent(5, 10), new VelocityComponent(1, 1))
      expect(handler).toHaveBeenCalledTimes(2)
      expect(handler).toHaveBeenCalledWith(entity, expect.any(PositionComponent))
      expect(handler).toHaveBeenCalledWith(entity, expect.any(VelocityComponent))
    })
  })

  describe('component management', () => {
    it('should add a single component to an entity', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      const position = world.addComponent(entity, new PositionComponent(10, 20))
      expect(position.x).toBe(10)
      expect(position.y).toBe(20)
    })

    it('should add multiple components to an entity', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      const [position, velocity] = world.addComponents(entity, new PositionComponent(10, 20), new VelocityComponent(1, 2))
      expect(position.x).toBe(10)
      expect(velocity.vx).toBe(1)
    })

    it('should get a component from an entity', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      const position = world.addComponent(entity, new PositionComponent(10, 20))
      const retrieved = world.getComponent(entity, PositionComponent)
      expect(retrieved).toBe(position)
    })

    it('should return undefined for non-existent component', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      expect(world.getComponent(entity, PositionComponent)).toBeUndefined()
    })

    it('should return false when entity does not have component', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      expect(world.hasComponent(entity, PositionComponent)).toBe(false)
    })

    it('should return true when entity has component', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(0, 0))
      expect(world.hasComponent(entity, PositionComponent)).toBe(true)
    })

    it('should remove a component', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(10, 20))
      expect(world.hasComponent(entity, PositionComponent)).toBe(true)
      world.removeComponent(entity, PositionComponent)
      expect(world.hasComponent(entity, PositionComponent)).toBe(false)
    })

    it('should replace component of same type', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(10, 20))
      world.addComponent(entity, new PositionComponent(100, 200))
      const position = world.getComponent(entity, PositionComponent)
      expect(position?.x).toBe(100)
      expect(position?.y).toBe(200)
    })

    it('should get component or fail when component exists', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(10, 20))
      const position = world.getComponentOrFail(entity, PositionComponent)
      expect(position.x).toBe(10)
      expect(position.y).toBe(20)
    })

    it('should throw when getComponentOrFail does not find component', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      expect(() => world.getComponentOrFail(entity, PositionComponent)).toThrow()
    })
  })

  describe('component registration', () => {
    it('should register a component type', () => {
      const world = new EcsWorld()
      world.registerComponent(PositionComponent)
      expect(world.isComponentRegistered(PositionComponent)).toBe(true)
    })

    it('should register multiple component types', () => {
      const world = new EcsWorld()
      world.registerComponents(PositionComponent, VelocityComponent, HealthComponent)
      expect(world.isComponentRegistered(PositionComponent)).toBe(true)
      expect(world.isComponentRegistered(VelocityComponent)).toBe(true)
      expect(world.isComponentRegistered(HealthComponent)).toBe(true)
    })

    it('should return false for unregistered component', () => {
      const world = new EcsWorld()
      expect(world.isComponentRegistered(PositionComponent)).toBe(false)
    })

    it('should get all registered components', () => {
      const world = new EcsWorld()
      world.registerComponents(PositionComponent, VelocityComponent)
      const registered = world.getRegisteredComponents()
      expect(registered).toHaveLength(2)
      expect(registered).toContain(PositionComponent)
      expect(registered).toContain(VelocityComponent)
    })

    it('should not register the same component twice', () => {
      const world = new EcsWorld()
      world.registerComponent(PositionComponent)
      world.registerComponent(PositionComponent)
      expect(world.getRegisteredComponents()).toHaveLength(1)
    })

    it('should allow chaining registration methods', () => {
      const world = new EcsWorld()
      const result = world
        .registerComponent(PositionComponent)
        .registerComponent(VelocityComponent)
        .setStrictComponents(true)
      expect(result).toBe(world)
    })

    it('should enable strict component mode', () => {
      const world = new EcsWorld()
      expect(world.isStrictComponents()).toBe(false)
      world.setStrictComponents(true)
      expect(world.isStrictComponents()).toBe(true)
    })

    it('should allow registered components in strict mode', () => {
      const world = new EcsWorld()
      world.registerComponent(PositionComponent)
      world.setStrictComponents(true)
      const entity = world.spawn()
      expect(() => world.addComponent(entity, new PositionComponent(10, 20))).not.toThrow()
    })

    it('should throw for unregistered components in strict mode', () => {
      const world = new EcsWorld()
      world.registerComponent(PositionComponent)
      world.setStrictComponents(true)
      const entity = world.spawn()
      expect(() => world.addComponent(entity, new VelocityComponent(1, 2))).toThrow()
    })

    it('should allow any component when strict mode is disabled', () => {
      const world = new EcsWorld()
      world.setStrictComponents(false)
      const entity = world.spawn()
      expect(() => world.addComponent(entity, new PositionComponent(10, 20))).not.toThrow()
    })

    it('should clear registered components on dispose', () => {
      const world = new EcsWorld()
      world.registerComponents(PositionComponent, VelocityComponent)
      world.setStrictComponents(true)
      world.dispose()
      expect(world.isComponentRegistered(PositionComponent)).toBe(false)
      expect(world.isStrictComponents()).toBe(false)
    })

    it('should pre-create component map when registering', () => {
      const world = new EcsWorld()
      world.registerComponent(PositionComponent)
      // The component map should exist even before any component is added
      // This can be verified by querying (should return empty, not undefined behavior)
      const results = [...world.query(PositionComponent)]
      expect(results).toHaveLength(0)
    })
  })

  describe('queries', () => {
    it('should query all entities with a specific component', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      const entity3 = world.spawn()
      world.addComponents(entity1, new PositionComponent(1, 1))
      world.addComponents(entity2, new PositionComponent(2, 2))
      world.addComponents(entity3, new VelocityComponent(1, 1))

      // Note: result object is reused, so capture entities during iteration
      const entities: number[] = []
      for (const r of world.query(PositionComponent)) entities.push(r.entity)
      expect(entities).toHaveLength(2)
      expect(entities).toEqual([entity1, entity2])
    })

    it('should return empty iterator for non-existent component type', () => {
      const world = new EcsWorld()
      world.spawn()
      const results = [...world.query(PositionComponent)]
      expect(results).toHaveLength(0)
    })

    it('should query all entities with multiple components', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      const entity3 = world.spawn()
      world.addComponents(entity1, new PositionComponent(1, 1))
      world.addComponents(entity1, new VelocityComponent(1, 1))
      world.addComponents(entity2, new PositionComponent(2, 2))
      world.addComponents(entity3, new VelocityComponent(3, 3))
      const results = [...world.queryAll([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(1)
      expect(results[0].entity).toBe(entity1)
      expect(results[0].components[0]).toBeInstanceOf(PositionComponent)
      expect(results[0].components[1]).toBeInstanceOf(VelocityComponent)
    })

    it('should query first entity with a component using queryOne', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      world.addComponents(entity1, new PositionComponent(1, 1))
      world.addComponents(entity2, new PositionComponent(2, 2))
      const result = world.queryOne(PositionComponent)
      expect(result).toBeDefined()
      expect(result!.entity).toBe(entity1)
    })

    it('should return the component when queryOne finds match', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponents(entity, new PositionComponent(5, 10))
      const result = world.queryOne(PositionComponent)
      expect(result!.component).toBeInstanceOf(PositionComponent)
      expect(result!.component.x).toBe(5)
      expect(result!.component.y).toBe(10)
    })

    it('should return undefined when queryOne finds no matching entity', () => {
      const world = new EcsWorld()
      world.spawn()
      expect(world.queryOne(PositionComponent)).toBeUndefined()
    })

    it('should return undefined when queryOne has no component map', () => {
      const world = new EcsWorld()
      expect(world.queryOne(PositionComponent)).toBeUndefined()
    })

    it('should query first entity with a component using queryOneOrFail', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      world.addComponents(entity1, new PositionComponent(1, 1))
      world.addComponents(entity2, new PositionComponent(2, 2))
      const result = world.queryOneOrFail(PositionComponent)
      expect(result.entity).toBe(entity1)
    })

    it('should return the component when queryOneOrFail finds match', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponents(entity, new PositionComponent(5, 10))
      const result = world.queryOneOrFail(PositionComponent)
      expect(result.component).toBeInstanceOf(PositionComponent)
      expect(result.component.x).toBe(5)
      expect(result.component.y).toBe(10)
    })

    it('should throw error when queryOneOrFail finds no matching entity', () => {
      const world = new EcsWorld()
      world.spawn()
      expect(() => world.queryOneOrFail(PositionComponent)).toThrow()
    })

    it('should throw error when queryOneOrFail has no component map', () => {
      const world = new EcsWorld()
      expect(() => world.queryOneOrFail(PositionComponent)).toThrow()
    })

    it('should filter query results with a filter function', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      const entity3 = world.spawn()
      world.addComponent(entity1, new PositionComponent(1, 1))
      world.addComponent(entity2, new PositionComponent(5, 5))
      world.addComponent(entity3, new PositionComponent(10, 10))

      // Note: result object is reused, so capture entities during iteration
      const entities: number[] = []
      for (const r of world.query(PositionComponent, r => r.component.x > 3)) entities.push(r.entity)
      expect(entities).toHaveLength(2)
      expect(entities).toEqual([entity2, entity3])
    })

    it('should filter queryOne results with a filter function', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      world.addComponent(entity1, new PositionComponent(1, 1))
      world.addComponent(entity2, new PositionComponent(5, 5))
      const result = world.queryOne(PositionComponent, r => r.component.x > 3)
      expect(result).toBeDefined()
      expect(result!.entity).toBe(entity2)
    })

    it('should return undefined when queryOne filter matches nothing', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(1, 1))
      const result = world.queryOne(PositionComponent, r => r.component.x > 100)
      expect(result).toBeUndefined()
    })

    it('should throw when queryOneOrFail filter matches nothing', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(1, 1))
      expect(() => world.queryOneOrFail(PositionComponent, r => r.component.x > 100)).toThrow()
    })

    it('should provide get() method on queryAll results', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponents(entity, new PositionComponent(10, 20))
      world.addComponents(entity, new VelocityComponent(1, 2))
      const results = [...world.queryAll([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(1)
      const position = results[0].get(PositionComponent)
      const velocity = results[0].get(VelocityComponent)
      expect(position.x).toBe(10)
      expect(velocity.vx).toBe(1)
    })
  })

  describe('system management', () => {
    it('should add a single system to the world', () => {
      const world = new EcsWorld()
      const system = world.addSystem(new MovementSystem(world))
      // Verify system is working by calling update
      world.update(16)
      expect(system.updateCount).toBe(1)
    })

    it('should add multiple systems at once', () => {
      const world = new EcsWorld()
      const [movement, health] = world.addSystems(new MovementSystem(world), new HealthSystem(world))
      world.update(16)
      expect(movement.updateCount).toBe(1)
      expect(health.updateCount).toBe(1)
    })

    it('should enforce system uniqueness by type', () => {
      const world = new EcsWorld()
      const system1 = new MovementSystem(world)
      const system2 = new MovementSystem(world)
      world.addSystem(system1)
      world.addSystem(system2)
      // Only system2 should be updated (system1 was replaced)
      world.update(16)
      expect(system1.updateCount).toBe(0)
      expect(system2.updateCount).toBe(1)
    })

    it('should remove a system by type', () => {
      const world = new EcsWorld()
      const system = world.addSystem(new MovementSystem(world))
      world.removeSystem(MovementSystem)
      // System should no longer be updated
      world.update(16)
      expect(system.updateCount).toBe(0)
    })

    it('should update all systems', () => {
      const world = new EcsWorld()
      const movement = world.addSystem(new MovementSystem(world))
      const health = world.addSystem(new HealthSystem(world))
      world.update(16)
      expect(movement.updateCount).toBe(1)
      expect(health.updateCount).toBe(1)
    })

    it('should update entity components through systems', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(0, 0))
      world.addComponent(entity, new VelocityComponent(10, 5))
      world.addSystem(new MovementSystem(world))
      world.update(1)
      const position = world.getComponent(entity, PositionComponent)
      expect(position?.x).toBe(10)
      expect(position?.y).toBe(5)
    })

    it('should handle removing non-existent system gracefully', () => {
      const world = new EcsWorld()
      expect(() => world.removeSystem(MovementSystem)).not.toThrow()
    })

    it('should call onCreate when system is added', () => {
      const world = new EcsWorld()
      const system = new LifecycleSystem(world)
      expect(system.created).toBe(false)
      world.addSystem(system)
      expect(system.created).toBe(true)
    })

    it('should call onDestroy when system is removed', () => {
      const world = new EcsWorld()
      const system = new LifecycleSystem(world)
      world.addSystem(system)
      expect(system.destroyed).toBe(false)
      world.removeSystem(LifecycleSystem)
      expect(system.destroyed).toBe(true)
    })

    it('should call onDestroy on existing system when replacing with same type', () => {
      const world = new EcsWorld()
      const system1 = new LifecycleSystem(world)
      const system2 = new LifecycleSystem(world)
      world.addSystem(system1)
      world.addSystem(system2)
      expect(system1.destroyed).toBe(true)
      expect(system2.created).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle destroying non-existent entity gracefully', () => {
      const world = new EcsWorld()
      expect(() => world.destroy(999)).not.toThrow()
    })

    it('should handle removing non-existent component gracefully', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      expect(() => world.removeComponent(entity, PositionComponent)).not.toThrow()
    })

    it('should handle queryAll with empty component types', () => {
      const world = new EcsWorld()
      world.spawn()
      const results = [...world.queryAll([])]
      expect(results).toHaveLength(0)
    })

    it('should handle queryAll when one component type has no entities', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponents(entity, new PositionComponent(1, 1))
      const results = [...world.queryAll([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(0)
    })

    it('should query correctly when smallest component map is not first', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      const entity3 = world.spawn()

      // Add Position to all three entities
      world.addComponents(entity1, new PositionComponent(1, 1))
      world.addComponents(entity2, new PositionComponent(2, 2))
      world.addComponents(entity3, new PositionComponent(3, 3))

      // Add Velocity only to entity2 (smaller map)
      world.addComponents(entity2, new VelocityComponent(1, 1))

      // Query with Position first (larger map), Velocity second (smaller map)
      const results = [...world.queryAll([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(1)
      expect(results[0].entity).toBe(entity2)
    })

    it('should query entities with at least one of the specified components using queryAny', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      const entity3 = world.spawn()

      world.addComponent(entity1, new PositionComponent(1, 1))
      world.addComponent(entity2, new VelocityComponent(2, 2))
      world.addComponent(entity3, new PositionComponent(3, 3))
      world.addComponent(entity3, new VelocityComponent(3, 3))

      const results = [...world.queryAny([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(3)
    })

    it('should provide get() method on queryAny results that returns undefined for missing components', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(5, 10))

      const results = [...world.queryAny([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(1)
      expect(results[0].get(PositionComponent)).toBeInstanceOf(PositionComponent)
      expect(results[0].get(VelocityComponent)).toBeUndefined()
    })

    it('should provide getOrFail() method on queryAny results that throws for missing components', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(5, 10))

      const results = [...world.queryAny([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(1)
      expect(results[0].getOrFail(PositionComponent)).toBeInstanceOf(PositionComponent)
      expect(() => results[0].getOrFail(VelocityComponent)).toThrow()
    })

    it('should handle queryAny with empty component types', () => {
      const world = new EcsWorld()
      world.spawn()
      const results = [...world.queryAny([])]
      expect(results).toHaveLength(0)
    })

    it('should return empty results for queryAny when no entities have any of the components', () => {
      const world = new EcsWorld()
      world.spawn()
      world.spawn()
      const results = [...world.queryAny([PositionComponent, VelocityComponent])]
      expect(results).toHaveLength(0)
    })

    it('should filter queryAny results with a filter function', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      const entity3 = world.spawn()

      world.addComponent(entity1, new PositionComponent(1, 1))
      world.addComponent(entity2, new PositionComponent(5, 5))
      world.addComponent(entity3, new VelocityComponent(10, 10))

      // Note: result object is reused, so capture entities during iteration
      const entities: number[] = []
      for (const result of world.queryAny(
        [PositionComponent, VelocityComponent],
        r => r.get(PositionComponent)?.x !== 1,
      )) entities.push(result.entity)
      expect(entities).toHaveLength(2)
      expect(entities).toEqual([entity2, entity3])
    })

    it('should filter queryAll results with a filter function', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()

      world.addComponent(entity1, new PositionComponent(1, 1))
      world.addComponent(entity1, new VelocityComponent(1, 1))
      world.addComponent(entity2, new PositionComponent(5, 5))
      world.addComponent(entity2, new VelocityComponent(5, 5))

      const results = [...world.queryAll(
        [PositionComponent, VelocityComponent],
        r => r.get(PositionComponent).x > 3,
      )]
      expect(results).toHaveLength(1)
      expect(results[0].entity).toBe(entity2)
    })

    it('should continue generating unique entity IDs after destruction', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      world.spawn()
      world.destroy(entity1)
      const entity3 = world.spawn()
      expect(entity3).toBe(2)
    })

    it('should not reuse destroyed entity IDs', () => {
      const world = new EcsWorld()
      const entity1 = world.spawn()
      const entity2 = world.spawn()
      world.destroy(entity1)
      const entity3 = world.spawn()
      expect(world.exists(entity1)).toBe(false)
      expect(world.exists(entity2)).toBe(true)
      expect(world.exists(entity3)).toBe(true)
    })

    it('should handle multiple different component types on same entity', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponents(entity, new PositionComponent(10, 20))
      world.addComponents(entity, new VelocityComponent(1, 2))
      world.addComponents(entity, new HealthComponent(100))

      expect(world.hasComponent(entity, PositionComponent)).toBe(true)
      expect(world.hasComponent(entity, VelocityComponent)).toBe(true)
      expect(world.hasComponent(entity, HealthComponent)).toBe(true)
    })

    it('should retrieve different component types from same entity', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponents(entity, new PositionComponent(10, 20))
      world.addComponents(entity, new VelocityComponent(1, 2))
      world.addComponents(entity, new HealthComponent(100))

      const pos = world.getComponent(entity, PositionComponent)
      const vel = world.getComponent(entity, VelocityComponent)
      const health = world.getComponent(entity, HealthComponent)

      expect(pos?.x).toBe(10)
      expect(vel?.vx).toBe(1)
      expect(health?.health).toBe(100)
    })

    it('should handle getComponent for non-existent entity', () => {
      const world = new EcsWorld()
      expect(world.getComponent(999, PositionComponent)).toBeUndefined()
    })

    it('should handle hasComponent for non-existent entity', () => {
      const world = new EcsWorld()
      expect(world.hasComponent(999, PositionComponent)).toBe(false)
    })
  })

  describe('resource management', () => {
    it('should add a single resource to the world', () => {
      const world = new EcsWorld()
      const registry = world.addResource(new TextureRegistry())
      expect(world.getResource(TextureRegistry)).toBe(registry)
    })

    it('should add multiple resources to the world', () => {
      const world = new EcsWorld()
      const [textures, config] = world.addResources(new TextureRegistry(), new ConfigResource(true))
      expect(world.getResource(TextureRegistry)).toBe(textures)
      expect(world.getResource(ConfigResource)).toBe(config)
    })

    it('should get a resource by type', () => {
      const world = new EcsWorld()
      const registry = world.addResource(new TextureRegistry())
      expect(world.getResource(TextureRegistry)).toBe(registry)
    })

    it('should throw for non-existent resource', () => {
      const world = new EcsWorld()
      const shouldThrow = () => world.getResource(TextureRegistry)
      expect(shouldThrow).toThrow()
    })

    it('should check if resource exists', () => {
      const world = new EcsWorld()
      expect(world.hasResource(TextureRegistry)).toBe(false)
      world.addResource(new TextureRegistry())
      expect(world.hasResource(TextureRegistry)).toBe(true)
    })

    it('should remove a resource', () => {
      const world = new EcsWorld()
      world.addResource(new TextureRegistry())
      expect(world.hasResource(TextureRegistry)).toBe(true)
      world.removeResource(TextureRegistry)
      expect(world.hasResource(TextureRegistry)).toBe(false)
    })

    it('should throw when adding resource of same type', () => {
      const world = new EcsWorld()
      world.addResource(new ConfigResource(false))
      expect(() => world.addResource(new ConfigResource(true))).toThrow()
    })

    it('should allow multiple different resource types', () => {
      const world = new EcsWorld()
      const textures = world.addResource(new TextureRegistry())
      const config = world.addResource(new ConfigResource(true))
      expect(world.getResource(TextureRegistry)).toBe(textures)
      expect(world.getResource(ConfigResource)).toBe(config)
    })

    it('should allow resource data manipulation', () => {
      const world = new EcsWorld()
      const registry = world.addResource(new TextureRegistry())
      registry.register('player', '/textures/player.png')
      registry.register('enemy', '/textures/enemy.png')
      const retrieved = world.getResource(TextureRegistry)
      expect(retrieved?.get('player')).toBe('/textures/player.png')
      expect(retrieved?.get('enemy')).toBe('/textures/enemy.png')
    })

    it('should handle removing non-existent resource gracefully', () => {
      const world = new EcsWorld()
      expect(() => world.removeResource(TextureRegistry)).not.toThrow()
    })
  })

  describe('world lifecycle', () => {
    it('should destroy the world and clear all data', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(10, 20))
      world.addSystem(new MovementSystem(world))
      world.addResource(new TextureRegistry())

      world.dispose()

      // Entities should be cleared
      expect(world.exists(entity)).toBe(false)
      // Components should be cleared
      expect(world.hasComponent(entity, PositionComponent)).toBe(false)
      // Resources should be cleared
      expect(world.hasResource(TextureRegistry)).toBe(false)
    })

    it('should destroy the world when we call "[Symbol.dispose]()"', () => {
      const world = new EcsWorld()
      const entity = world.spawn()
      world.addComponent(entity, new PositionComponent(10, 20))
      world.addSystem(new MovementSystem(world))
      world.addResource(new TextureRegistry())
      world[Symbol.dispose]()
      expect(world.exists(entity)).toBe(false)
      expect(world.hasComponent(entity, PositionComponent)).toBe(false)
      expect(world.hasResource(TextureRegistry)).toBe(false)
    })

    it('should call onDestroy on all systems when world is destroyed', () => {
      const world = new EcsWorld()
      const system = new LifecycleSystem(world)
      world.addSystem(system)
      expect(system.destroyed).toBe(false)
      world.dispose()
      expect(system.destroyed).toBe(true)
    })
  })

  describe('events', () => {
    it('should dispatch entityCreated event', () => {
      const world = new EcsWorld()
      const handler = vi.fn()
      world.on('spawned', handler)
      const entity = world.spawn()
      expect(handler).toHaveBeenCalledWith(entity)
    })

    it('should dispatch entityDestroyed event', () => {
      const world = new EcsWorld()
      const handler = vi.fn()
      world.on('destroyed', handler)
      const entity = world.spawn()
      world.destroy(entity)
      expect(handler).toHaveBeenCalledWith(entity)
    })

    it('should dispatch componentAdded event', () => {
      const world = new EcsWorld()
      const handler = vi.fn()
      world.on('added', handler)
      const entity = world.spawn()
      const position = new PositionComponent(10, 20)
      world.addComponent(entity, position)
      expect(handler).toHaveBeenCalledWith(entity, position)
    })

    it('should dispatch componentRemoved event', () => {
      const world = new EcsWorld()
      const handler = vi.fn()
      world.on('removed', handler)
      const entity = world.spawn()
      const position = new PositionComponent(10, 20)
      world.addComponent(entity, position)
      world.removeComponent(entity, PositionComponent)
      expect(handler).toHaveBeenCalledWith(entity, position)
    })

    it('should dispatch "updated" event when system updates', () => {
      const world = new EcsWorld()
      const handler = vi.fn()
      world.on('updated', handler)
      const system = new MovementSystem(world)
      world.addSystem(system)
      world.update(16)
      expect(handler).toHaveBeenCalledWith(system, 16)
    })

    it('should dispatch "error" event but not rethrow when onUpdate throws', () => {
      const world = new EcsWorld()
      const handler = vi.fn()
      world.on('error', handler)
      const system = new ErrorOnUpdateSystem(world)
      world.addSystem(system)
      expect(() => world.update(16)).not.toThrow()
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(system, expect.any(Error))
    })
  })

  describe('plugin management', () => {
    it('should add a plugin to the world', () => {
      const world = new EcsWorld()
      const plugin = new CorePlugin()
      world.addPlugin(plugin)
      expect(plugin.built).toBe(true)
      expect(world.hasPlugin(CorePlugin)).toBe(true)
    })

    it('should add multiple plugins at once', () => {
      const world = new EcsWorld()
      const [core, physics] = world.addPlugins(new CorePlugin(), new PhysicsPlugin())
      expect(core.built).toBe(true)
      expect(physics.built).toBe(true)
    })

    it('should check if plugin exists', () => {
      const world = new EcsWorld()
      expect(world.hasPlugin(CorePlugin)).toBe(false)
      world.addPlugin(new CorePlugin())
      expect(world.hasPlugin(CorePlugin)).toBe(true)
    })

    it('should prevent duplicate plugin registration', () => {
      const world = new EcsWorld()
      const plugin1 = new CorePlugin()
      const plugin2 = new CorePlugin()
      world.addPlugin(plugin1)
      world.addPlugin(plugin2)
      expect(plugin1.built).toBe(true)
      expect(plugin2.built).toBe(false) // Should not be built again
    })

    it('should automatically resolve dependencies', () => {
      const world = new EcsWorld()
      const physics = new PhysicsPlugin()
      world.addPlugin(physics)
      expect(world.hasPlugin(CorePlugin)).toBe(true)
      expect(world.hasPlugin(PhysicsPlugin)).toBe(true)
    })

    it('should resolve nested dependencies', () => {
      const world = new EcsWorld()
      const game = new GamePlugin()
      world.addPlugin(game)
      expect(world.hasPlugin(CorePlugin)).toBe(true)
      expect(world.hasPlugin(PhysicsPlugin)).toBe(true)
      expect(world.hasPlugin(RenderingPlugin)).toBe(true)
      expect(world.hasPlugin(GamePlugin)).toBe(true)
    })

    it('should not add dependency twice if already present', () => {
      const world = new EcsWorld()
      const core = new CorePlugin()
      world.addPlugin(core)
      world.addPlugin(new PhysicsPlugin())
      // CorePlugin should only be built once
      expect(core.built).toBe(true)
      expect(world.hasPlugin(CorePlugin)).toBe(true)
    })

    it('should remove a plugin and call cleanup', () => {
      const world = new EcsWorld()
      const plugin = new CorePlugin()
      world.addPlugin(plugin)
      world.removePlugin(CorePlugin)
      expect(plugin.cleanedUp).toBe(true)
      expect(world.hasPlugin(CorePlugin)).toBe(false)
    })

    it('should handle removing non-existent plugin gracefully', () => {
      const world = new EcsWorld()
      expect(() => world.removePlugin(CorePlugin)).not.toThrow()
    })

    it('should call cleanup on all plugins when world is disposed', () => {
      const world = new EcsWorld()
      const core = new CorePlugin()
      world.addPlugin(core)
      world.addPlugin(new PhysicsPlugin())
      world.dispose()
      expect(core.cleanedUp).toBe(true)
      expect(world.hasPlugin(CorePlugin)).toBe(false)
    })

    it('should call cleanup in reverse order when world is disposed', () => {
      const cleanupOrder: string[] = []

      class FirstPlugin extends EcsPlugin {
        build(_world: EcsWorld): void {}
        cleanup(_world: EcsWorld): void {
          cleanupOrder.push('first')
        }
      }

      class SecondPlugin extends EcsPlugin {
        build(_world: EcsWorld): void {}
        cleanup(_world: EcsWorld): void {
          cleanupOrder.push('second')
        }
      }

      const world = new EcsWorld()
      world.addPlugin(new FirstPlugin())
      world.addPlugin(new SecondPlugin())
      world.dispose()
      expect(cleanupOrder).toEqual(['second', 'first'])
    })

    it('should allow plugins to add systems and resources', () => {
      const world = new EcsWorld()
      world.addPlugin(new PhysicsPlugin())
      expect(world.hasResource(ConfigResource)).toBe(true)
      // Verify the system works by updating
      const entity = world.spawn(new PositionComponent(0, 0), new VelocityComponent(10, 5))
      world.update(1)
      const position = world.getComponent(entity, PositionComponent)
      expect(position?.x).toBe(10)
      expect(position?.y).toBe(5)
    })
  })

  describe('system ordering', () => {
    it('should run systems in dependency order using runAfter', () => {
      const world = new EcsWorld()
      const executionOrder: EcsSystem[] = []
      world.on('updated', system => executionOrder.push(system))

      // Add systems in reverse order
      world.addSystem(new RenderSystem(world))
      world.addSystem(new PhysicsSystem(world))
      world.addSystem(new InputSystem(world))
      world.update(16)

      // Despite being added in reverse, they should run in correct order
      expect(executionOrder[0]).toBeInstanceOf(InputSystem)
      expect(executionOrder[1]).toBeInstanceOf(PhysicsSystem)
      expect(executionOrder[2]).toBeInstanceOf(RenderSystem)
    })

    it('should run systems in dependency order using runBefore', () => {
      const world = new EcsWorld()
      const executionOrder: EcsSystem[] = []
      world.on('updated', system => executionOrder.push(system))

      // AudioSystem has runBefore = [RenderSystem]
      world.addSystem(new RenderSystem(world))
      world.addSystem(new PhysicsSystem(world))
      world.addSystem(new InputSystem(world))
      world.addSystem(new AudioSystem(world))
      world.update(16)

      // AudioSystem should run before RenderSystem
      const audioIndex = executionOrder.findIndex(s => s instanceof AudioSystem)
      const renderIndex = executionOrder.findIndex(s => s instanceof RenderSystem)
      expect(audioIndex).toBeLessThan(renderIndex)
    })

    it('should throw on circular dependencies', () => {
      const world = new EcsWorld()
      world.addSystem(new CyclicSystemA(world))
      world.addSystem(new CyclicSystemB(world))
      expect(() => world.update(16)).toThrow(/Circular dependency detected/)
    })

    it('should invalidate cache when systems are added', () => {
      const world = new EcsWorld()
      const executionOrder: EcsSystem[] = []
      world.on('updated', system => executionOrder.push(system))

      world.addSystem(new InputSystem(world))
      world.update(16)
      expect(executionOrder).toHaveLength(1)
      expect(executionOrder[0]).toBeInstanceOf(InputSystem)

      executionOrder.length = 0
      world.addSystem(new PhysicsSystem(world))
      world.update(16)

      // After adding PhysicsSystem, the order should be recalculated
      // PhysicsSystem depends on InputSystem, so InputSystem runs first
      expect(executionOrder).toHaveLength(2)
      expect(executionOrder[0]).toBeInstanceOf(InputSystem)
      expect(executionOrder[1]).toBeInstanceOf(PhysicsSystem)
    })

    it('should invalidate cache when systems are removed', () => {
      const world = new EcsWorld()
      const executionOrder: EcsSystem[] = []
      world.on('updated', system => executionOrder.push(system))

      world.addSystem(new InputSystem(world))
      world.addSystem(new PhysicsSystem(world))
      world.addSystem(new RenderSystem(world))
      world.update(16)
      expect(executionOrder).toHaveLength(3)
      expect(executionOrder[0]).toBeInstanceOf(InputSystem)
      expect(executionOrder[1]).toBeInstanceOf(PhysicsSystem)
      expect(executionOrder[2]).toBeInstanceOf(RenderSystem)

      executionOrder.length = 0
      world.removeSystem(PhysicsSystem)
      world.update(16)

      // PhysicsSystem removed, order should be recalculated
      expect(executionOrder).toHaveLength(2)
      expect(executionOrder[0]).toBeInstanceOf(InputSystem)
      expect(executionOrder[1]).toBeInstanceOf(RenderSystem)
    })

    it('should handle systems without dependencies', () => {
      const world = new EcsWorld()
      world.addSystem(new MovementSystem(world))
      world.addSystem(new HealthSystem(world))
      // Should not throw and should execute both systems
      expect(() => world.update(16)).not.toThrow()
    })

    it('should ignore missing dependencies', () => {
      const world = new EcsWorld()
      const executionOrder: EcsSystem[] = []
      world.on('updated', system => executionOrder.push(system))

      // PhysicsSystem has runAfter = [InputSystem], but InputSystem is not added
      world.addSystem(new PhysicsSystem(world))
      world.addSystem(new RenderSystem(world))

      // Should not throw and should still respect the partial order
      expect(() => world.update(16)).not.toThrow()
      expect(executionOrder.some(s => s instanceof PhysicsSystem)).toBe(true)
      expect(executionOrder.some(s => s instanceof RenderSystem)).toBe(true)
    })
  })
})
