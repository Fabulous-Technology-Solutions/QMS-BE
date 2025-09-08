
import * as IshikawaValidation from "../../../../../shared/ishikawa/ishikawa.validation";
import {IshikawaServices} from '../../../../../shared/ishikawa/ishikawa.services';
import IshikawaModel from './Ishikawa.modal';
import { IsikawaController } from "../../../../../shared/ishikawa/ishikawa.controller";

const ishikawaService = new IshikawaServices(IshikawaModel);
const IshikawaController = new IsikawaController(ishikawaService,'Ishikawa');

export {
    IshikawaController  ,
    IshikawaValidation,
    ishikawaService
};