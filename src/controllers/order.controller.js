import orderModel from "../models/order.model.js";

// CREATE ORDER
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    const order = await orderModel.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: `Order placed successfully by ${req.user.username}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// GET MY ORDERS
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .populate("orderItems.product", "name price ");

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ORDER
export const getMySingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await orderModel
      .findById(id)
      .populate("user", "username email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - GET ALL ORDERS
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find()
      .populate("orderItems.product", "name price");

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// update order status

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // admin update all products
    if (req.user.role === "admin") {
      order.orderStatus = orderStatus;
      await order.save();
    }

    // vendor update specific product related to their own store
    if (req.user.role === "vendor") {
      const isOwner = order.orderItems.some(
        (item) => item.product.owner.toString() === req.user._id.toString(),
      );

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: `Dear ${req.user.userName} You can only update prouducts in  your own store`,
        });
      }
      order.orderStatus = orderStatus;
      await order.save();
    }

    return res.status(200).json({
      succcess: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// get total revenue

export const getTotalRevenue = async (req, res, next) => {
  try {
    const orders = await orderModel.find({orderStatus:'Paid || paid' });
    const revenue = orders.reduce((acc, orders) => {
      return acc + orders.totalPrice;
    }, 0);
    res.status(200).json({
      success: true,
      totalRevenue: revenue,
    });
  } catch (error) {
    next(error);
  }
};

// get specific orders by vendor

export const getVendorOrders = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const orders = orderModel
      .find()
      .populate("orderItems.product", "name owner");
    const vendorOrders = orders.filter((order) =>
      order.orderItems.some(
        (item) => item.product.owner.toString() === vendorId.toString(),
      ),
    );

    return res.status(200).json({
      success: true,
      count:vendorOrders.length,
      orders:vendorOrders
    });
  } catch (error) {
    next(error);
  }
};
