module.exports.handler = async (event) => {
    let records = event.Records;
    let batchItemFailures = [];
    if (records.length) {
        for (const record of records) {
            try {
                const parsedBody = JSON.parse(record.body);

                if(typeof parsedBody.detail.vehicleNo != 'string') {
                    throw new Error("vehicle number not string");
                }

                console.log(parsedBody);
                console.log("proccessing details " + parsedBody.detail.vehicleNo);
                console.log("proccessing successful " + record.messageId);
            } catch(err) {
                batchItemFailures.push({
                    itemIdentifer: record.messageId,
                });
            }
        }
    }
    return { batchItemFailures };
};