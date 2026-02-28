/* eslint-disable sonarjs/redundant-type-aliases */
import type { Constructor } from '@unshared/types'
import { Emitter } from './createEmitter'
import { Dirty } from './dirty'

/** Unique identifier for an entity. */
export type EcsEntity = number

/**
 * Base class for all components. Components are pure data containers.
 * Here we leverage TypeScript's class system to define components and
 * use their constructors as type identifiers.
 */
export abstract class EcsComponent extends Dirty {}

/**
 * Base class for world resources. Resources are singleton data containers
 * that exist outside the entity-component model, used for global state
 * like asset registries, configuration, or shared caches.
 */
export abstract class EcsResource extends Dirty {}

/**
 * Base class for all systems. Systems contain the logic that operates
 * on entities and their components. As a rule of thumb, systems should
 * be stateless and operate only on the data provided by components. If methods
 * are used within systems, they should only manipulate the data of components.
 *
 * @example
 * class RenderSystem extends EcsSystem {
 *   onUpdate(deltaTime: number) {
 *     // Render logic
 *   }
 * }
 *
 * // Create with fluent ordering API
 * new RenderSystem(world)
 *   .updateAfter(PhysicsSystem)
 *   .withPriority(EcsSystem.Priority.PostUpdate)
 */
export abstract class EcsSystem {

  /** The priority of this system instance. Lower values run first. */
  private internalPriority = 0

  /** List of system types that this system should run after. */
  private internalUpdateAfter: Array<Constructor<EcsSystem>> = []

  /** List of system types that this system should run before. */
  private internalUpdateBefore: Array<Constructor<EcsSystem>> = []

  /**
   * Initialize the system with a reference to the world.
   *
   * @param world The ECS world instance.
   */
  constructor(protected world: EcsWorld) {}

  /**
   * Get the priority of this system.
   *
   * @returns The priority value.
   */
  get priority(): number {
    return this.internalPriority
  }

  /**
   * Get the list of system types that this system should run after.
   *
   * @returns Array of system types.
   */
  get shouldUpdateAfter(): Array<Constructor<EcsSystem>> {
    return this.internalUpdateAfter
  }

  /**
   * Get the list of system types that this system should run before.
   *
   * @returns Array of system types.
   */
  get shouldUpdateBefore(): Array<Constructor<EcsSystem>> {
    return this.internalUpdateBefore
  }

  /**
   * Set the priority of this system. Lower values run first.
   *
   * @param priority The priority value or `EcsSystem.Priority` enum value.
   * @returns This system instance for chaining.
   * @example
   * new RenderSystem(world).withPriority(EcsSystem.Priority.Last)
   */
  withPriority(priority: number): this {
    this.internalPriority = priority
    return this
  }

  /**
   * Specify that this system should run after the given system types.
   * The execution order will be resolved using topological sort within the same priority.
   *
   * @param systems The system types that this system should run after.
   * @returns This system instance for chaining.
   * @example
   * new RenderSystem(world).updateAfter(PhysicsSystem, MovementSystem)
   */
  updateAfter(...systems: Array<Constructor<EcsSystem>>): this {
    this.internalUpdateAfter.push(...systems)
    return this
  }

  /**
   * Specify that this system should run before the given system types.
   * The execution order will be resolved using topological sort within the same priority.
   *
   * @param systems The system types that this system should run before.
   * @returns This system instance for chaining.
   * @example
   * new AudioSystem(world).updateBefore(RenderSystem)
   */
  updateBefore(...systems: Array<Constructor<EcsSystem>>): this {
    this.internalUpdateBefore.push(...systems)
    return this
  }

  /**
   * Called when the system is first added to the world.
   */
  onCreate?(): void

  /**
   * Called when the system is removed from the world.
   */
  onDestroy?(): void

  /**
   * Update the system. Called every frame by the world.
   *
   * @param deltaTime Time elapsed since last update in milliseconds.
   */
  onUpdate?(deltaTime: number): void
}

export namespace EcsSystem {
  export enum Priority {

    /** Priority for systems that must run before all others. */
    First = -2000,

    /** Priority for systems in the pre-update phase (input, event processing). */
    PreUpdate = -1000,

    /** Priority for systems in the default update phase. */
    Update = 0,

    /** Priority for systems in the post-update phase (physics, transforms). */
    PostUpdate = 1000,

    /** Priority for systems that must run after all others (rendering, cleanup). */
    Last = 2000,
  }
}

/**
 * Base class for plugins. Plugins are self-contained modules that bundle
 * related systems, resources, and configuration together. They provide a
 * clean way to organize and share functionality across different worlds.
 *
 * @example
 * class PhysicsPlugin extends EcsPlugin {
 *   // Declare dependencies on other plugins
 *   dependencies = [CorePlugin]
 *
 *   build(world: EcsWorld) {
 *     world.addResource(new PhysicsConfig())
 *     world.addSystem(new GravitySystem(world))
 *     world.addSystem(new CollisionSystem(world).updateAfter(GravitySystem))
 *   }
 *
 *   cleanup(world: EcsWorld) {
 *     world.removeResource(PhysicsConfig)
 *     world.removeSystem(GravitySystem)
 *     world.removeSystem(CollisionSystem)
 *     world.removeSystem(WindSystem)
 *   }
 * }
 *
 * world.addPlugin(new PhysicsPlugin())
 */
export abstract class EcsPlugin {

  /**
   * Optional list of plugin types that this plugin depends on.
   * Dependencies are automatically resolved and added before this plugin.
   */
  dependencies?: Array<Constructor<EcsPlugin>>

  /**
   * Build the plugin by adding systems, resources, and other configuration
   * to the world. This is called when the plugin is added to the world.
   *
   * @param world The world to build the plugin in.
   */
  abstract build(world: EcsWorld): void

  /**
   * Optional cleanup method called when the plugin is removed or when
   * the world is destroyed. Use this to clean up any external resources
   * or subscriptions created by the plugin.
   *
   * @param world The world the plugin is being removed from.
   */
  cleanup?(world: EcsWorld): void
}

/**
 * Base class for bundles. Bundles are reusable collections of components
 * that are commonly spawned together. They simplify entity creation by
 * grouping related components into a single unit.
 *
 * @example
 * class TransformBundle extends EcsBundle {
 *   constructor(
 *     private x = 0,
 *     private y = 0,
 *   ) { super() }
 *
 *   components() {
 *     return [
 *       new Position(this.x, this.y),
 *       new Rotation(0),
 *       new Scale(1, 1),
 *     ]
 *   }
 * }
 *
 * class SpriteBundle extends EcsBundle {
 *   constructor(private texture: string) { super() }
 *
 *   // Bundles can include other bundles
 *   bundles() {
 *     return [new TransformBundle()]
 *   }
 *
 *   components() {
 *     return [
 *       new Sprite(this.texture),
 *       new Visible(true),
 *     ]
 *   }
 * }
 *
 * // Spawn an entity with all components from the bundle
 * const entity = world.spawn(new SpriteBundle('player.png'))
 */
