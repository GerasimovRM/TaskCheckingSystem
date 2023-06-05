import { createContext } from "react";
import { RootStore } from "../store/RootStore";

export const RootStoreContext = createContext<RootStore>(new RootStore());