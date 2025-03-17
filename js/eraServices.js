//============E-Ra Services=======
const eraWidget = new EraWidget();
const lake = document.querySelector(".lakeClo-value");
const waterFilterPH = document.querySelector(".waterFilter-pH");
const waterFilterDoDuc = document.querySelector(".waterFilter-doDuc");
const waterFilterCloDu = document.querySelector(".waterFilter-cloDu");
const officePower = document.querySelector(".office-powerConsump");
const factoryTemp = document.querySelector(".factory-temperature");
const factoryHumid = document.querySelector(".factory-humidity");
let lastTank1Value = NaN;
let lastTank2Value = NaN;
let configTank1 = null,
  configTank2 = null,
  onPump1 = null,
  offPump1 = null,
  onPump2 = null,
  offPump2 = null,
  configwaterFilterPH = null,
  configwaterFilterDoDuc = null,
  configwaterFilterCloDu = null,
  configofficePower = null,
  configfactoryTemp = null,
  configfactoryHumid = null;

eraWidget.init({
  onConfiguration: (configuration) => {
    configTank1 = configuration.realtime_configs[0];
    configTank2 = configuration.realtime_configs[1];
    configLake = configuration.realtime_configs[2];
    configwaterFilterPH = configuration.realtime_configs[3];
    configwaterFilterDoDuc = configuration.realtime_configs[4];
    configwaterFilterCloDu = configuration.realtime_configs[5];
    configofficePower = configuration.realtime_configs[6];
    configfactoryTemp = configuration.realtime_configs[7];
    configfactoryHumid = configuration.realtime_configs[8];
    onPump1 = configuration.actions[0];
    offPump1 = configuration.actions[1];
    onPump2 = configuration.actions[2];
    offPump2 = configuration.actions[3];
  },
  onValues: (values) => {
    if (configTank1 && values[configTank1.id]) {
      const tank1Value = values[configTank1.id].value;
      lastTank1Value = tank1Value;
      waterPump(lastTank1Value);
    }

    if (configTank2 && values[configTank2.id]) {
      const tank2Value = values[configTank2.id].value;
      lastTank2Value = tank2Value;
      waterPump2(lastTank2Value);
    }
    if (configLake && values[configLake.id]) {
      const lakeValue = values[configLake.id].value;
      if (lake) lake.textContent = lakeValue;
    }

    if (configwaterFilterPH && values[configwaterFilterPH.id]) {
      const pHValue = values[configwaterFilterPH.id].value;
      if (waterFilterPH) waterFilterPH.textContent = pHValue;
    }
    if (configwaterFilterDoDuc && values[configwaterFilterDoDuc.id]) {
      const doducValue = values[configwaterFilterDoDuc.id].value;
      if (waterFilterDoDuc) waterFilterDoDuc.textContent = doducValue;
    }
    if (configwaterFilterCloDu && values[configwaterFilterCloDu.id]) {
      const cloValue = values[configwaterFilterCloDu.id].value;
      if (waterFilterCloDu) waterFilterCloDu.textContent = cloValue;
    }

    if (configofficePower && values[configofficePower.id]) {
      const powerValue = values[configofficePower.id].value;
      if (officePower) officePower.textContent = powerValue + " kWh";
    }

    if (configfactoryTemp && values[configfactoryTemp.id]) {
      const tempValue = values[configfactoryTemp.id].value;
      if (factoryTemp) factoryTemp.textContent = tempValue + "℃";
    }

    if (configfactoryHumid && values[configfactoryHumid.id]) {
      const humidValue = values[configfactoryHumid.id].value;
      if (factoryHumid) factoryHumid.textContent = humidValue + "%";
    }
  },
});