export abstract class EcsBundle {

  /**
   * Return nested bundles that should be included.
   * Override this to compose bundles from other bundles.
   *
   * @returns An array of bundles to include, or undefined.
   */
  bundles?(): EcsBundle[]

  /**
   * Return the components that make up this bundle.
   *
   * @returns An array of component instances.
   */
  abstract components(): EcsComponent[]
}

export namespace EcsWorld {
  export interface Events {
    'spawned': [entity: EcsEntity]
    'destroyed': [entity: EcsEntity]
    'added': [entity: EcsEntity, component: EcsComponent]
    'removed': [entity: EcsEntity, component: EcsComponent]
    'beforeUpdate': [system: EcsSystem, deltaTime: number]
    'afterUpdate': [system: EcsSystem, elapsedTime: number]
    'error': [system: EcsSystem, error: Error]
  }

  /** A filter function for querying entities and components. */
  export type QueryFilter<T extends EcsComponent = EcsComponent> = (result: QueryResult<T>) => boolean

  /** A filter function for queryAll results. */
  export type QueryFilterAll<T extends EcsComponent[]> = (result: QueryResultAll<T>) => boolean

  /** A filter function for queryAny results. */
  export type QueryFilterAny<T extends EcsComponent[]> = (result: QueryResultAny<T>) => boolean

  /** Result object from a single-component query. */
  export interface QueryResult<T extends EcsComponent> {

    /** The entity ID. */
    entity: EcsEntity

    /** The component instance. */
    component: T
  }

  /** Result object from a multi-component query, providing convenient access to entity and components. */
  export interface QueryResultAll<T extends EcsComponent[]> {

    /** The entity ID. */
    entity: EcsEntity

    /** Array of components in query order. */
    components: T

    /** Get a specific component by type. */
    get: <C extends T[number]>(type: Constructor<C>) => C
  }

  /** Result object from a queryAny query, where entities match at least one component type. */
  export interface QueryResultAny<T extends EcsComponent[]> {

    /** The entity ID. */
    entity: EcsEntity

    /** Array of components in query order (undefined for missing components). */
    components: { [K in keyof T]: T[K] | undefined }

    /** Get a specific component by type, or undefined if not present. */
    get: <C extends T[number]>(type: Constructor<C>) => C | undefined

    /** Get a specific component by type, or throw if not present. */
    getOrFail: <C extends T[number]>(type: Constructor<C>) => C
  }
}

/**
 * Entity-Component-System (ECS) World class. Manages entities, components, and systems
 * in an ECS architecture pattern. This class provides the core functionality to create
 * highly interactive and modular applications, such as games, simulations or complex UIs.
 */
export class EcsWorld extends Emitter<EcsWorld.Events> {

  /** Map of component type to entity-component map. */
  private componentEntities = new Map<Constructor<EcsComponent>, Map<EcsEntity, EcsComponent>>()

  /** Reverse index: entity to set of component types it has. Also tracks entity existence. */
  private entityComponents = new Map<EcsEntity, Set<Constructor<EcsComponent>>>()

  /****************************************************/
  /* Component Registration.                          */
  /****************************************************/

  /** Set of explicitly registered component types (for strict mode). */
  private registeredComponents = new Set<Constructor<EcsComponent>>()

  /**
   * Register a component type with the world. This is optional unless strict mode
   * is enabled. Registering components upfront is useful for serialization,
   * editor tooling, or network synchronization.
   *
   * @param type The component type to register.
   * @returns This world instance for chaining.
   * @example world.registerComponent(PositionComponent)
   */
  registerComponent<T extends EcsComponent>(type: Constructor<T>): this {
    if (this.registeredComponents.has(type)) return this
    this.registeredComponents.add(type)

    // --- Pre-create the component map for this type.
    if (!this.componentEntities.has(type))
      this.componentEntities.set(type, new Map())

    return this
  }

  /**
   * Register multiple component types with the world.
   *
   * @param types The component types to register.
   * @returns This world instance for chaining.
   * @example world.registerComponents(PositionComponent, VelocityComponent, HealthComponent)
   */
  registerComponents(...types: Array<Constructor<EcsComponent>>): this {
    for (const type of types) this.registerComponent(type)
    return this
  }

  /**
   * Unregister a component type from the world. This removes the component type
   * from the registry but does not remove existing components of this type from
   * entities.
   *
   * @param type The component type to unregister.
   * @returns This world instance for chaining.
   * @example world.unregisterComponent(PositionComponent)
   */
  unregisterComponent<T extends EcsComponent>(type: Constructor<T>): this {
    this.registeredComponents.delete(type)
    return this
  }

  /**
   * Unregister multiple component types from the world.
   *
   * @param types The component types to unregister.
   * @returns This world instance for chaining.
   * @example world.unregisterComponents(PositionComponent, VelocityComponent)
   */
  unregisterComponents(...types: Array<Constructor<EcsComponent>>): this {
    for (const type of types) this.unregisterComponent(type)
    return this
  }

  /**
   * Check if a component type is registered.
   *
   * @param type The component type to check.
   * @returns True if the component type is registered.
   */
  isComponentRegistered<T extends EcsComponent>(type: Constructor<T>): boolean {
    return this.registeredComponents.has(type)
  }

  /**
   * Get all registered component types.
   *
   * @returns An array of registered component types.
   */
  getRegisteredComponents(): Array<Constructor<EcsComponent>> {
    return [...this.registeredComponents]
  }

  /****************************************************/
  /* Strict Component Mode.                           */
  /****************************************************/

  /** When true, only explicitly registered component types can be used. */
  private strictComponents = false

  /**
   * Enable or disable strict component mode. When enabled, only explicitly
   * registered component types can be added to entities. This is useful for
   * catching typos and ensuring a consistent schema.
   *
   * @param enabled Whether to enable strict mode.
   * @returns This world instance for chaining.
   * @example
   * world.registerComponents(PositionComponent, VelocityComponent)
   * world.setStrictComponents(true)
   * world.addComponent(entity, new UnregisteredComponent()) // throws Error
   */
  setStrictComponents(enabled: boolean): this {
    this.strictComponents = enabled
    return this
  }

  /**
   * Check if strict component mode is enabled.
   *
   * @returns True if strict component mode is enabled.
   */
  isStrictComponents(): boolean {
    return this.strictComponents
  }

