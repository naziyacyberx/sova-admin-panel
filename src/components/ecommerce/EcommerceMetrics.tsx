import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import api from "../../utills/api";

export default function EcommerceMetrics() {
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalInactiveUsers, setTotalInactiveUsers] = useState(0);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, customersRes] = await Promise.all([
          api.get("/admin/api/users/all"),
          api.get("/admin/api/customer/all"),
        ]);
               
        setTotalActiveUsers(usersRes.data.users.length);
        setTotalInactiveUsers(customersRes.data.customers.length);
        setTotalDesigns(customersRes.data.totalDesigns || 20);
        setTotalOrders(customersRes.data.totalOrders || 4999);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* Total Active Users */}
      <div className="rounded-2xl border border-gray-200 p-2 bg-white dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-40">
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-center justify-center mt-0">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalActiveUsers}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Inactive Users */}
      <div className="rounded-2xl border border-gray-200 p-2 bg-white dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-40">
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-center justify-center mt-0">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalInactiveUsers}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Designs */}
      <div className="rounded-2xl border border-gray-200 p-2 bg-white dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-40">
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-center justify-center mt-0">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Designs
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalDesigns}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Orders */}
      <div className="rounded-2xl border border-gray-200 p-2 bg-white dark:border-gray-800 dark:bg-white/[0.03] md:p-6 h-40">
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-center justify-center mt-0">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalOrders}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
