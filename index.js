const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser")
const SettingsBill = require("./settings-bill")
const app = express();
const settingsBill = SettingsBill()
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
    layoutsDir: './views/layouts'
}));
app.use(express.static("public"))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render("index", {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals()
    });
})


app.post("/settings", function (req, res) {

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
    console.log(settingsBill.getSettings())
    res.redirect("/")
})

app.post("/action", function (req, res) {
    res.redirect("/")
    //capture the bill type to add
    // console.log();   
    if (!settingsBill.hasReachedCriticalLevel()) {
        settingsBill.recordAction(req.body.actionType)

    }
})
app.get("/actions", function (req, res) {

    res.render("actions", { actions: settingsBill.actions() })
})
app.get("/actions/:actionType", function (req, res) {
    const actionType = req.params.actionType;
    if (!settingsBill.hasReachedCriticalLevel()) {
        res.render("actions", { actions: settingsBill.actionsFor(actionType) })
    }
})

const PORT = process.env.PORT || 3011;
app.listen(PORT, function () {

    console.log("App started at port:", PORT);
})