  /****************************************************/
  /* Entity Management.                               */
  /****************************************************/

  /** Counter for generating unique entity IDs. */
  private nextEntityId: EcsEntity = 0

  /**
   * Spawn a new entity and return its ID. Optionally, you can pass components
   * and/or bundles to be added to the entity at creation time.
   *
   * @param spawnables Optional components or bundles to add to the entity.
   * @returns The newly created entity ID.
   * @example
   * // Create an empty entity
   * world.spawn() // 0
   *
   * // Create an entity with components
   * world.spawn(new PositionComponent(10, 20), new VelocityComponent(1, 2))
   *
   * // Create an entity with a bundle
   * world.spawn(new SpriteBundle('player.png'))
   *
   * // Mix components and bundles
   * world.spawn(new TransformBundle(), new Health(100), new PlayerTag())
   */
  spawn(...spawnables: Array<EcsBundle | EcsComponent>): EcsEntity {
    const entity = this.nextEntityId++
    this.entityComponents.set(entity, new Set())
    this.dispatch('spawned', entity)
    const components = this.resolveSpawnables(spawnables)
    for (const component of components) this.addComponent(entity, component)
    return entity
  }

  /**
   * Destroy an entity and all its components. If the entity has children
   * and recursive is true (default), they will be destroyed as well.
   *
   * @param entity The entity to destroy.
   * @param recursive If true (default), destroy all children recursively.
   * @example
   * world.destroy(entity) // Destroys entity and all children
   * world.destroy(entity, false) // Destroys only the entity, children become orphans
   */
  destroy(entity: EcsEntity, recursive = true): void {

    // --- Recursively destroy children first (depth-first).
    if (recursive) {
      const children = this.entityChildren.get(entity)
      if (children) {
        for (const child of children)
          this.destroy(child, true)
      }
    }

    // --- Remove this entity from its parent's children set.
    const parent = this.entityParent.get(entity)
    if (parent !== undefined)
      this.entityChildren.get(parent)?.delete(entity)
    this.entityParent.delete(entity)

    // --- If not recursive, orphan the children (remove their parent reference).
    if (!recursive) {
      const children = this.entityChildren.get(entity)
      if (children) {
        for (const child of children)
          this.entityParent.delete(child)
      }
    }
    this.entityChildren.delete(entity)

    // --- Use the reverse index to only iterate over component types this entity has.
    const componentTypes = this.entityComponents.get(entity)
    if (componentTypes) {
      for (const type of componentTypes) {
        const componentMap = this.componentEntities.get(type)
        if (componentMap) {
          const component = componentMap.get(entity)
          if (component) this.dispatch('removed', entity, component)
          componentMap.delete(entity)
        }
      }
      this.entityComponents.delete(entity)
    }

    this.dispatch('destroyed', entity)
  }

  /**
   * Check if an entity exists.
   *
   * @param entity The entity to check.
   * @returns True if the entity exists, false otherwise.
   * @example world.exists(0) // true or false
   */
  exists(entity: EcsEntity): boolean {
    return this.entityComponents.has(entity)
  }

  /****************************************************/
  /* Hierarchy System.                                */
  /****************************************************/

  /** Map of entity to its parent entity. */
  private entityParent = new Map<EcsEntity, EcsEntity>()

  /** Map of entity to its children entities. */
  private entityChildren = new Map<EcsEntity, Set<EcsEntity>>()

  /**
   * Spawn a new entity as a child of an existing entity.
   *
   * @param parent The parent entity.
   * @param spawnables Optional components or bundles to add to the child entity.
   * @returns The newly created child entity ID.
   * @example
   * const parent = world.spawn()
   * const child = world.spawnChild(parent, new Position(), new Velocity())
   *
   * // Spawn a child with a bundle
   * const child = world.spawnChild(parent, new SpriteBundle('child.png'))
   */
  spawnChild(parent: EcsEntity, ...spawnables: Array<EcsBundle | EcsComponent>): EcsEntity {
    const child = this.spawn(...spawnables)
    this.setParent(child, parent)
    return child
  }

  /**
   * Set the parent of an entity. This will update the hierarchy of both
   * the child and the parent. If the child already has a parent, it will
   * be removed from the old parent's children set.
   *
   * @param child The child entity.
   * @param parent The new parent entity, or undefined to remove the parent.
   * @returns This world instance for chaining.
   * @example
   * const parent = world.spawn()
   * const child = world.spawn()
   * world.setParent(child, parent)
   */
  setParent(child: EcsEntity, parent: EcsEntity | undefined): this {

    // --- Remove from old parent's children set.
    const oldParent = this.entityParent.get(child)
    if (oldParent !== undefined)
      this.entityChildren.get(oldParent)?.delete(child)

    // --- Clear parent if undefined.
    if (parent === undefined) {
      this.entityParent.delete(child)
      return this
    }

    // --- Set the new parent.
    this.entityParent.set(child, parent)

    // --- Add to new parent's children set.
    let children = this.entityChildren.get(parent)
    if (!children) {
      children = new Set()
      this.entityChildren.set(parent, children)
    }
    children.add(child)

    return this
  }

  /**
   * Get the parent entity of an entity.
   *
   * @param entity The entity to get the parent of.
   * @returns The parent entity, or undefined if the entity has no parent.
   */
  getParent(entity: EcsEntity): EcsEntity | undefined {
    return this.entityParent.get(entity)
  }

  /**
   * Get all direct children of an entity.
   *
   * @param entity The entity to get the children of.
   * @yields Each child entity ID.
   */
  * getChildren(entity: EcsEntity): IterableIterator<EcsEntity> {
    const children = this.entityChildren.get(entity)
    if (!children) return
    for (const child of children) yield child
  }

  /**
   * Get all ancestors of an entity (parent, grandparent, etc.).
   *
   * @param entity The entity to get ancestors of.
   * @yields Each ancestor entity ID.
   */
  * getAncestors(entity: EcsEntity): IterableIterator<EcsEntity> {
    let parent = this.entityParent.get(entity)
    while (parent !== undefined) {
      yield parent
      parent = this.entityParent.get(parent)
    }
  }

  /**
   * Get all descendants of an entity (children, grandchildren, etc.).
   *
   * @param entity The entity to get descendants of.
   * @yields Each descendant entity ID.
   */
  * getDescendants(entity: EcsEntity): IterableIterator<EcsEntity> {
    const children = this.entityChildren.get(entity)
    if (!children) return
    for (const child of children) {
      yield child
      yield* this.getDescendants(child)
    }
  }

