import { Sender, ActorRefLike } from './types';
import { EventObject, Actor } from 'xstate';
export declare function useActor<TEvent extends EventObject, TEmitted = any>(
  actorRef: ActorRefLike<TEvent, TEmitted> | Actor,
  getSnapshot?: (actor: typeof actorRef) => TEmitted
): [TEmitted, Sender<TEvent>];
//# sourceMappingURL=useActor.d.ts.map
