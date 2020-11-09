import { EventObject } from 'xstate';
export declare type Sender<TEvent extends EventObject> = (
  event: TEvent
) => void;
export interface Subscription {
  unsubscribe(): void;
}
export interface Observer<T> {
  next?: (value: T) => void;
  error?: (errorValue: any) => void;
  complete: () => void;
}
export interface Subscribable<T> {
  subscribe(observer: Observer<T>): Subscription;
  subscribe(
    next: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription;
}
export interface ActorRef<TEvent extends EventObject, TEmitted = any>
  extends Subscribable<TEmitted> {
  send: Sender<TEvent>;
  stop: () => void;
  /**
   * The most recently emitted value.
   */
  current: TEmitted;
  name: string;
}
export interface ActorRefLike<TEvent extends EventObject, TEmitted = any>
  extends Subscribable<TEmitted> {
  send: Sender<TEvent>;
  stop?: () => void;
  [key: string]: any;
}
export declare type MaybeLazy<T> = T | (() => T);
declare type ExcludeType<A> = {
  [K in Exclude<keyof A, 'type'>]: A[K];
};
declare type ExtractExtraParameters<A, T> = A extends {
  type: T;
}
  ? ExcludeType<A>
  : never;
declare type ExtractSimple<A> = A extends any
  ? {} extends ExcludeType<A>
    ? A
    : never
  : never;
declare type NeverIfEmpty<T> = {} extends T ? never : T;
export interface PayloadSender<TEvent extends EventObject> {
  /**
   * Send an event object or just the event type, if the event has no other payload
   */
  (event: TEvent | ExtractSimple<TEvent>['type']): void;
  /**
   * Send an event type and its payload
   */
  <K extends TEvent['type']>(
    eventType: K,
    payload: NeverIfEmpty<ExtractExtraParameters<TEvent, K>>
  ): void;
}
export {};
//# sourceMappingURL=types.d.ts.map