  /**
   * Get the root ancestor of an entity (the topmost parent).
   *
   * @param entity The entity to get the root of.
   * @returns The root entity, or the entity itself if it has no parent.
   */
  getRoot(entity: EcsEntity): EcsEntity {
    let current = entity
    let parent = this.entityParent.get(current)
    while (parent !== undefined) {
      current = parent
      parent = this.entityParent.get(current)
    }
    return current
  }

  /**
   * Check if an entity has children.
   *
   * @param entity The entity to check.
   * @returns True if the entity has children.
   */
  hasChildren(entity: EcsEntity): boolean {
    const children = this.entityChildren.get(entity)
    return children !== undefined && children.size > 0
  }

  /**
   * Check if an entity has a parent.
   *
   * @param entity The entity to check.
   * @returns True if the entity has a parent.
   */
  hasParent(entity: EcsEntity): boolean {
    return this.entityParent.has(entity)
  }

  /**
   * Check if an entity is the parent of another.
   *
   * @param parent The potential parent entity.
   * @param child The potential child entity.
   * @returns True if parent is the parent of child.
   */
  isParentOf(parent: EcsEntity, child: EcsEntity): boolean {
    return this.entityParent.get(child) === parent
  }

  /**
   * Check if an entity is the child of another.
   *
   * @param child The potential child entity.
   * @param parent The potential parent entity.
   * @returns True if child is the child of parent.
   */
  isChildOf(child: EcsEntity, parent: EcsEntity): boolean {
    return this.isParentOf(parent, child)
  }

  /**
   * Check if one entity is an ancestor of another.
   *
   * @param ancestor The potential ancestor entity.
   * @param descendant The potential descendant entity.
   * @returns True if ancestor is an ancestor of descendant.
   */
  isAncestorOf(ancestor: EcsEntity, descendant: EcsEntity): boolean {
    let current = this.entityParent.get(descendant)
    while (current !== undefined) {
      if (current === ancestor) return true
      current = this.entityParent.get(current)
    }
    return false
  }

  /**
   * Check if one entity is a descendant of another.
   *
   * @param descendant The potential descendant entity.
   * @param ancestor The potential ancestor entity.
   * @returns True if descendant is a descendant of ancestor.
   */
  isDescendantOf(descendant: EcsEntity, ancestor: EcsEntity): boolean {
    return this.isAncestorOf(ancestor, descendant)
  }

  /**
   * Check if an entity is a root (has no parent).
   *
   * @param entity The entity to check.
   * @returns True if the entity is a root.
   */
  isRoot(entity: EcsEntity): boolean {
    return !this.hasParent(entity)
  }

  /****************************************************/
  /* Component Management.                            */
  /****************************************************/

  /**
   * Add one component to an entity.
   *
   * @param entity The entity to add the component to.
   * @param component The component to add.
   * @returns The added component.
   * @throws Error if strict mode is enabled and the component type is not registered.
   */
  addComponent<T extends EcsComponent>(entity: EcsEntity, component: T): T {
    const ctor = component.constructor as Constructor<EcsComponent>

    // --- In strict mode, reject unregistered component types.
    if (this.strictComponents && !this.registeredComponents.has(ctor))
      throw new Error(`Component type "${ctor.name}" is not registered. Register it with world.registerComponent() or disable strict mode.`)

    let componentMap = this.componentEntities.get(ctor)
    if (!componentMap) {
      componentMap = new Map()
      this.componentEntities.set(ctor, componentMap)
    }
    componentMap.set(entity, component)

    // --- Maintain reverse index for fast entity destruction.
    this.entityComponents.get(entity)?.add(ctor)

    this.dispatch('added', entity, component)
    return component
  }

  /**
   * Add one or more components to an entity.
   *
   * @param entity The entity to add the component to.
   * @param components The components to add.
   * @returns The added components.
   * @example
   * const component = new PositionComponent(10, 20)
   * world.addComponent(entity, component) // PositionComponent { x: 10, y: 20 }
   */
  addComponents<T extends EcsComponent[]>(entity: EcsEntity, ...components: T): T {
    for (const component of components) this.addComponent(entity, component)
    return components
  }

  /**
   * Get a component from an entity, or undefined if not found.
   *
   * @param entity The entity to get the component from.
   * @param type The component type to get.
   * @returns The component instance or undefined if not found.
   * @example world.getComponent(entity, PositionComponent) // PositionComponent { x: 10, y: 20 } or undefined
   */
  getComponent<T extends EcsComponent>(entity: EcsEntity, type: Constructor<T>): T | undefined {
    return this.componentEntities.get(type)?.get(entity) as T | undefined
  }

  /**
   * Get a component from an entity, or throw if not found.
   *
   * @param entity The entity to get the component from.
   * @param type The component type to get.
   * @returns The component instance.
   * @throws Error if the entity does not have the component.
   * @example world.getComponentOrFail(entity, PositionComponent) // PositionComponent { x: 10, y: 20 }
   */
  getComponentOrFail<T extends EcsComponent>(entity: EcsEntity, type: Constructor<T>): T {
    const component = this.getComponent(entity, type)
    if (!component) throw new Error(`Entity ${entity} does not have component of type ${type.name}`)
    return component
  }

  /**
   * Check if an entity has a component.
   *
   * @param entity The entity to check.
   * @param type The component type to check for.
   * @returns True if the entity has the component, false otherwise.
   */
  hasComponent<T extends EcsComponent>(entity: EcsEntity, type: Constructor<T>): boolean {
    return this.componentEntities.get(type)?.has(entity) ?? false
  }

  /**
   * Remove a component from an entity.
   *
   * @param entity The entity to remove the component from.
   * @param type The component type to remove.
   */
  removeComponent<T extends EcsComponent>(entity: EcsEntity, type: Constructor<T>): void {
    const componentMap = this.componentEntities.get(type)
    const component = componentMap?.get(entity)
    if (component) {
      this.dispatch('removed', entity, component)
      componentMap!.delete(entity)

      // --- Maintain reverse index.
      this.entityComponents.get(entity)?.delete(type)
    }
  }

  /****************************************************/
  /* Bundle Management.                               */
  /****************************************************/

  /**
   * Flatten a bundle into an array of components, resolving nested bundles.
   * Components from nested bundles are added first (depth-first), followed
   * by the bundle's own components.
   *
   * @param bundle The bundle to flatten.
   * @returns Array of all components from the bundle and its nested bundles.
   */
  private flattenBundle(bundle: EcsBundle): EcsComponent[] {
    const components: EcsComponent[] = []

    // --- Recursively collect components from nested bundles.
    const nestedBundles = bundle.bundles?.()
    if (nestedBundles) {
      for (const nested of nestedBundles)
        components.push(...this.flattenBundle(nested))
    }

    // --- Add this bundle's own components.
    components.push(...bundle.components())

    return components
  }

