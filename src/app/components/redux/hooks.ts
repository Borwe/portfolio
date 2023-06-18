import { TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import { RootState, AppDispatch} from "./store";

export const useAppDispatch = ()=> useDispatch<AppDispatch>();
export type UseAppDispatchType = ReturnType<typeof useAppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
