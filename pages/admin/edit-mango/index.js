import React from "react";
import AdminLayout from "@/admin/AdminLayout";
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";
import EditMangoOrder from "@/admin/components/placeOrder/mango/edit-mango";

const EditOrders = () => {
  return (
    <AdminLayout>
      <Link href={"/admin/place-order"}>
        <div className="flex max-w-2xl mx-auto items-center justify-start text-sub-title">
          <BsArrowLeftShort size={22} />
          <span>Back</span>
        </div>
      </Link>
      <EditMangoOrder className="pt-10" />
    </AdminLayout>
  );
};

export default EditOrders;
