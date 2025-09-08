import   {  FiveWhysServices }  from '../../../../../shared/fivewhys/fivewhys.service';
import  * as FiveWhyValidation   from '../../../../../shared/fivewhys/fivewhys.validation';
import { fiveWhysController } from '../../../../../shared/fivewhys/fivewhys.controller';
import FiveWhysModel from './fivewhys.modal';
const  FiveWhysService= new FiveWhysServices(FiveWhysModel);
const FiveWhysController = new fiveWhysController(FiveWhysService,'RiskFiveWhys');
export {
  FiveWhysController,
  FiveWhysService,
  FiveWhyValidation,
};
