import { AnyAction, Store as ReduxStore } from "redux";
import { Task } from "redux-saga";

export interface IReduxiclePlugin {
  key: string;
  middlewares?: any[];
  reducer?: AnyReducer;
  wrapper?: any;
  initialize?: (reduxicleConfig: IReduxicleConfigWithoutPlugins) => void;
}

export interface IReduxicleConfigWithoutPlugins {
  useImmutableJS?: boolean;
}

export interface IReduxicleConfig extends IReduxicleConfigWithoutPlugins {
  plugins?: IReduxiclePlugin[];
}

export interface IReduxicleContext {
  config: IReduxicleConfig;
  runSaga: (saga: AnyFunction) => Task;
  injectedReducers: InjectedReducers;
  injectedSagas: {
    [key: string]: InjectedSagaDescriptor|"done";
  };
}

export type InjectedSagaDescriptor = {
  saga: AnyFunction,
  mode: SagaInjectionModes,
  task: Task,
};

export type AnyObject = {
  [key: string]: any;
};

export type InjectedReducers = Array<{
  [key: string]: AnyReducer,
}>;

export type AnyFunction = (...params: any[]) => any;
export type Store = ReduxStore & {
  reduxicle: IReduxicleContext,
};

export type AnyReducer = (state: AnyObject, action: AnyAction) => AnyObject;

export enum SagaInjectionModes {
  RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount",
  DAEMON = "@@saga-injector/daemon",
  ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount",
}
