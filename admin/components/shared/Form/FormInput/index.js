import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { Tooltip } from "@mantine/core";
import { db } from "@/app/utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSingleCustomer,
  updateSingleCustomer,
} from "@/app/redux/slices/singleCustomerSlice";
import { selectProduct } from "@/app/redux/slices/productSlice";
import {
  selectWeightDetails,
  updateWeightDetails,
} from "@/app/redux/slices/tempWeightDetails";

function FormInput({
  item,
  id,
  name,
  tooltip = false,
  hoverBoxContent,
  type = "text",
  editProfile = false,
  edit_input,
  ...otherProps
}) {
  const { setFieldTouched, setValues, handleChange, errors, touched, values } =
    useFormikContext();
  const [inputType, setInputType] = useState(type);
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const getCustomer = useSelector(selectSingleCustomer);
  const products = useSelector(selectProduct);
  const details = useSelector(selectWeightDetails);

  useEffect(() => {
    const filter = [];
    products?.filter(
      (item) => item.product_details.product_type === "আম" && filter.push(item)
    );
    setProduct(filter);
  }, []);

  useEffect(() => {
    setCustomer(getCustomer);
  }, [getCustomer]);

  useEffect(() => {
    if (id !== "mango") return;
    product?.map((i) => {
      if (name === "gopalvhog_aam_12kg") {
        const Weight = values?.gopalvhog_aam_12kg * 12;
        const sale_price = Weight * item?.sale_price;
        dispatch(
          updateWeightDetails({
            name: i?.product_details?.yup,
            weight: Weight || 0,
            price: sale_price || 0,
          })
        );
      }
    });
  }, [values]);

  useEffect(() => {
    setValues({
      ...values,
      customer_name: customer?.cus_name || "",
      customer_address: customer?.cus_address || "",
    });

    setLoading(false);
  }, [customer]);

  useEffect(() => {
    if (name === "phone_number") {
      values.phone_number.length === 11 && customerData(values.phone_number);
    }
  }, [values?.phone_number]);

  const customerData = async (id) => {
    setLoading(true);
    dispatch(updateSingleCustomer([]));
    await db
      .collection("createCustomer")
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.data()) dispatch(updateSingleCustomer([]));
        if (!!doc.data()) {
          const customer = { ...doc.data() };
          dispatch(updateSingleCustomer(customer));
        }
      });
  };

  return (
    <div className={`${!editProfile ? "mb-4" : ""}`}>
      <div className="relative flex items-center">
        <input
          name={name}
          onBlur={() => setFieldTouched(name)}
          onChange={handleChange(name)}
          value={values[name]}
          type={inputType}
          {...otherProps}
          className={`outline-none border-[1px] py-3 text-sm appearance-none opacity-75 text-title px-5 rounded-md w-full border-gray-200 focus:outline-none
        focus:border-primary transition duration-200
        focus:ring-0 ease-in-out ${!editProfile ? "app_input" : edit_input}`}
        />
        {!!tooltip && (
          <span className="ml-2">
            <Tooltip
              wrapLines
              withArrow
              width={220}
              label={tooltip}
              color="dark"
              position="right"
              transition="fade"
              transitionDuration={200}
            >
              <BsFillInfoCircleFill color="#63CF50" />
            </Tooltip>
          </span>
        )}
        {type === "password" && (
          <>
            {inputType == "password" ? (
              <AiFillEye
                onClick={() => setInputType("text")}
                className={`absolute z-20 cursor-pointer right-0 mr-4 text-[#63CF50]`}
                size={23}
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setInputType("password")}
                className={`absolute z-20 cursor-pointer right-0 mr-4 text-[#63CF50]`}
                size={23}
              />
            )}
          </>
        )}
      </div>
      {touched[name] && (
        <span className="text-red-400 text-sm">{errors[name]}</span>
      )}
    </div>
  );
}

export default FormInput;
