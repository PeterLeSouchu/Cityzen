// EXTERNAL MODULES
import CoreController from "./core.controller.js";

// -> We make a Singleton class for each instance with a new datamapper. So it is not possible to instantiate two classes with the same datamapper
class Controller extends CoreController {
  static instances = [];

  constructor(datamapper) {
    super();

    // Has an instance with this datamapper already been instantiated ? 
    const findedInstance = Controller.instances.find(item => item?.datamapper === datamapper);

    // If yes -> give me the instance and don't instanciate
    if(findedInstance) {
      return findedInstance.instance;
    
    // If no -> creates the instance and stores it in the instances array... 
    } else {
      this.datamapper = datamapper;
      Controller.instances.push({
        instance: this,
        datamapper: this.datamapper
      });
      // ...and give me this instance
      return Controller.instances.at(-1).instance;
    }
  }

}



export default Controller;