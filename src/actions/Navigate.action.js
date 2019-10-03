import { Action } from 'kawax-js';

class Navigate extends Action {

  static type = 'CONTEXT.HISTORY.NAVIGATE';

  call = async ({ location, action }) => {
    global.scrollTo(0, 0);
  };

}

export default Navigate;
