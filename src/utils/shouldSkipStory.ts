import { isReload } from './isReload';

// @ts-ignore
export const shouldSkipStory = (): boolean => process.env.SKIP_STORY === true || isReload();