  /**
   * Resolve an array of spawnables (components and/or bundles) into a flat
   * array of components. Bundles are flattened recursively.
   *
   * @param spawnables The spawnables to resolve.
   * @returns Array of all components.
   */
  private resolveSpawnables(spawnables: Array<EcsBundle | EcsComponent>): EcsComponent[] {
    const components: EcsComponent[] = []
    for (const spawnable of spawnables) {
      if (spawnable instanceof EcsBundle) components.push(...this.flattenBundle(spawnable))
      else components.push(spawnable)
    }
    return components
  }

  /**
   * Add all components from a bundle to an existing entity.
   *
   * @param entity The entity to add components to.
   * @param bundle The bundle containing components to add.
   * @returns The added components.
   * @example
   * const entity = world.spawn()
   * world.addBundle(entity, new PhysicsBundle())
   */
  addBundle(entity: EcsEntity, bundle: EcsBundle): EcsComponent[] {
    const components = this.flattenBundle(bundle)
    return this.addComponents(entity, ...components)
  }

  /**
   * Add multiple bundles to an existing entity.
   *
   * @param entity The entity to add components to.
   * @param bundles The bundles containing components to add.
   * @returns The added components.
   * @example
   * const entity = world.spawn()
   * world.addBundles(entity, new PhysicsBundle(), new RenderBundle())
   */
  addBundles(entity: EcsEntity, ...bundles: EcsBundle[]): EcsComponent[] {
    const allComponents: EcsComponent[] = []
    for (const bundle of bundles) {
      const components = this.flattenBundle(bundle)
      allComponents.push(...components)
    }
    return this.addComponents(entity, ...allComponents)
  }

  /**
   * Remove all component types from a bundle from an entity.
   * This removes components matching the types in the bundle, not the
   * exact instances.
   *
   * @param entity The entity to remove components from.
   * @param bundle The bundle containing component types to remove.
   * @example
   * world.removeBundle(entity, new PhysicsBundle())
   */
  removeBundle(entity: EcsEntity, bundle: EcsBundle): void {
    const components = this.flattenBundle(bundle)
    for (const component of components) {
      const type = component.constructor as Constructor<EcsComponent>
      this.removeComponent(entity, type)
    }
  }

  /**
   * Remove multiple bundles from an entity.
   *
   * @param entity The entity to remove components from.
   * @param bundles The bundles containing component types to remove.
   * @example
   * world.removeBundles(entity, new PhysicsBundle(), new RenderBundle())
   */
  removeBundles(entity: EcsEntity, ...bundles: EcsBundle[]): void {
    for (const bundle of bundles) {
      const components = this.flattenBundle(bundle)
      for (const component of components) {
        const type = component.constructor as Constructor<EcsComponent>
        this.removeComponent(entity, type)
      }
    }
  }

  /****************************************************/
  /* Querying.                                        */
  /****************************************************/

  /**
   * Query all entities that have a specific component.
   *
   * **Note:** For performance optimization, the same result object is reused and mutated
   * on each iteration. If you need to store results, clone them before the next iteration.
   *
   * @param type The component type to query for.
   * @param filter Optional filter function to further refine results.
   * @yields Query result objects for each matching entity.
   */
  * query<T extends EcsComponent>(type: Constructor<T>, filter?: EcsWorld.QueryFilter<T>): IterableIterator<EcsWorld.QueryResult<T>> {
    const componentMap = this.componentEntities.get(type) as Map<EcsEntity, T> | undefined
    if (!componentMap) return

    // --- Reusable result object to avoid GC pressure.
    const result: EcsWorld.QueryResult<T> = {
      entity: 0 as EcsEntity,
      component: undefined as unknown as T,
    }

    // --- Iterate through all entities with the specified component.
    for (const [entity, component] of componentMap) {
      result.entity = entity
      result.component = component
      if (filter && !filter(result)) continue
      yield result
    }
  }

  /**
   * Query all entities that have all specified components.
   *
   * **Note:** For performance optimization, the same result object is reused and mutated
   * on each iteration. If you need to store results, clone them before the next iteration.
   *
   * @param types The component types to query for.
   * @param filter Optional filter function to further refine results.
   * @yields Query result objects for each matching entity.
   * @example
   * // Iterating directly (recommended)
   * for (const { entity, components } of world.queryAll([Position, Velocity])) {
   *   console.log(entity, components)
   * }
   *
   * // Storing results (must spread to clone)
   * const results = [...world.queryAll([Position, Velocity])].map(r => ({ ...r }))
   */
  * queryAll<T extends EcsComponent[]>(types: { [K in keyof T]: Constructor<T[K]> }, filter?: EcsWorld.QueryFilterAll<T>): IterableIterator<EcsWorld.QueryResultAll<T>> {
    const length = types.length
    if (length === 0) return

    // --- Find the smallest component map to iterate over (optimization).
    // --- Also bail early if any or the expected component maps are missing.
    let baseMap: Map<EcsEntity, EcsComponent> | undefined
    let smallestSize = Number.MAX_SAFE_INTEGER
    for (let i = 0; i < length; i++) {
      const map = this.componentEntities.get(types[i])
      if (!map) return
      if (map.size < smallestSize) {
        smallestSize = map.size
        baseMap = map
      }
    }

    // --- Reusable components array and result object to avoid allocations.
    const components = Array.from<EcsComponent>({ length })
    const result: EcsWorld.QueryResultAll<T> = {
      entity: 0,
      components: components as T,
      get: <C extends T[number]>(type: Constructor<C>): C => {
        const index = types.indexOf(type as Constructor<EcsComponent>)
        return components[index] as C
      },
    }

    // --- Directly access maps without creating intermediate arrays.
    for (const entity of baseMap!.keys()) {
      let hasAll = true
      for (let i = 0; i < length; i++) {
        const component = this.componentEntities.get(types[i])!.get(entity)
        if (component === undefined) {
          hasAll = false
          break
        }
        components[i] = component
      }

      if (!hasAll) continue
      result.entity = entity
      if (filter && !filter(result)) continue
      yield result
    }
  }

