import { isReload } from './isReload';

// @ts-ignore
export const shouldSkipIdle = (): boolean => process.env.SKIP_IDLE === true || isReload();
