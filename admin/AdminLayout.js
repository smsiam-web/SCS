import { selectUser } from "@/app/redux/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "@/app/components/NotFound";
import { db } from "@/app/utils/firebase";

const AdminLayout = ({ children }) => {
  const [key, setKey] = useState(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Get key from firebase database
  useEffect(() => {
    const unSub = db.collection("authKey").onSnapshot((snap) => {
      snap.docs.map((doc) => {
        setKey(doc.data().key);
      });
    });
    return () => {
      unSub();
    };
  }, []);

  return <>{user?.authKey === key ? children : <NotFound />}</>;
};

export default AdminLayout;
