import { CreateCapaworkspaceRequest } from "./workspace.interfaces";
import CapaworkspaceModel from "./workspace.modal";

export const createCapaworkspace = async (data: CreateCapaworkspaceRequest) => {
    const workspace = new CapaworkspaceModel(data);
    return await workspace.save();
}