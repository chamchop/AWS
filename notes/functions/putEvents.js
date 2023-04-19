const EventBridge = require("aws-sdk/clients/eventbridge");
const EVENT_BUS_NAME = process.env.EventBusName;

let eventBridge = new EventBridge();

module.exports.handler = async (event) => {
    let body = JSON.parse(event.body);
    let entry = {
        EventBusName: EVENT_BUS_NAME,
        Detail: JSON.stringify({
            vehicleNo: body.vehicleNo,
            NIC: body.nic
        }),
        Source: "fuel-app",
        DetailType: "registration"
    }
    try {
        let output = await eventBridge.putEvents({ Entries: [entry] }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(output)
        }
    } 
    catch(err) {
        console.log(err);
    }
}