  /**
   * Query all entities that have at least one of the specified components.
   *
   * **Note:** For performance optimization, the same result object is reused and mutated
   * on each iteration. If you need to store results, clone them before the next iteration.
   *
   * @param types The component types to query for.
   * @param filter Optional filter function to further refine results.
   * @yields Query result objects for each matching entity.
   * @example
   * // Iterating directly (recommended)
   * for (const { entity, components } of world.queryAny([Position, Velocity])) {
   *   const pos = components[0] // Position | undefined
   *   const vel = components[1] // Velocity | undefined
   * }
   *
   * // Using getOrFail for required components
   * for (const result of world.queryAny([Position, Velocity])) {
   *   const pos = result.getOrFail(Position) // throws if not present
   * }
   */
  * queryAny<T extends EcsComponent[]>(types: { [K in keyof T]: Constructor<T[K]> }, filter?: EcsWorld.QueryFilterAny<T>): IterableIterator<EcsWorld.QueryResultAny<T>> {
    const length = types.length
    if (length === 0) return

    // --- Reusable components array and result object to avoid allocations.
    const components = Array.from<EcsComponent | undefined>({ length })
    const result: EcsWorld.QueryResultAny<T> = {
      entity: 0,
      components: components as { [K in keyof T]: T[K] | undefined },
      get: <C extends T[number]>(type: Constructor<C>): C | undefined => {
        const index = types.indexOf(type as Constructor<EcsComponent>)
        return components[index] as C | undefined
      },
      getOrFail: <C extends T[number]>(type: Constructor<C>): C => {
        const index = types.indexOf(type as Constructor<EcsComponent>)
        const component = components[index]
        if (component === undefined) throw new Error(`Entity ${result.entity} does not have component of type ${type.name}`)
        return component as C
      },
    }

    // --- Iterate through all entities and check if they have any of the requested components.
    for (const [entity, entityComponentTypes] of this.entityComponents) {
      let hasAny = false

      // --- Check each requested type and populate components array.
      for (let i = 0; i < length; i++) {
        const type = types[i]
        if (entityComponentTypes.has(type)) {
          components[i] = this.componentEntities.get(type)!.get(entity)
          hasAny = true
        }
        else {
          components[i] = undefined
        }
      }

      if (hasAny) {
        result.entity = entity
        if (filter && !filter(result)) continue
        yield result
      }
    }
  }

  /**
   * Get the first entity with a specific component.
   *
   * @param type The component type to query.
   * @param filter Optional filter function to further refine results.
   * @returns A query result object, or undefined if none found.
   */
  queryOne<T extends EcsComponent>(type: Constructor<T>, filter?: EcsWorld.QueryFilter<T>): EcsWorld.QueryResult<T> | undefined {
    const componentMap = this.componentEntities.get(type) as Map<EcsEntity, T> | undefined
    if (!componentMap) return undefined
    for (const [entity, component] of componentMap) {
      const result: EcsWorld.QueryResult<T> = { entity, component }
      if (filter && !filter(result)) continue
      return result
    }
    return undefined
  }

  /**
   * Get the first entity with a specific component, or throw if none found.
   *
   * @param type The component type to query.
   * @param filter Optional filter function to further refine results.
   * @returns A query result object.
   * @throws Error if no entity with the component is found.
   */
  queryOneOrFail<T extends EcsComponent>(type: Constructor<T>, filter?: EcsWorld.QueryFilter<T>): EcsWorld.QueryResult<T> {
    const result = this.queryOne(type, filter)
    if (!result) {
      throw filter
        ? new Error(`Could not find any entity with component of type "${type.name}" matching the filter`)
        : new Error(`Could not find any entity with component of type "${type.name}"`)
    }
    return result
  }

  /****************************************************/
  /* System Management.                               */
  /****************************************************/

  /** Registered systems in the world, keyed by their constructor type. */
  private systems = new Map<Constructor<EcsSystem>, EcsSystem>()

  /**
   * Register a single system with the world. Each system type can only be registered once.
   * Calls the system's `onCreate` lifecycle method after registration.
   *
   * @param system The system to add.
   * @returns The added system.
   * @example
   * const movementSystem = new MovementSystem(world)
   * world.addSystem(movementSystem)
   */
  addSystem<T extends EcsSystem>(system: T): T {
    const type = system.constructor as Constructor<EcsSystem>

    // --- Destroy the existing system if it exists.
    const existing = this.systems.get(type)
    existing?.onDestroy?.()

    // --- Add the new system and call onCreate.
    this.systems.set(type, system)
    this.invalidateSystemOrder()
    if (system.onCreate) system.onCreate()
    return system
  }

  /**
   * Register one or more systems with the world. Each system type can only be registered once.
   * Calls the system's `onCreate` lifecycle method after registration.
   *
   * @param systems The systems to add.
   * @returns The added systems.
   * @example
   * const movementSystem = new MovementSystem(world)
   * const renderingSystem = new RenderingSystem(world)
   * world.addSystems(movementSystem, renderingSystem)
   */
  addSystems<T extends EcsSystem[]>(...systems: T): T {
    for (const system of systems) this.addSystem(system)
    return systems
  }

  /**
   * Remove a system from the world by type.
   * Calls the system's `onDestroy` lifecycle method before removal.
   *
   * @param type The system type to remove.
   */
  removeSystem(type: Constructor<EcsSystem>): void {
    const system = this.systems.get(type)
    if (!system) return
    system.onDestroy?.()
    this.systems.delete(type)
    this.invalidateSystemOrder()
  }

  /**
   * Remove multiple systems from the world by type.
   * Calls each system's `onDestroy` lifecycle method before removal.
   *
   * @param types The system types to remove.
   * @example world.removeSystems(MovementSystem, RenderingSystem)
   */
  removeSystems(...types: Array<Constructor<EcsSystem>>): void {
    for (const type of types) this.removeSystem(type)
  }

  /****************************************************/
  /* Sorting Systems.                                 */
  /****************************************************/

  /** Cached sorted order of systems for execution. Invalidated when systems change. */
  private sortedSystems: EcsSystem[] | undefined

  /**
   * Add an edge in the system dependency graph. Only adds the edge if it
   * doesn't already exist to prevent duplicate counting in topological sort.
   *
   * @param from The system type that runs first.
   * @param to The system type that runs after.
   * @param edges The adjacency list.
   * @param inDegree The in-degree map.
   */
  private addSystemEdge(
    from: Constructor<EcsSystem>,
    to: Constructor<EcsSystem>,
    edges: Map<Constructor<EcsSystem>, Set<Constructor<EcsSystem>>>,
    inDegree: Map<Constructor<EcsSystem>, number>,
  ): void {
    const edgeSet = edges.get(from)!
    if (edgeSet.has(to)) return // Edge already exists, don't increment inDegree again
    edgeSet.add(to)
    inDegree.set(to, inDegree.get(to)! + 1)
  }

