import React, { useEffect, useState, useRef } from "react";
import Button from "@/app/components/shared/Button";
import { AiOutlineAppstoreAdd, AiOutlinePrinter } from "react-icons/ai";
import { db } from "@/app/utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  ToDateAndTime,
  daysInMonth,
  generateStick,
  invoiceGenerate,
  updateOrderStatus,
} from "@/admin/utils/helpers";
import singleOrderSlice, {
  updateSingleOrder,
} from "@/app/redux/slices/singleOrderSlice";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip, LoadingOverlay, Group, Box } from "@mantine/core";
import { FaCloudUploadAlt, FaPrint } from "react-icons/fa";
import { useBarcode } from "next-barcode";
import { notifications } from "@mantine/notifications";
import { selectUser } from "@/app/redux/slices/authSlice";
import Link from "next/link";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { selectOrder, updateOrder } from "@/app/redux/slices/orderSlice";
import { IoCall } from "react-icons/io5";
import BarcodeComponent from "@/admin/utils/BarcodeImage";

const SearchBy = ({ onClick }) => {
  const [currentValue, setCurrentValue] = useState("RA014");
  const [filterOrder, setFilterOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(useSelector(selectOrder));
  const [barcodeImage, setBarcodeImage] = useState("");
  const [order, setOrder] = useState([]);
  const [fillByStatus, setFillByStatus] = useState(null);
  const [openedd, setOpened] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const CITIES = [
    {
      city_id: 52,
      city_name: "Bagerhat",
    },
    {
      city_id: 62,
      city_name: "Bandarban ",
    },
    {
      city_id: 34,
      city_name: "Barguna ",
    },
    {
      city_id: 17,
      city_name: "Barisal",
    },
    {
      city_id: 32,
      city_name: "B. Baria",
    },
    {
      city_id: 53,
      city_name: "Bhola",
    },
    {
      city_id: 9,
      city_name: "Bogra",
    },
    {
      city_id: 8,
      city_name: "Chandpur",
    },
    {
      city_id: 15,
      city_name: "Chapainawabganj",
    },
    {
      city_id: 2,
      city_name: "Chittagong",
    },
    {
      city_id: 61,
      city_name: "Chuadanga",
    },
    {
      city_id: 11,
      city_name: "Cox's Bazar",
    },
    {
      city_id: 5,
      city_name: "Cumilla",
    },
    {
      city_id: 1,
      city_name: "Dhaka",
    },
    {
      city_id: 35,
      city_name: "Dinajpur",
    },
    {
      city_id: 18,
      city_name: "Faridpur",
    },
    {
      city_id: 6,
      city_name: "Feni",
    },
    {
      city_id: 38,
      city_name: "Gaibandha",
    },
    {
      city_id: 22,
      city_name: "Gazipur",
    },
    {
      city_id: 56,
      city_name: "Gopalgonj ",
    },
    {
      city_id: 30,
      city_name: "Habiganj",
    },
    {
      city_id: 41,
      city_name: "Jamalpur",
    },
    {
      city_id: 19,
      city_name: "Jashore",
    },
    {
      city_id: 27,
      city_name: "Jhalokathi",
    },
    {
      city_id: 49,
      city_name: "Jhenidah",
    },
    {
      city_id: 48,
      city_name: "Joypurhat",
    },
    {
      city_id: 63,
      city_name: "Khagrachari",
    },
    {
      city_id: 20,
      city_name: "Khulna",
    },
    {
      city_id: 42,
      city_name: "Kishoreganj",
    },
    {
      city_id: 55,
      city_name: "Kurigram ",
    },
    {
      city_id: 28,
      city_name: "Kushtia",
    },
    {
      city_id: 40,
      city_name: "Lakshmipur",
    },
    {
      city_id: 57,
      city_name: "Lalmonirhat ",
    },
    {
      city_id: 43,
      city_name: "Madaripur",
    },
    {
      city_id: 60,
      city_name: "Magura ",
    },
    {
      city_id: 16,
      city_name: "Manikganj",
    },
    {
      city_id: 50,
      city_name: "Meherpur",
    },
    {
      city_id: 12,
      city_name: "Moulvibazar",
    },
    {
      city_id: 23,
      city_name: "Munsiganj",
    },
    {
      city_id: 26,
      city_name: "Mymensingh",
    },
    {
      city_id: 46,
      city_name: "Naogaon",
    },
    {
      city_id: 54,
      city_name: "Narail ",
    },
    {
      city_id: 21,
      city_name: "Narayanganj",
    },
    {
      city_id: 47,
      city_name: "Narshingdi",
    },
    {
      city_id: 14,
      city_name: "Natore",
    },
    {
      city_id: 44,
      city_name: "Netrakona",
    },
    {
      city_id: 39,
      city_name: "Nilphamari",
    },
    {
      city_id: 7,
      city_name: "Noakhali",
    },
    {
      city_id: 24,
      city_name: "Pabna",
    },
    {
      city_id: 37,
      city_name: "Panchagarh",
    },
    {
      city_id: 29,
      city_name: "Patuakhali",
    },
    {
      city_id: 31,
      city_name: "Pirojpur",
    },
    {
      city_id: 58,
      city_name: "Rajbari ",
    },
    {
      city_id: 4,
      city_name: "Rajshahi",
    },
    {
      city_id: 59,
      city_name: "Rangamati ",
    },
    {
      city_id: 25,
      city_name: "Rangpur",
    },
    {
      city_id: 51,
      city_name: "Satkhira",
    },
    {
      city_id: 64,
      city_name: "Shariatpur ",
    },
    {
      city_id: 33,
      city_name: "Sherpur",
    },
    {
      city_id: 10,
      city_name: "Sirajganj",
    },
    {
      city_id: 45,
      city_name: "Sunamganj",
    },
    {
      city_id: 3,
      city_name: "Sylhet",
    },
    {
      city_id: 13,
      city_name: "Tangail",
    },
    {
      city_id: 36,
      city_name: "Thakurgaon ",
    },
  ];

  useEffect(() => {
    if (selectedCity) {
      setZonesLoading(true); // Start loading
      fetch(`/api/pathao/zones?city_id=${selectedCity}`)
        .then((res) => res.json())
        .then((data) => {
          setZones(data.data || []);
        })
        .catch((err) => {
          console.error("Failed to load zones", err);
          setZones([]); // fallback
        })
        .finally(() => {
          setZonesLoading(false); // End loading
        });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedZone) {
      setAreaLoading(true);
      fetch(`/api/pathao/areas?zone_id=${selectedZone}`)
        .then((res) => res.json())
        .then((data) => {
          setAreas(data.data || []);
        })
        .catch((err) => {
          console.error("Failed to load Areas", err);
          setAreas([]);
        })
        .finally(() => {
          setAreaLoading(false);
        });
    }
  }, [selectedZone]);

  useEffect(() => {
    if (!!opened) return;
    resetFilter();
  }, [opened]);

  const resetFilter = () => {
    setCurrentValue("RA014");
    setFilterOrder(null);
    setBarcodeImage("");
  };

  useEffect(() => {
    setOrder(orders);
  }, [orders]);

  const handleChange = (e) => {
    setCurrentValue(e.currentTarget.value);
    // resetFilter();
  };
  const toggleOpen = () => {
    opened ? setOpened(false) : setOpened(true);
    resetFilter();
  };

  const handleImageReady = (image) => {
    setBarcodeImage(image);
  };

  const { inputRef } = useBarcode({
    value: `${filterOrder?.sfc?.consignment_id}`,
    options: {
      background: "#FFFFFF",
      displayValue: false,
      width: 3,
      height: 80,
    },
  });

  // Change Status from print Action and check print Status
  const stickerStatus = async (item) => {
    item.status === "Processing"
      ? await updateStatus(item, "Shipped")
      : toggleOpen;
    item.status === "Processing" && generateStick(item, barcodeImage);
    resetFilter();
  };

  // Change Status from print Action and check print Status
  const getInvoice = async (item) => {
    item.status === "Pending" && invoiceGenerate(item);

    item.status === "Pending"
      ? updateStatus(item, "Processing", item?.id)
      : toggleOpen;
    close();
    resetFilter();
    //   console.log(item);
  };

  // Change Status from status Action
  const onStatusChanged = async (e, id) => {
    e.preventDefault();
    const newStatus = e.target.value;
    updateStatus(filterOrder, newStatus);
  };

  // update status on firebase
  const updateStatus = async (order, newStatus) => {
    const success = await updateOrderStatus(db, order.id, order, newStatus);
    if (success) {
      notifications.show({
        title: "Status Updated Successfully",
        message: `Order #${order.id} status changed to ${newStatus}.`,
        color: "blue",
        autoClose: 4000,
      });
      resetFilter();
      close();
    } else {
      notifications.show({
        title: "Status Update Failed",
        message: "An error occurred while updating the status.",
        color: "red",
        autoClose: 4000,
      });
      resetFilter();
    }
  };

  // // search config
  // useEffect(() => {
  //   let ss = [];
  //   if (!currentValue) {
  //     dispatch(updateOrder(orders));
  //     ss = [];
  //     return;
  //   }

  //   const res = orders.map((i) => {
  //     if (
  //       i.customer_details.customer_name
  //         .toLowerCase()
  //         .split(" ")
  //         .includes(currentValue?.toLowerCase())
  //     ) {
  //       ss.push({ ...i });
  //     } else if (i.customer_details.phone_number === currentValue) {
  //       ss.push({ ...i });
  //     } else if (i.id.toLowerCase() === currentValue.toLowerCase()) {
  //       ss.push({ ...i });
  //     } else if (
  //       i.customer_details.customer_name.toLowerCase() ===
  //       currentValue.toLowerCase()
  //     ) {
  //       ss.push({ ...i });
  //     } else if (
  //       i.customer_details.customer_address
  //         .toLowerCase()
  //         .split(" ")
  //         .includes(currentValue?.toLowerCase())
  //     ) {
  //       ss.push({ ...i });
  //     } else if (i.date === currentValue) {
  //       ss.push({ ...i });
  //     }
  //   });

  //   ss.length ? dispatch(updateOrder(ss)) : dispatch(updateOrder(orders));
  // }, [currentValue]);

  useEffect(() => {
    const value = currentValue?.toUpperCase();
    if (
      (value?.split("0")[0] === "RA" && value.length === 9) ||
      value.length === 8
    ) {
      filter(value);
    }
  }, [currentValue]);

  // onStatus config
  const statusChange = (e) => {
    e.preventDefault();
    const selectedStatus = e.target.value.toLowerCase();

    const filteredOrders = orders.filter(
      (order) =>
        selectedStatus === "status" ||
        order.status.toLowerCase() === selectedStatus
    );

    dispatch(updateOrder(filteredOrders));
  };

  // // onLimits Config
  // const onLimitChanged = (e) => {
  //   e.preventDefault();
  //   // if(e.target.value === "All"){
  //   //   return;
  //   // }
  //   let limits = [];
  //   const date = new Date();
  //   const dateAgo = parseInt(e.target.value) - 1;

  //   const res = orders.map((item) => {
  //     if (item.timestamp.toDate().getMonth() === date.getMonth()) {
  //       if (item.timestamp.toDate().getDate() >= date.getDate() - dateAgo) {
  //         limits.push(item);
  //       }
  //     }

  //     if (
  //       date.getDate() - dateAgo < 1 &&
  //       date.getMonth() - 1 === item.timestamp.toDate().getMonth()
  //     ) {
  //       if (
  //         item.timestamp.toDate().getDate() >=
  //         daysInMonth(date.getMonth() - 1, date.getFullYear()) +
  //           date.getDate() -
  //           dateAgo
  //       ) {
  //         limits.push(item);
  //       }
  //     }
  //   });
  //   limits.length
  //     ? dispatch(updateOrder(limits))
  //     : dispatch(updateOrder(orders));
  // };

  const filter = async (id) => {
    await db
      .collection("placeOrder")
      .doc(id)
      .get()
      .then((doc) => {
        if (!!doc.data()) {
          const singleOrder = { id: doc.id, ...doc.data() };
          dispatch(updateSingleOrder([singleOrder]));
          setFilterOrder(singleOrder);
          open();
        }
      });
  };

  const sendItCourier = async (singleOrder) => {
    if (!singleOrder) return;
    setLoading(true);
    if (selectedCity && selectedZone && selectedArea) {
      const order = singleOrder?.order;
      const values = singleOrder?.customer_details;
      if (order.length) {
        let totalLot = 0;
        order.forEach((item) => {
          totalLot += item?.lot || 0;
        });

        const perLotCondition = Math.round(values?.salePrice / totalLot);

        for (const item of order) {
          console.log(item);
          for (let i = 0; i < item?.lot; i++) {
            const orderss = {
              store_id: `${item?.store_id}`,
              merchant_order_id: `${singleOrder.id}_${item?.sku}0${i + 1}`,
              recipient_name: `${values?.customer_name}`,
              recipient_phone: `${values?.phone_number}`,
              recipient_address: `${
                values?.delivery_type
                  ? "(HOME Delivery), "
                  : "(POINT Delivery), "
              }${values?.customer_address}`,
              recipient_city: selectedCity,
              recipient_zone: selectedZone,
              recipient_area: selectedArea,
              delivery_type: 48,
              item_type: 2,
              special_instruction: `${values?.note}`,
              item_quantity: 1,
              item_weight: "1",
              item_description: "1 Carat Mango.",
              amount_to_collect: perLotCondition,
            };

            console.log(orderss);

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
                autoClose: 8000,
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
      setSelectedCity("");
      setSelectedZone("");
      setSelectedArea("");
      setLoading(false);
    } else {
      notifications.show({
        title: "Send Error",
        message: "Select city, zone, area Fast",
        color: "red",
        autoClose: 6000,
      });
    }
    setSelectedCity("");
    setSelectedZone("");
    setSelectedArea("");
    setLoading(false);
  };

  console.log(selectedCity, selectedZone, selectedArea);

  return (
    <>
      <Modal opened={opened} onClose={close} size="xl" title="Found Data...">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pink", type: "bars" }}
        />
        {filterOrder && (
          <div className="p-3">
            <div className="flex justify-end gap-2">
              <div
                className={`inline-block px-4 text-center ${
                  user.staff_role === "HR" ||
                  user.staff_role == "Admin" ||
                  user.staff_role === "Sales Manager"
                    ? ""
                    : "hidden"
                }`}
              >
                <select
                  className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer text-xs text-white font-medium hover:shadow-lg transition-all duration-300"
                  onChange={(e) => onStatusChanged(e, filterOrder.id)}
                >
                  <option
                    value={filterOrder.status}
                    className="capitalize"
                    hidden
                  >
                    {filterOrder.status}
                  </option>

                  <option value="Pending">Pending</option>
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Processing">Processing</option>
                  )}
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Shipped">Shipped</option>
                  )}
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Delivered">Delivered</option>
                  )}

                  <option value="Hold">Hold</option>
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Returned">Returned</option>
                  )}

                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {(user.staff_role === "HR" ||
                user.staff_role === "Parcel Executive") && (
                <div onClick={() => sendItCourier(filterOrder)}>
                  <span className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer  text-xs text-white font-medium hover:shadow-lg transition-all duration-300">
                    <FaCloudUploadAlt size={14} /> Send it{" "}
                    {filterOrder?.customer_details.courier}
                  </span>
                </div>
              )}
              {((filterOrder.status === "Pending" &&
                user.staff_role === "Sales Executive") ||
                user.staff_role === "HR" ||
                user?.staff_role === "Sales Manager" ||
                user?.staff_role === "Admin") && (
                <Link href={`/admin/edit-mango/id=${filterOrder.id}`}>
                  <span className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer  text-xs text-white font-medium hover:shadow-lg transition-all duration-300">
                    <FiEdit size={14} /> Edit
                  </span>
                </Link>
              )}
              <Link href={`/admin/orders/invoice/id=${filterOrder.id}`}>
                <span className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer  text-xs text-white font-medium hover:shadow-lg transition-all duration-300">
                  <HiOutlineDocumentDownload size={18} /> Invoice
                </span>
              </Link>
            </div>
            <div>
              <h1 className="text-center text-2xl font-semibold pb-1">
                ID #{filterOrder.id} ({filterOrder.status})
              </h1>
              <div className="hidden">
                <BarcodeComponent
                  value={filterOrder?.sfc?.consignment_id}
                  onImageReady={handleImageReady}
                />
              </div>
              <h1 className="text-center text-2xl font-semibold border-b pb-3">
                Courier #{filterOrder?.customer_details?.courier}
              </h1>
            </div>

            <div className="pt-3 flex justify-between w-full">
              <div className="w-7/12">
                <h2 className="text-lg font-semibold">
                  {filterOrder.customer_details.customer_name}
                </h2>
                <h2>
                  Address: {filterOrder.customer_details.customer_address}
                </h2>
                <div className="flex text-center items-center gap-2">
                  <h2>Contact: {filterOrder.customer_details.phone_number}</h2>
                  <Link
                    className="bg-blue-400 inline-block  items-center px-2 py-1 rounded-md cursor-pointer hover:bg-blue-500 text-sm text-white font-medium hover:shadow-lg transition-all duration-300"
                    href={`tel:+88${filterOrder.customer_details?.phone_number}`}
                  >
                    <IoCall size={14} />
                  </Link>
                </div>
                <h2 className="text-slate-600">
                  Note: {filterOrder?.customer_details?.note || "N/A"}
                </h2>
              </div>
              <div className="w-4/12 text-end">
                <h3>{ToDateAndTime(filterOrder.timestamp)}</h3>
                <h3>
                  Order type:{" "}
                  {filterOrder.customer_details?.order_from || "N/A"}
                </h3>
                <h3>
                  Received by:{" "}
                  {filterOrder.customer_details?.received_by || "N/A"}
                </h3>
                <h3>
                  Entry by: {filterOrder?.placeBy?.user || filterOrder.placeBy}
                </h3>
                {filterOrder?.updateBy && (
                  <h3>Updated by: {filterOrder?.updateBy?.user || "N/A"}</h3>
                )}

                <h3>
                  Weight:{" "}
                  {filterOrder?.order.length &&
                  filterOrder?.order[0].type === "mango"
                    ? filterOrder.weight * 12
                    : filterOrder.weight}
                  kg
                </h3>
                {filterOrder?.order.length &&
                  filterOrder?.order[0].type === "mango" && (
                    <h3>Lot: {filterOrder.weight}</h3>
                  )}
              </div>
            </div>
            <div>
              {(user.staff_role === "HR" ||
                user.staff_role === "Parcel Executive") && (
                <div className="pb-4">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block mb-1 font-semibold"
                      >
                        City
                      </label>
                      <select
                        id="city"
                        className="w-full p-2 border rounded"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <option value="">Select a city</option>
                        {CITIES.map((city) => (
                          <option key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="zone"
                        className="block mb-1 font-semibold"
                      >
                        Zone
                      </label>
                      <select
                        id="zone"
                        className="w-full p-2 border rounded"
                        disabled={!selectedCity}
                        onChange={(e) => setSelectedZone(e.target.value)}
                      >
                        <option value="">
                          {zonesLoading ? "Loading zones..." : "Select a zone"}
                        </option>
                        {!zonesLoading &&
                          Array.isArray(zones.data) &&
                          zones?.data.map((zone) => (
                            <option key={zone?.zone_id} value={zone?.zone_id}>
                              {zone?.zone_name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="zone"
                        className="block mb-1 font-semibold"
                      >
                        Zone
                      </label>
                      <select
                        id="zone"
                        className="w-full p-2 border rounded"
                        disabled={!selectedZone}
                        onChange={(e) => setSelectedArea(e.target.value)}
                      >
                        <option value="">
                          {areaLoading ? "Loading areas..." : "Select a area"}
                        </option>
                        {!areaLoading &&
                          Array.isArray(areas.data) &&
                          areas?.data.map((area) => (
                            <option key={area.area_id} value={area.area_id}>
                              {area.area_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h1 className="text-2xl">Order:</h1>
                <div className="border-t my-2">
                  {filterOrder &&
                    filterOrder?.order.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between py-1 md:py-1 border-b">
                          <div>
                            <h2
                              className="text-sm sm:text-xl text-title font-mono"
                              id={`item_0${++i}`}
                            >
                              {item.title}
                            </h2>
                          </div>
                          <div className="flex justify-between w-7/12">
                            <span
                              className="text-sm sm:text-xl text-title font-mono"
                              id={`item_0${i}_quantity`}
                            >
                              {item.quantity}kg
                            </span>
                            <span
                              className="text-sm sm:text-xl text-title font-mono"
                              id={`item_0${i}_price`}
                            >
                              {item.price}
                            </span>
                            <span
                              className="text-sm sm:text-xl text-title font-mono"
                              id={`item_0${i}_total_price`}
                            >
                              {item.total_price}/-
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-10 gap-5">
              <div className=" ">
                <h2 className="text-slate-600 ">
                  [Note: {filterOrder?.customer_details?.invoice_Note || "N/A"}]
                </h2>
              </div>
              <div className="text-sm flex ">
                <div className="text-sm sm:text-xl text-title font-semibold">
                  <h2>Sub-Total</h2>
                  <h2>Delivery</h2>
                  <h2>Discount</h2>
                  <h2>Total</h2>
                </div>
                <div className="text-sm sm:text-xl text-title font-semibold px-4">
                  <h2>:</h2>
                  <h2>:</h2>
                  <h2>:</h2>
                  <h2>:</h2>
                </div>
                <div className="text-sm sm:text-xl text-title font-semibold text-right">
                  <h2>{filterOrder?.totalPrice}/-</h2>
                  <h2>{filterOrder?.deliveryCrg}/-</h2>
                  <h2>-{filterOrder?.discount}/-</h2>
                  <h2>{filterOrder?.customer_details.salePrice}/-</h2>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              {user.staff_role === "HR" &&
                filterOrder.status === "Processing" && (
                  <Tooltip label="Sticker" color="green" withArrow>
                    <button
                      title="Sticker"
                      className="bg-green-400 flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-green-500 text-sm text-white font-medium hover:shadow-lg transition-all duration-300"
                      onClick={() => stickerStatus(filterOrder)}
                    >
                      <FaPrint size={14} /> Sticker
                    </button>
                  </Tooltip>
                )}
              {(user.staff_role === "HR" || user.staff_role === "Admin") &&
                filterOrder.status === "Pending" && (
                  <Tooltip label="Invoice" color="blue" withArrow>
                    <button
                      title="Invoice"
                      className="bg-blue-400 flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-500 text-sm text-white font-medium hover:shadow-lg transition-all duration-300"
                      onClick={() => getInvoice(filterOrder)}
                    >
                      <AiOutlinePrinter size={18} /> Invoice
                    </button>
                  </Tooltip>
                )}
            </div>
          </div>
        )}
      </Modal>
      <div className="hidden">
        <img ref={inputRef} alt="ok" />
      </div>
      <div className="min-w-0 rounded-lg overflow-hidden bg-gray-50  shadow-xs  mb-5">
        <div className="p-4">
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <div className="flex-grow-0  md:flex-grow lg:flex-grow xl:flex-grow">
                <input
                  className="block w-full px-3 py-1 text-sm focus:outline-neutral-200 leading-5 rounded-md  border-gray-200 h-14 bg-gray-100 border-transparent focus:bg-white"
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleChange(e)}
                  placeholder="Search by #ID"
                />
              </div>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-gray-50"
                id="roleItem"
                name="roleItem"
                // onChange={(e) => statusChange(e)}
              >
                <option>Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Hold">Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-white"
                onChange={(e) => onLimitChanged(e)}
              >
                <option value="All">Order limits</option>
                <option value="1">Today's orders</option>
                <option value="7">Last 7 days orders</option>
                <option value="10">Last 10 days orders</option>
                <option value="15">Last 15 days orders</option>
                <option value="30">Last 30 days orders</option>
              </select>
            </div>

            <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button
                onClick={onClick}
                title="Place Order"
                className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg transition-all duration-300 text-white w-full h-14"
                icon=<AiOutlineAppstoreAdd size={24} />
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBy;
