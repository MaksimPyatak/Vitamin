import { ClassToggler } from "./utilits/classes.js";

const registrationTabs = new ClassToggler("tabs", 'tabs__tab', "add-file");
registrationTabs.addListener();
