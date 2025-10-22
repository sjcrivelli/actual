"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRouter = ReportRouter;
var react_1 = require("react");
var react_router_1 = require("react-router");
var Overview_1 = require("./Overview");
var Calendar_1 = require("./reports/Calendar");
var CashFlow_1 = require("./reports/CashFlow");
var CustomReport_1 = require("./reports/CustomReport");
var NetWorth_1 = require("./reports/NetWorth");
var Spending_1 = require("./reports/Spending");
var Summary_1 = require("./reports/Summary");
function ReportRouter() {
    return (<react_router_1.Routes>
      <react_router_1.Route path="/" element={<Overview_1.Overview />}/>
      <react_router_1.Route path="/net-worth" element={<NetWorth_1.NetWorth />}/>
      <react_router_1.Route path="/net-worth/:id" element={<NetWorth_1.NetWorth />}/>
      <react_router_1.Route path="/cash-flow" element={<CashFlow_1.CashFlow />}/>
      <react_router_1.Route path="/cash-flow/:id" element={<CashFlow_1.CashFlow />}/>
      <react_router_1.Route path="/custom" element={<CustomReport_1.CustomReport />}/>
      <react_router_1.Route path="/custom/:id" element={<CustomReport_1.CustomReport />}/>
      <react_router_1.Route path="/spending" element={<Spending_1.Spending />}/>
      <react_router_1.Route path="/spending/:id" element={<Spending_1.Spending />}/>
      <react_router_1.Route path="/summary" element={<Summary_1.Summary />}/>
      <react_router_1.Route path="/summary/:id" element={<Summary_1.Summary />}/>
      <react_router_1.Route path="/calendar" element={<Calendar_1.Calendar />}/>
      <react_router_1.Route path="/calendar/:id" element={<Calendar_1.Calendar />}/>
    </react_router_1.Routes>);
}
