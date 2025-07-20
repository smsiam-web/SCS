import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { AppForm, FormBtn } from "../../shared/Form";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/app/redux/slices/authSlice";
import { Today } from "@/admin/utils/helpers";
import axios from "axios";
import {
  selectSingleCustomer,
  updateSingleCustomer,
} from "@/app/redux/slices/singleCustomerSlice";
import { selectProduct } from "@/app/redux/slices/productSlice";
import { notifications } from "@mantine/notifications";
import firebase from "firebase";
import OrderDetailsFormMango from "./OrderDetailsFormMango";

const validationSchema = Yup.object().shape({
  delivery_type: Yup.boolean().required().label("Delivery type"),
  phone_number: Yup.string()
    .matches(/^[0-9]{11}$/, "Must be exactly 11 digits")
    .required()
    .label("Phone number"),
  customer_name: Yup.string().max(50).required().label("Name"),
  received_by: Yup.string().max(60).required().default("Admin"),
  markAs: Yup.string().max(60).required().default("Normal"),
  order_from: Yup.string().max(60).required().default("Messenger Order"),
  customer_address: Yup.string().max(300).required().label("Address"),
  courier: Yup.string().max(50).required().default("Pathao"),
  // recipient_city: Yup.number().required().label("City"),
  // recipient_area: Yup.number().required().label("Area"),
  // recipient_zone: Yup.number().required().label("Zone"),

  ad_ID: Yup.string().max(5).label("Ad ID"),
  salePrice: Yup.number().required().label("Sale Price"),
  note: Yup.string()
    .max(400)
    .default(
      "আমের পার্সেল। আম পচনশীল পণ্য, দয়া করে সাবধানে এবং দ্রুত ডেলিভারি করবেন। ধন্যবাদ"
    ),
  invoice_Note: Yup.string().max(400).label("Invoice Note"),
});

