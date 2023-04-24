const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({region:'eu-west-2'});

const isBookAvailable = (book, quantity) => {
  // return (book.quantity - quantity) > 0
  return quantity;
}

module.exports.checkInventory = async ({bookId, quantity}) => {
  try {
    let params = {
      TableName: 'bookTable',
      KeyConditionExpression: 'bookId = :bookId',
      ExpressionAttributeValues: {
        ':bookId': bookId
      }
    }

    let result = await DocumentClient.query(params).promise();
    let book = result.Items[0];

    if (isBookAvailable(book, quantity)) {
      return book;
    } else {
      let bookOutOfStockError = new Error("book out of stock");
      bookOutOfStockError.name = "BookOutOfStock";
      throw bookOutOfStockError;
    }

  } catch(e) {
    if(e.name == 'BookOutOfStock') {
      throw e;
    }
    else {
      let bookNotFoundError = new Error(e);
      bookNotFoundError.name = 'BookNotFound';
      throw e;
    }
  }
};

module.exports.calculateTotal = async ({ book, quantity }) => {
  let total = book.price * quantity;
  return { total };
};

const deductPoints = async (userId) => {
  let params = {
    TableName: 'userTable',
    Key: {'userId': userId},
    UpdateExpression: 'SET points =:zero',
    ExpressionAttributeValues: {
      ':zero': 0
    }
  }
  await DocumentClient.update(params).promise();
};

module.exports.redeemPoints = async ({ userId, total }) => {
  let orderTotal = total.total;
  try {
    let params = {
      TableName: 'userTable',
      Key: {
        'userId': userId
      }
    }
      let result = await DocumentClient.get(params).promise();
      let user = result.Item;
      
      const points = user.points;
      if (orderTotal > points) {
        await deductPoints(userId);
        orderTotal = orderTotal - points;
        return { total: orderTotal, points }
      } else {
        throw new Error('order less than redeemed points');
      }
    } catch (e) {
      throw new Error(e);
  }
};

module.exports.billCustomer = async (params) => {
  return "Successfully billed";
};

module.exports.restoreRedeemPoints = async (params) => {
  try {
      if (total.points) {
        let params = {
          TableName: 'userTable',
          Key: { userId: userId },
          UpdateExpression: 'set points = :points',
          ExpressionAttributeValues: {
            ':points': total.points
          }
        };
        await DocumentClient.update(params).promise();
      }
    } catch (e) {
      throw new Error(e);
  }
};

