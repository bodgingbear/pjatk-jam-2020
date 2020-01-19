import { isReload } from './isReload';

// @ts-ignore
const shouldSkipIntro = (): boolean => process.env.SKIP_INTRO === true || isReload();

export default shouldSkipIntro;