  private sortSystemGroup(
    systemTypes: Array<Constructor<EcsSystem>>,
    systemMap: Map<Constructor<EcsSystem>, EcsSystem>,
  ): EcsSystem[] {
    if (systemTypes.length === 0) return []

    const typeSet = new Set(systemTypes)

    // --- Check for self-referential cycles before early return.
    for (const type of systemTypes) {
      const system = systemMap.get(type)!
      if (system.shouldUpdateAfter.includes(type))
        throw new Error(`Circular dependency detected among systems: ${type.name}`)
      if (system.shouldUpdateBefore.includes(type))
        throw new Error(`Circular dependency detected among systems: ${type.name}`)
    }

    if (systemTypes.length === 1) return [systemMap.get(systemTypes[0])!]

    // --- Build adjacency list: edges go from "runs before" to "runs after".
    const inDegree = new Map<Constructor<EcsSystem>, number>()
    const edges = new Map<Constructor<EcsSystem>, Set<Constructor<EcsSystem>>>()

    // --- Initialize.
    for (const type of systemTypes) {
      inDegree.set(type, 0)
      edges.set(type, new Set())
    }

    // --- Process runAfter: if A.runAfter includes B, then B -> A (B runs before A).
    // --- Only consider dependencies within the same priority group.
    for (const type of systemTypes) {
      const system = systemMap.get(type)!
      for (const dependency of system.shouldUpdateAfter)
        if (typeSet.has(dependency)) this.addSystemEdge(dependency, type, edges, inDegree)
    }

    // --- Process runBefore: if A.runBefore includes B, then A -> B (A runs before B).
    // --- Only consider dependencies within the same priority group.
    for (const type of systemTypes) {
      const system = systemMap.get(type)!
      for (const successor of system.shouldUpdateBefore)
        if (typeSet.has(successor)) this.addSystemEdge(type, successor, edges, inDegree)
    }

    // --- Kahn's algorithm: start with nodes that have no incoming edges.
    // --- Use deterministic tie-breaking by class name to avoid insertion-order dependency.
    const queue: Array<Constructor<EcsSystem>> = []
    for (const [type, degree] of inDegree)
      if (degree === 0) queue.push(type)
    queue.sort((a, b) => a.name.localeCompare(b.name))

    const sorted: Array<Constructor<EcsSystem>> = []
    while (queue.length > 0) {
      const current = queue.shift()!
      sorted.push(current)

      // --- Collect neighbors that become ready, then sort before adding to queue.
      const ready: Array<Constructor<EcsSystem>> = []
      for (const neighbor of edges.get(current)!) {
        const newDegree = inDegree.get(neighbor)! - 1
        inDegree.set(neighbor, newDegree)
        if (newDegree === 0) ready.push(neighbor)
      }
      ready.sort((a, b) => a.name.localeCompare(b.name))
      queue.push(...ready)
    }

    // --- Check for cycles.
    if (sorted.length !== systemTypes.length) {
      const remaining = systemTypes.filter(t => !sorted.includes(t)).map(t => t.name)
      throw new Error(`Circular dependency detected among systems: ${remaining.join(', ')}`)
    }

    return sorted.map(type => systemMap.get(type)!)
  }

  /**
   * Perform a topological sort on systems based on their runBefore/runAfter dependencies.
   * Uses Kahn's algorithm to detect cycles and produce a valid execution order.
   *
   * @returns Sorted array of systems.
   * @throws Error if a circular dependency is detected.
   */
  private sortSystems(): EcsSystem[] {
    const systemTypes = [...this.systems.keys()]
    const systemMap = this.systems

    // --- Group systems by priority.
    const priorityGroups = new Map<number, Array<Constructor<EcsSystem>>>()
    for (const type of systemTypes) {
      const system = systemMap.get(type)!
      const priority = system.priority
      if (!priorityGroups.has(priority)) priorityGroups.set(priority, [])
      priorityGroups.get(priority)!.push(type)
    }

    // --- Sort priorities (lower runs first).
    const sortedPriorities = [...priorityGroups.keys()].toSorted((a, b) => a - b)

    // --- Sort each group independently, then concatenate.
    const result: EcsSystem[] = []
    for (const priority of sortedPriorities) {
      const group = priorityGroups.get(priority)!
      const sortedGroup = this.sortSystemGroup(group, systemMap)
      result.push(...sortedGroup)
    }

    return result
  }

  /**
   * Get the sorted list of systems for execution. Caches the result until
   * systems are added or removed.
   *
   * @returns Sorted array of systems.
   */
  private getSortedSystems(): EcsSystem[] {
    this.sortedSystems ??= this.sortSystems()
    return this.sortedSystems
  }

  /**
   * Invalidate the sorted systems cache. Called when systems are added or removed.
   */
  private invalidateSystemOrder(): void {
    this.sortedSystems = undefined
  }

  /****************************************************/
  /* Resource Management.                             */
  /****************************************************/

  /** Global resources, keyed by their constructor type. */
  private resources = new Map<Constructor<EcsResource>, EcsResource>()

  /**
   * Add a single resource to the world. Resources are singletons that exist
   * outside the entity-component model for global state like asset
   * registries, configuration, or shared caches.
   *
   * @param resource The resource to add.
   * @returns The added resource.
   * @throws Error if a resource of the same type already exists.
   * @example
   * const textures = new TextureRegistry()
   * world.addResource(textures)
   */
  addResource<T extends EcsResource>(resource: T): T {
    const type = resource.constructor as Constructor<T>
    const exists = this.resources.has(type)
    if (exists) throw new Error(`Resource of type "${type.name}" already exists in the world`)
    this.resources.set(type, resource)
    return resource
  }

  /**
   * Add one or more resources to the world. Resources are singletons that exist
   * outside the entity-component model for global state like asset
   * registries, configuration, or shared caches.
   *
   * @param resources The resources to add.
   * @returns The added resources.
   * @throws Error if a resource of the same type already exists.
   * @example
   * const textures = new TextureRegistry()
   * const sounds = new SoundRegistry()
   * world.addResources(textures, sounds)
   */
  addResources<T extends EcsResource[]>(...resources: T): T {
    for (const resource of resources) this.addResource(resource)
    return resources
  }

  /**
   * Get a resource by type.
   *
   * @param type The resource type to get.
   * @returns The resource instance or undefined if not found.
   * @example world.getResource(TextureRegistry)
   */
  getResource<T extends EcsResource>(type: Constructor<T>): T {
    const resource = this.resources.get(type)
    if (!resource) throw new Error(`Resource of type ${type.name} does not exist in the world`)
    return resource as T
  }

  /**
   * Check if a resource exists.
   *
   * @param type The resource type to check.
   * @returns True if the resource exists.
   */
  hasResource<T extends EcsResource>(type: Constructor<T>): boolean {
    return this.resources.has(type)
  }

