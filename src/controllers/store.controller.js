import storeModel from "../models/store.model.js";


// create store
export const createStore = async (req, res, next) => {
  try {

    //  Only vendor can create store
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Only vendor can create store"
      });
    }

    //  Check existing store
    const existingStore = await storeModel.findOne({
      owner: req.user._id
    });

    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "Store already exists!"
      });
    }

    //  Get data from body
    const { storeName, description } = req.body;

    //Create store (FIXED FIELD NAME)
    const newStore = new storeModel({
      storeName,
      description,
      owner: req.user._id
    });

    await newStore.save();

    return res.status(201).json({
      success: true,
      message: "Store created successfully!",
      store: newStore
    });

  } catch (error) {
    next(error);
  }
};



// apprve store
export const approvedStore = async (req, res, next) => {
  try {

    //  Only admin can approve store
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can approve store!"
      });
    }

    //  Find store
    const store = await storeModel.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found!"
      });
    }

    // Approve store
    store.isApproved = true;

    await store.save();

    return res.status(200).json({
      success: true,
      message: "Store approved successfully!",
      store
    });

  } catch (error) {
    next(error);
  }
};

 