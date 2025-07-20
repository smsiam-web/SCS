import React, { useState } from "react";
import ProductDetailsFrom from "./ProductDetailsFrom";
import * as Yup from "yup";
import { AppForm, FormBtn } from "../../shared/Form";
import { uuid } from "../../../utils/helpers";
import FormHeader from "../../shared/FormHeader";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectProductImg } from "@/app/redux/slices/updateProductImg";
import { selectUpdateProductId } from "@/app/redux/slices/updateProductId";

const validationSchema = Yup.object().shape({
  sku: Yup.string().label("Product SKU"),
  product_name: Yup.string().max(200).required().label("Product Title"),
  yup: Yup.string().max(200).required().label("Memo Name"),
  slug: Yup.string().required().label("1"),
  product_description: Yup.string()
    .max(500)
    .required()
    .label("Product details"),
  parent_category: Yup.string().required().label("Select parent category"),
  product_type: Yup.string().required().label("Select type"),
  available_from: Yup.date().required().label("Select Date"),
  unit: Yup.string().required().label("Unit"),
  stock: Yup.number().required().label("Quantity"),
  price: Yup.number().required().label("Price"),
  store_id: Yup.number().required().label(0),
  sale_price: Yup.number().label("Sale price"),
  product_tag: Yup.string()
    .required()
    .label("Product Tag (Write then press enter to add another new tag)"),
});

const AddProduts = ({ onClick }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const router = useRouter();

  const product_details = product && product[0]?.product_details;

  const productImg = useSelector(selectProductImg);
  const ProductID = useSelector(selectUpdateProductId);
  // const ID = "b99ffeca77b2532e";

  // place product handler on submit
  const placeProduct = async (values) => {
    setLoading(true);

    console.log(values);

    // offer calC
    const price = parseInt(values.price);
    const sale_price = parseInt(values.sale_price);
    const off = ((price - sale_price) / price) * 100;
    const off_price = Math.round(off);

    const product_id = uuid();

    // await saveProductDetails(values, product_id);
    await placeProductHandler(values, product_id, off_price);
    router.push("/admin/products/id=?" + product_id);
    setLoading(false);
  };

  // save order details on firebase database
  const placeProductHandler = async (values, product_id, off_price) => {
    console.log({
      productImg,
      product_details: values,
      isPublished: false,
      weight: 12,
      off_price,
      timestamp,
    });
    await db.collection("products").doc(product_id).set({
      productImg,
      product_details: values,
      isPublished: false,
      weight: 12,
      off_price,
      timestamp,
    });
  };

  return (
    <main>
      <div>
        <AppForm
          initialValues={{
            sku: product_details?.sku || "",
            product_name: product_details?.product_name || "",
            yup: product_details?.yup || "",
            slug: product_details?.slug || "",
            product_description: product_details?.product_description || "",
            parent_category: product_details?.parent_category || "",
            product_type: product_details?.product_type || "",
            unit: product_details?.unit || "",
            stock: product_details?.stock || "",
            price: product_details?.price || "",
            sale_price: product_details?.sale_price || "",
            available_from: product_details?.available_from || "",
            product_tag: product_details?.product_tag || "",
            store_id: product_details?.store_id || 0,
          }}
          onSubmit={placeProduct}
          validationSchema={validationSchema}
        >
          <div className="h-screen relative">
            <div className="w-full">
              <FormHeader
                onClick={onClick}
                title={"Add Product"}
                sub_title="Add your product and necessary information from here."
              />
            </div>

            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <ProductDetailsFrom />
            </div>

            <div className="fixed bottom-0 right-0 w-full bg-gray-50">
              <div className="py-5 px-6 md:px-4 max-h-full grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Button
                    onClick={onClick}
                    title="Cancel"
                    className="bg-red-100 hover:bg-red-200 hover:shadow-lg text-red-600 transition-all duration-300 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <FormBtn
                    loading={loading}
                    onClick={placeProduct}
                    title={"Add Product"}
                    className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </AppForm>
      </div>
    </main>
  );
};

export default AddProduts;
