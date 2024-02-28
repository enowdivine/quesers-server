import axios from "axios";
// const baseUrl = "https://sandbox.fapshi.com";
// const headers = {
//   apiuser: "4cf8407a-b21b-447e-9148-88f6d90ee0d4",
//   apikey: "FAK_TEST_9fd60078638a83a51b7b",
// };
const baseUrl = "https://live.fapshi.com";
const headers = {
  apiuser: "83e65a1f-5a1b-49bf-8403-0b3451e44fb2",
  apikey: "FAK_e55f46c950fe1207fd0fccd030750417",
};

module.exports = {
  /** 
    *This function returns an object with the link were a user is to be redirected in order to complete his payment

    *Below is a parameter template. Just amount is required

        data = {
            "amount": Integer ,
            "email": String,
            "userId": String,
            "externalId": String,
            "redirectUrl": String,
            "message": String
        }
    */
  initiatePay(data: any) {
    return new Promise(async function (resolve) {
      try {
        if (!data?.amount) resolve(error("amount required", 400));
        if (!Number.isInteger(data.amount))
          resolve(error("amount must be of type integer", 400));
        if (data.amount < 100)
          resolve(error("amount cannot be less than 100 XAF", 400));

        const config = {
          method: "post",
          url: baseUrl + "/initiate-pay",
          headers: headers,
          data: data,
        };
        const response = await axios(config);
        response.data.statusCode = response.status;
        resolve(response.data);
      } catch (e: any) {
        e.response.data.statusCode = e?.response?.status;
        resolve(e.response.data);
      }
    });
  },

  /** 
    *This function directly initiates a payment request to a user's mobile device and 
    returns an object with a transId property that is used to get the status of the payment

    *Below is a parameter template. amount and phone are required

        data = {
            "amount": Integer ,
            "phone": String ,
            "medium": String,
            "name": String,
            "email": String,
            "userId": String,
            "externalId": String,
            "message": String
        }
    */
  directPay(data: any) {
    return new Promise(async function (resolve) {
      try {
        if (!data?.amount) resolve(error("amount required", 400));
        if (!Number.isInteger(data.amount))
          resolve(error("amount must be of type integer", 400));
        if (data.amount < 100)
          resolve(error("amount cannot be less than 100 XAF", 400));
        if (!data?.phone) resolve(error("phone number required", 400));
        if (typeof data.phone !== "string")
          resolve(error("phone must be of type string", 400));
        if (!/^6[\d]{8}$/.test(data.phone))
          resolve(error("invalid phone number", 400));

        const config = {
          method: "post",
          url: baseUrl + "/direct-pay",
          headers: headers,
          data: data,
        };
        const response = await axios(config);
        response.data.statusCode = response.status;
        resolve(response.data);
      } catch (e: any) {
        e.response.data.statusCode = e?.response?.status;
        resolve(e.response.data);
      }
    });
  },

  /**
   * This function returns an object containing the details of the transaction associated with the Id passed as parameter
   */
  paymentStatus(transId: any) {
    return new Promise(async function (resolve) {
      try {
        if (!transId || typeof transId !== "string") {
          resolve(error("invalid type, string expected", 400));
        }
        // if (!/^[a-zA-Z0-9]{8,9}$/.test(transId))
        //   resolve(error("invalid transaction id", 400));

        const config = {
          method: "get",
          url: baseUrl + "/payment-status/" + transId,
          headers: headers,
        };
        const response = await axios(config);
        response.data.statusCode = response.status;
        resolve(response.data);
      } catch (e: any) {
        e.response.data.statusCode = e?.response?.status;
        resolve(e.response.data);
      }
    });
  },

  /**
   * This function expires the transaction associated with the Id passed as parameter and returns an object containing the details of the transaction
   */
  expirePay(transId: any) {
    return new Promise(async function (resolve) {
      try {
        if (!transId || typeof transId !== "string")
          resolve(error("invalid type, string expected", 400));
        if (!/^[a-zA-Z0-9]{8,9}$/.test(transId))
          resolve(error("invalid transaction id", 400));

        const config = {
          method: "post",
          url: baseUrl + "/expire-pay",
          data: { transId },
          headers: headers,
        };
        const response = await axios(config);
        response.data.statusCode = response.status;
        resolve(response.data);
      } catch (e: any) {
        e.response.data.statusCode = e?.response?.status;
        resolve(e.response.data);
      }
    });
  },

  /**
   * This function returns an array of objects containing the transaction details of the user Id passed as parameter
   */
  userTrans(userId: any) {
    return new Promise(async function (resolve) {
      try {
        if (!userId || typeof userId !== "string")
          resolve(error("invalid type, string expected", 400));
        if (!/^[a-zA-Z0-9-_]{1,100}$/.test(userId))
          resolve(error("invalid user id", 400));

        const config = {
          method: "get",
          url: baseUrl + "/transaction/" + userId,
          headers: headers,
        };
        const response = await axios(config);
        resolve(response.data);
      } catch (e: any) {
        e.response.data.statusCode = e?.response?.status;
        resolve(e.response.data);
      }
    });
  },
};

function error(message: any, statusCode: any) {
  return { message, statusCode };
}
