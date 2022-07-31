import moment, { Moment } from "moment";
import "moment/locale/es";
import "moment/dist/locale/es";

moment.locale('es')

export type { Moment }
export { moment };
export default moment