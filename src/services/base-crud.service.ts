import { simulateApiDelay } from "@/services/api-delay.service";
import { authService } from "@/services/auth.service";

type EntityWithId = {
  id?: string;
};

type EntityPayload<TEntity extends EntityWithId> = Omit<TEntity, "id">;

interface LocalStorageCrudConfig<TEntity extends EntityWithId> {
  storageKey: string;
  initialData: TEntity[];
  idPrefix: string;
  entityName: string;
  apiDelayMs?: number;
  normalizePayload?: (
    payload: EntityPayload<TEntity>,
  ) => EntityPayload<TEntity>;
  getConflictMessage?: (
    entities: TEntity[],
    payload: EntityPayload<TEntity>,
    excludedId?: string,
  ) => string | undefined;
}

const clone = <T>(data: T): T => structuredClone(data);

const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const createLocalStorageCrudService = <TEntity extends EntityWithId>(
  config: LocalStorageCrudConfig<TEntity>,
) => {
  const delayMs = config.apiDelayMs;

  const save = (entities: TEntity[]) => {
    localStorage.setItem(config.storageKey, JSON.stringify(entities));
  };

  const resetData = (): TEntity[] => {
    const initialData = clone(config.initialData);
    save(initialData);
    return initialData;
  };

  const read = (): TEntity[] => {
    const storedData = localStorage.getItem(config.storageKey);

    if (!storedData) return resetData();

    try {
      return JSON.parse(storedData) as TEntity[];
    } catch {
      return resetData();
    }
  };

  const executeAuthorizedRequest = async <T>(action: () => T): Promise<T> => {
    authService.requireValidSession();
    await simulateApiDelay(delayMs);
    authService.requireValidSession();

    return action();
  };

  const ensurePayloadIsValid = (
    entities: TEntity[],
    payload: EntityPayload<TEntity>,
    excludedId?: string,
  ) => {
    const conflictMessage = config.getConflictMessage?.(
      entities,
      payload,
      excludedId,
    );

    if (conflictMessage) throw new Error(conflictMessage);
  };

  return {
    getAll(): Promise<TEntity[]> {
      return executeAuthorizedRequest(read);
    },

    create(payload: EntityPayload<TEntity>): Promise<TEntity> {
      return executeAuthorizedRequest(() => {
        const entities = read();
        const normalizedPayload = config.normalizePayload?.(payload) ?? payload;
        ensurePayloadIsValid(entities, normalizedPayload);

        const entity = {
          ...normalizedPayload,
          id: generateId(config.idPrefix),
        } as TEntity;

        save([...entities, entity]);
        return entity;
      });
    },

    update(id: string, payload: EntityPayload<TEntity>): Promise<TEntity> {
      return executeAuthorizedRequest(() => {
        const entities = read();
        const index = entities.findIndex((entity) => entity.id === id);

        if (index === -1) {
          throw new Error(`${config.entityName} was not found.`);
        }

        const normalizedPayload = config.normalizePayload?.(payload) ?? payload;
        ensurePayloadIsValid(entities, normalizedPayload, id);
        const entity = {
          ...normalizedPayload,
          id,
        } as TEntity;

        entities[index] = entity;
        save(entities);
        return entity;
      });
    },

    remove(id: string): Promise<void> {
      return executeAuthorizedRequest(() => {
        const entities = read();

        if (!entities.some((entity) => entity.id === id)) {
          throw new Error(`${config.entityName} was not found.`);
        }

        save(entities.filter((entity) => entity.id !== id));
      });
    },

    reset(): Promise<TEntity[]> {
      return executeAuthorizedRequest(resetData);
    },
  };
};
