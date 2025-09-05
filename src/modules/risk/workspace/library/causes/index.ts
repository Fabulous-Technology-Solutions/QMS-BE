
import * as causeValidation from '../../../../../shared/cause/cause.validation';
import { BaseService } from '../../../../../shared/cause/cause.service';
import { BaseController } from '../../../../../shared/cause/cause.controller';
import Causes from './causes.modal';
const causeService = new BaseService(Causes);
const causeController = new BaseController(causeService, "RiskCauses");

export { causeController, causeService, causeValidation };