const AddMangoOrder = ({ onClick }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [load, Loading] = useState(false);
  const [orderResponse, setOrderResponse] = useState(false);
  const user = useSelector(selectUser);
  const router = useRouter();
  const [products, setProducts] = useState(null);
  const [uid, setInvoiceID] = useState(null);

  const getCustomer = useSelector(selectSingleCustomer);
  const p = useSelector(selectProduct);
  const dispatch = useDispatch();

  //get config
  useEffect(() => {
    const unSub = db.collection("config").onSnapshot((snap) => {
      const configData = [];
      snap.docs.map((doc) => {
        configData.push(doc.data());
      });
      setConfig(configData);
    });
    return () => {
      unSub();
    };
  }, []);

  useEffect(() => {
    const temp = [];
    const item = p?.map((i) => temp.push(i?.product_details));
    setProducts(temp);
  }, []);

  // Get OrderID from firebase database
  useEffect(() => {
    const unSub = db.collection("orderID").onSnapshot((snap) => {
      snap.docs.map((doc) => {
        setInvoiceID(doc.data());
      });
    });

    return () => {
      unSub();
    };
  }, []);

  useEffect(() => {
    console.log("Loading state is now:", loading);
  }, [loading]);

  const placeOrder = async (values) => {
    setLoading(true);
    const order = [];
    let totalPrice = 0;
    let weight = 0;

    products &&
      products.map((item) => {
        const yup = item.yup;

        if (values[yup]) {
          const title = item.yup.split("_");
          let s = [];

          title &&
            title.map((e) => {
              s.push(e[0].toUpperCase() + e.slice(1));
            });

          weight += values[yup];

          if (item?.product_type === "আম") {
            order.push({
              store_id: item?.store_id,
              title: s.join(" "),
              quantity: values[yup] * 12,
              lot: values[yup],
              sku: item?.sku,
              price: item.sale_price,
              total_price: values[yup] * 12 * item.sale_price,
              type: "mango",
            });
          } else {
            order.push({
              title: s.join(" "),
              quantity: values[yup],
              price: item.sale_price,
              total_price: values[yup] * item.sale_price,
            });
          }
        }
      });

    order &&
      order.map((p) => {
        totalPrice += p.total_price;
      });

    const deliveryCrg = 0;
    const discount =
      totalPrice + deliveryCrg - values.salePrice > 0
        ? totalPrice + deliveryCrg - values?.salePrice
        : "0";

    const date = Today();
    setLoading(true);

    const counterRef = db.collection("counters").doc("orderCounter");

    db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      // If the document doesn’t exist, set it up with an initial value
      if (!counterDoc.exists) {
        transaction.set(counterRef, { value: 1 }); // Initialize with 1
        return 1;
      } else {
        // Increment the existing value by 1
        transaction.update(counterRef, {
          value: firebase.firestore.FieldValue.increment(1),
        });
        return counterDoc.data().value + 1; // Return new value after increment
      }
    })
      .then(async (newOrderId) => {
        const orderID = `RA0${newOrderId}`;
        const cusetomer_id = `RAC0${newOrderId}`;
        let totalLot = 0;
        let perLotCondition = 0;

        if (order.length) {
          let totalLot = 0;

          order.forEach((item) => {
            totalLot += item?.lot || 0;
          });

          const perLotCondition = Math.round(values?.salePrice / totalLot);
          console.log(values);
          for (const item of order) {
            for (let i = 0; i < item?.lot; i++) {
              const orderss = {
                store_id: `${item?.store_id}`,
                merchant_order_id: `${orderID}_${item.sku}0${i + 1}`,
                recipient_name: `${values.customer_name}`,
                recipient_phone: `${values.phone_number}`,
                recipient_address: `${
                  values?.delivery_type
                    ? "(HOME Delivery), "
                    : "(POINT Delivery), "
                }${values.customer_address}`,
                // recipient_city: 1,
                // recipient_zone: 10,
                // recipient_area: 101,
                delivery_type: 48,
                item_type: 2,
                special_instruction: `${values.note}`,
                item_quantity: 1,
                item_weight: "1",
                item_description: "1 Carat Mango.",
                amount_to_collect: perLotCondition,
              };

              try {
                const response = await fetch("/api/pathao/place-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(orderss),
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Server error: ${errorText}`);
                }

                const result = await response.json();
                notifications.show({
                  title: result?.message || "Success",
                  message: `Status: ${result?.type}`,
                  color: "blue",
                  autoClose: 6000,
                });
                console.log("Order placed:", result);
              } catch (error) {
                console.error("Transaction failed:", error);
                notifications.show({
                  title: "Order Failed",
                  message: error.message || "Something went wrong",
                  color: "red",
                  autoClose: 10000,
                });
              }
            }
          }
        }
        sendConfirmationMsg(values, orderID);
        createCustomer(values, date, cusetomer_id);

        const sfc = {
          consignment_id: null,
          tracking_code: null,
        };
        const orderData = {
          sfc,
          item_type: "mango",
          deliveryCrg,
          weight,
          customer_details: values,
          discount,
          totalPrice,
          date,
          order,
          timestamp,
          placeBy: user.name,
          placeById: user.staff_id,
          status: "Pending",
          orderID,
        };

        try {
          db.collection("placeOrder").doc(orderID).set(orderData);
        } catch (error) {
          notifications.show({
            title: "Failed to place order",
            message: `Please try again later..`,
            color: "orange",
          });

          setOrderResponse(null);
          console.error("Error placing order:", error);
        } finally {
          dispatch(updateSingleCustomer(null));
          router.push("/admin/place-order/id=" + orderID);
        }
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!!!",
          message: `Please try again later..`,
          color: "orange",
          autoClose: 6000,
        });
        setOrderResponse(null);
        console.error("Transaction failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sendConfirmationMsg = async (values, orderID, tracking_code = "") => {
    const customer_name = values?.customer_name || "Customer";
    const company_name = config[0]?.values.company_name;
    const company_contact = config[0]?.values.company_contact;

    const url = "https://api.sms.net.bd/sendsms";
    const apiKey = config[0]?.values.bulk_auth;
    const message = `Dear ${customer_name}, Your order has been successfully placed at ${company_name}. Invoice No: ${orderID}. Please keep BDT: ${
      values?.salePrice
    }tk ready while receiving the parcel.${
      tracking_code &&
      ` Track your Parcel here: https://steadfast.com.bd/t/${tracking_code}`
    } Hotline: +88${company_contact}. Thanks for being with us.`;
    const to = values?.phone_number;

    const formData = new FormData();
    formData.append("api_key", apiKey);
    formData.append("msg", message);
    formData.append("to", to);

    axios
      .post(url, formData)
      .then((response) => {
        console.log(response.data);
        notifications.show({
          title: response?.data.msg,
          message: "Message sent successfully",
          color: "blue",
          autoClose: 6000,
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
  // create Customer on firebase database
  const createCustomer = async (values, cusetomer_id, timestamp) => {
    await db.collection("createCustomer").doc(values?.phone_number).set({
      cus_name: values.customer_name,
      cus_contact: values.phone_number,
      cus_address: values.customer_address,
      cusetomer_id,
      timestamp,
    });
  };

  return (
    <main>
      <div>
        <AppForm
          initialValues={{
            delivery_type: true || "",
            phone_number: "",
            customer_name: "",
            customer_address: "",
            salePrice: "",
            received_by: "Admin",
            order_from: "Messenger Order",
            markAs: "Normal",
            courier: "Pathao",
            ad_ID: "",
            // recipient_city: 0,
            // recipient_zone: 0,
            // recipient_area: 0,
            invoice_Note: "",
            note: "আমের পার্সেল। আম পচনশীল পণ্য, দয়া করে সাবধানে এবং দ্রুত ডেলিভারি করবেন",
          }}
          onSubmit={placeOrder}
          validationSchema={validationSchema}
        >
          <div className="bg-white max-w-2xl mx-auto rounded-xl relative">
            <div className="w-full">
              <div className="flex gap-2 items-center justify-between py-3 px-6 md:px-4">
                <div className="grid gap-1">
                  <h1 className="text-tile text-xl font-medium md:text-2xl">
                    Place new order (Mango)
                  </h1>
                  <p className="text-sm md:text-lg text-sub-title">
                    Add your product and necessary information from here.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <OrderDetailsFormMango rest={true} />
            </div>

            <div className="py-5 px-6 md:px-4 max-h-full grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Button
                  disabled={loading}
                  onClick={onClick}
                  title="Cancel"
                  className="bg-red-100 hover:bg-red-200 hover:shadow-lg text-red-600 transition-all duration-300 w-full"
                />
              </div>
              <div className="col-span-2">
                <FormBtn
                  disabled={loading}
                  loading={loading}
                  onClick={placeOrder}
                  title="Submit"
                  className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300 w-full"
                />
              </div>
            </div>
          </div>
        </AppForm>
      </div>
    </main>
  );
};

export default AddMangoOrder;
