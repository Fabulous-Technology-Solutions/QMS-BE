import   {  FiveWhysServices }  from '../../../../../shared/fivewhys/fivewhys.service';
// import * as FiveWhysController from './fivewhys.controller';
import FiveWhysModel from './fivewhys.modal';
const  FiveWhysService= new FiveWhysServices(FiveWhysModel);
import  * as FiveWhyValidation   from '../../../../../shared/fivewhys/fivewhys.validation';
import { fiveWhysController } from '../../../../../shared/fivewhys/fivewhys.controller';
const FiveWhysController = new fiveWhysController(FiveWhysService,'FiveWhys');
export {
  FiveWhysController,
  FiveWhysService,
  FiveWhyValidation,
};
