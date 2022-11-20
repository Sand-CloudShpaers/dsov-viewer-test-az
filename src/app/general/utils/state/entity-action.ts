import { LoadingState } from '~model/loading-state.enum';

interface EntityOptions {
  /** Correlate related EntityActions, particularly related saves. Must be serializable. */
  readonly correlationId?: string;
  /** The tag to use in the action's type. The entityName if no tag specified. */
  readonly tag?: string;
  /** The status of an entity */
  readonly status?: LoadingState;

  error?: Error;
}

export interface EntityPayload<P = unknown> extends EntityOptions {
  readonly entityId: string;
  readonly data?: P;
}
