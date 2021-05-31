import { Module, ModuleManager } from "../../API/Modules/Module";
import fs from "fs";
import path from "path";

class BaseModule extends Module
{
    constructor()
    {
        super("Official Generic Layout", fs.readFileSync(path.resolve(__dirname, "./version.txt")).toString("utf-8"));
        this.RegisterAssetFolder(__dirname + '/assets');
    }
}

ModuleManager.RegisterModule(new BaseModule());