  /**
   * Remove a resource from the world.
   *
   * @param type The resource type to remove.
   */
  removeResource<T extends EcsResource>(type: Constructor<T>): void {
    this.resources.delete(type)
  }

  /**
   * Remove multiple resources from the world.
   *
   * @param types The resource types to remove.
   * @example world.removeResources(TextureRegistry, SoundRegistry)
   */
  removeResources(...types: Array<Constructor<EcsResource>>): void {
    for (const type of types) this.removeResource(type)
  }

  /****************************************************/
  /* Plugin Management.                               */
  /****************************************************/

  /** Registered plugins in the world, keyed by their constructor type. */
  private plugins = new Map<Constructor<EcsPlugin>, EcsPlugin>()

  /**
   * Add a plugin to the world. Plugins are self-contained modules that bundle
   * related systems, resources, and configuration together. Dependencies are
   * automatically resolved and added before the plugin.
   *
   * @param plugin The plugin to add.
   * @returns The added plugin.
   * @example
   * world.addPlugin(new PhysicsPlugin())
   */
  addPlugin<T extends EcsPlugin>(plugin: T): T {
    const type = plugin.constructor as Constructor<EcsPlugin>

    // --- Skip if the plugin is already registered.
    if (this.plugins.has(type)) return plugin

    // --- Resolve and add dependencies first.
    if (plugin.dependencies) {
      for (const DependencyType of plugin.dependencies) {
        if (!this.plugins.has(DependencyType)) {
          const dependency = new DependencyType()
          this.addPlugin(dependency)
        }
      }
    }

    // --- Register and build the plugin.
    this.plugins.set(type, plugin)
    plugin.build(this)
    return plugin
  }

  /**
   * Add one or more plugins to the world.
   *
   * @param plugins The plugins to add.
   * @returns The added plugins.
   * @example
   * world.addPlugins(new PhysicsPlugin(), new RenderingPlugin())
   */
  addPlugins<T extends EcsPlugin[]>(...plugins: T): T {
    for (const plugin of plugins) this.addPlugin(plugin)
    return plugins
  }

  /**
   * Check if a plugin is registered.
   *
   * @param type The plugin type to check.
   * @returns True if the plugin is registered.
   */
  hasPlugin<T extends EcsPlugin>(type: Constructor<T>): boolean {
    return this.plugins.has(type)
  }

  /**
   * Remove a plugin from the world. Calls the plugin's `cleanup` method
   * if defined.
   *
   * @param type The plugin type to remove.
   */
  removePlugin<T extends EcsPlugin>(type: Constructor<T>): void {
    const plugin = this.plugins.get(type)
    if (!plugin) return
    plugin.cleanup?.(this)
    this.plugins.delete(type)
  }

  /**
   * Remove multiple plugins from the world. Calls each plugin's `cleanup` method
   * if defined.
   *
   * @param types The plugin types to remove.
   */
  removePlugins(...types: Array<Constructor<EcsPlugin>>): void {
    for (const type of types) this.removePlugin(type)
  }

  /****************************************************/
  /* Lifecycle.                                       */
  /****************************************************/

  /**
   * Update all systems in their sorted order based on dependencies.
   *
   * @param deltaTime Time elapsed since last update in milliseconds.
   */
  update(deltaTime: number): void {
    for (const system of this.getSortedSystems()) {
      if (system.onUpdate) {
        try {
          this.dispatch('beforeUpdate', system, deltaTime)
          const startTime = performance.now()
          system.onUpdate(deltaTime)
          const elapsedTime = performance.now() - startTime
          this.dispatch('afterUpdate', system, elapsedTime)
        }
        catch (error) {
          this.dispatch('error', system, error as Error)
        }
      }
    }
  }

  /** Handle for the animation frame loop. */
  animationFrameLoopHandle: number | undefined = undefined

  /**
   * Start the loop using `requestAnimationFrame` to update systems.
   *
   * @param onFrame Optional callback invoked each frame with deltaTime.
   */
  startLoop(onFrame?: (deltaTime: number) => void): void {
    if (this.animationFrameLoopHandle !== undefined) throw new Error('EcsWorld loop is already running')
    let lastTime = performance.now()
    const loop = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time
      if (onFrame) onFrame(deltaTime)
      else this.update(deltaTime)
      this.animationFrameLoopHandle = requestAnimationFrame(loop)
    }
    this.animationFrameLoopHandle = requestAnimationFrame(loop)
  }

  /**
   * Stop the animation frame loop if running.
   */
  stopLoop(): void {
    if (this.animationFrameLoopHandle === undefined) return
    cancelAnimationFrame(this.animationFrameLoopHandle)
    this.animationFrameLoopHandle = undefined
  }

  /**
   * Destroy the world, removing all entities, components, systems, plugins, and resources.
   * Calls `onDestroy` on all systems and `cleanup` on all plugins before clearing.
   */
  dispose(): void {

    // --- Clear animation frame loop if running.
    this.stopLoop()

    // --- Call onDestroy on all systems.
    for (const system of this.systems.values()) system.onDestroy?.()

    // --- Call cleanup on all plugins (in reverse order for proper teardown).
    const pluginArray = [...this.plugins.values()].toReversed()
    for (const plugin of pluginArray) plugin.cleanup?.(this)

    // --- Clear all systems, entities, components, plugins, and resources.
    // --- This will be picked up by garbage collection.
    this.nextEntityId = 0
    this.systems.clear()
    this.entityComponents.clear()
    this.componentEntities.clear()
    this.entityParent.clear()
    this.entityChildren.clear()
    this.resources.clear()
    this.plugins.clear()
    this.registeredComponents.clear()
    this.strictComponents = false
  }

  /**
   * Dispose the world by calling destroy.
   */
  [Symbol.dispose](): void {
    this.dispose()
  }
}

/**
 * Create a new Entity-Component-System (ECS) world instance. The world manages
 * entities, components, systems, resources, and plugins in an ECS architecture
 * pattern.
 *
 * @returns A new EcsWorld instance.
 * @example
 * // Create a new ECS world.
 * const world = createEcs()
 *
 * // Define components.
 * class Position extends EcsComponent { x = 0; y = 0 }
 * class Velocity extends EcsComponent { dx = 0; dy = 0 }
 *
 * // Spawn entities with components.
 * const entity = world.spawn(new Position(), new Velocity())
 *
 * // Query and update entities.
 * for (const { entity, components } of world.queryAll([Position, Velocity])) {
 *   const [pos, vel] = components
 *   pos.x += vel.dx
 *   pos.y += vel.dy
 * }
 */
export function createEcs(): EcsWorld {
  return new EcsWorld()
}
