import React, { useEffect, useState } from "react";
import OrderDetailsForm from "../OrderDetailsFormMango";
import * as Yup from "yup";
import { AppForm, FormBtn } from "../../../shared/Form";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../../shared/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/app/redux/slices/authSlice";
import { Today } from "@/admin/utils/helpers";
import { selectConfig } from "@/app/redux/slices/configSlice";
import axios from "axios";
import {
  selectSingleCustomer,
  updateSingleCustomer,
} from "@/app/redux/slices/singleCustomerSlice";
import { selectProduct } from "@/app/redux/slices/productSlice";
import { notifications } from "@mantine/notifications";
import { usePathname } from "next/navigation";
import Link from "next/link";
import OrderDetailsFormMango from "../OrderDetailsFormMango";

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

const EditMangoOrder = ({ onClick }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState(false);
  const user = useSelector(selectUser);
  const router = useRouter();
  const [products, setProducts] = useState(null);
  const [uid, setInvoiceID] = useState(null);
  const [id, setId] = useState(usePathname()?.split("=")[1]);
  const [singleOrder, setSingleOrder] = useState(null);

  useEffect(() => {
    db.collection("placeOrder")
      .doc(id)
      .get()
      .then((doc) => {
        setSingleOrder(doc.data());
      });
  }, [id]);

  const dispatch = useDispatch();

  // Get products from firebase database
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

  console.log(singleOrder);

  const updateOrder = async (values) => {
    setLoading(true);
    const order = [];
    let totalPrice = 0;
    let weight = 0;

    products &&
      products.map((item) => {
        const yup = item?.product_details.yup;

        console.log(item?.product_details);

        if (values[yup]) {
          const title = item?.product_details.yup.split("_");
          let s = [];

          title &&
            title.map((e) => {
              s.push(e[0].toUpperCase() + e.slice(1));
            });

          weight += values[yup];

          if (item?.product_details.product_type === "আম") {
            console.log(item?.product_details);
            order.push({
              store_id: item?.product_details?.store_id,
              title: s.join(" "),
              quantity: values[yup] * 12,
              lot: values[yup],
              sku: item?.product_details?.sku,
              price: item?.product_details.sale_price,
              total_price: values[yup] * 12 * item?.product_details.sale_price,
              type: "mango",
            });
          } else {
            order.push({
              title: s.join(" "),
              quantity: values[yup],
              price: item?.product_details.sale_price,
              total_price: values[yup] * item?.product_details.sale_price,
            });
          }
        }
      });
    order &&
      order.map((i) => {
        totalPrice += i.total_price;
      });

    const deliveryCrg =
      weight >= 1 && weight === 1 ? 130 : 130 + (weight - 1) * 20;
    const discount =
      totalPrice + deliveryCrg - values.salePrice > 0
        ? totalPrice + deliveryCrg - values?.salePrice
        : "0";

    const date = Today();

    // const tracking_code = singleOrder?.sfc?.tracking_code;
    const sfc = {
      consignment_id: singleOrder?.sfc?.consignment_id || null,
      tracking_code: singleOrder?.sfc?.tracking_code || null,
    };
    const placeBy = {
      user: singleOrder?.placeBy?.user || singleOrder?.placeBy || null,
      userID: singleOrder?.placeBy?.userID || singleOrder?.placeById || null,
    };

    const updateBy = {
      user: user?.name || null,
      userID: user?.staff_id || null,
      date,
    };

    const orderData = {
      sfc,
      deliveryCrg,
      weight,
      item_type: singleOrder?.item_type || "mango",
      customer_details: values,
      discount,
      totalPrice,
      date: singleOrder?.date,
      lastUpdate: date,
      order,
      timestamp: singleOrder?.timestamp,
      updateBy,
      placeBy,
      status: singleOrder?.status,
      orderID: id,
    };

    try {
      db.collection("placeOrder")
        .doc(id)
        .set(orderData)
        .then(
          notifications.show({
            title: `Success ${id}`,
            message: `Order updated successfully.`,
            color: "blue",
          })
        );
      // sendConfirmationMsg(values, id, tracking_code);
      createCustomer(values, date);
      dispatch(updateSingleCustomer([]));
    } catch (error) {
      notifications.show({
        title: "Failed to place order",
        message: `Please try again later..`,
        color: "orange",
      });
      setLoading(false);
      setOrderResponse(null);
      setSingleOrder(null);
      console.error("Error placing order:", error);
    } finally {
      setSingleOrder(null);
      router.push("/admin/place-order/id=" + id);
    }
    setLoading(false);
  };

  const sendConfirmationMsg = async (values, orderID, tracking_code = "") => {
    const customer_name = values?.customer_name || "Customer";
    const company_name = config[0]?.values.company_name;
    const company_contact = config[0]?.values.company_contact;

    const url = "https://api.sms.net.bd/sendsms";
    const apiKey = config[0]?.values.bulk_auth;
    const message = `Dear ${customer_name}, Your order has been successfully updated at ${company_name}. Invoice No: ${orderID}. Please keep BDT: ${
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
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
  // create Customer on firebase database
  const createCustomer = async (values, timestamp) => {
    await db.collection("createCustomer").doc(values?.phone_number).set({
      cus_name: values.customer_name,
      cus_contact: values.phone_number,
      cus_address: values.customer_address,
      cusetomer_id: id,
      timestamp,
    });
  };
  // Get products from firebase
  useEffect(() => {
    setLoading(true);
    const unSub = db
      .collection("products")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const product = [];
        snap.docs.map((doc) => {
          product.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setProducts(product);
      });
    setLoading(false);
    return () => {
      unSub();
    };
  }, []);
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

  return (
    <main>
      <div className="pt-2">
        {singleOrder && (
          <AppForm
            initialValues={{
              delivery_type: singleOrder?.customer_details?.delivery_type || "",
              phone_number: singleOrder?.customer_details?.phone_number || "",
              customer_name: singleOrder?.customer_details?.customer_name || "",
              customer_address:
                singleOrder?.customer_details?.customer_address || "",
              salePrice: singleOrder?.customer_details?.salePrice || "",
              courier: singleOrder?.customer_details?.courier || "",
              note: singleOrder?.customer_details?.note || "",
              invoice_Note: singleOrder?.customer_details?.invoice_Note || "",
              order_from: singleOrder?.customer_details?.order_from || "",
              ad_ID: singleOrder?.customer_details?.ad_ID || "",
              markAs: singleOrder?.customer_details?.markAs || "",
              received_by: singleOrder?.customer_details?.received_by || "",
            }}
            onSubmit={updateOrder}
            validationSchema={validationSchema}
          >
            <div className="bg-white max-w-2xl mx-auto rounded-xl relative">
              <div className="w-full">
                <div className="flex gap-2 items-center justify-between py-3 px-6 md:px-4">
                  <div className="grid gap-1">
                    <h1 className="text-tile text-xl font-medium md:text-2xl">
                      Edit order
                    </h1>
                    <p className="text-sm md:text-lg text-sub-title">
                      Edit your order and necessary information from here.
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="w-full py-3 px-6 md:px-4 mb-4">
                  <OrderDetailsFormMango
                    singleOrder={singleOrder}
                    rest={true}
                  />
                </div>

                <div className="w-full">
                  <div className="py-5 px-6 md:px-4 max-h-full grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <Link href={`/admin/orders/invoice/id=${id}`}>
                        <Button
                          onClick={onClick}
                          title="Cancel"
                          className="bg-red-100 hover:bg-red-200 hover:shadow-lg text-red-600 transition-all duration-300 w-full"
                        />
                      </Link>
                    </div>
                    <div className="col-span-2">
                      <FormBtn
                        disabled={loading}
                        loading={loading}
                        onClick={updateOrder}
                        title="Update"
                        className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AppForm>
        )}
      </div>
    </main>
  );
};

export default EditMangoOrder;
