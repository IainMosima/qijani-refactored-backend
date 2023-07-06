
import { RequestHandler } from "express";
import PackageModel from "../models/package";
import createHttpError from "http-errors";
import mongoose from "mongoose"; 
import { assertIsDefined } from "../utils/asserIsDefined";
import * as ItemManager from "../utils/itemUpdateManger";

// getting packages belonging to a specific user
export const getPackages: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        
        const packages = await PackageModel.find({ userId: authenticatedUserId }).exec();

        res.status(200).json(packages);

    } catch (err) {
        next(err);
    }
}

// creating a new package
export interface newitemStructure {
    productId: string,
    price?: number
}

interface PackageBody {
    packageName?: string,
    productId: string,
    price?: number
}

export const createPackage: RequestHandler<unknown, unknown, PackageBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const packageName = req.body.packageName;
    const productId = req.body?.productId;
    const price = req.body?.price;

    const items: newitemStructure[] = [{productId, price}];    
    
    try {
        assertIsDefined(authenticatedUserId);

        if(!packageName) {
            throw createHttpError(400, "Package must have a name");
        }
        
        let newPackage;
        if(productId && price) {
          // making sure there are no duplicates products in item
          ItemManager.itemCreateManager(items);

          newPackage = await PackageModel.create({
            userId: authenticatedUserId,
            packageName: packageName,
            items: items
          });
        } else{
          newPackage = await PackageModel.create({
            userId: authenticatedUserId,
            packageName: packageName,
            items: []
          });
        }
        

        

        res.status(201).json(newPackage);

    } catch (err) {
        next(err);
    }
}



// updating a package
interface UpdatePackageParam {
    packageId: string
}

export interface itemStructure {
    productId: string,
    price?: number
}


interface UpdatePackageBody { 
    packageName: string,
    items: Array<itemStructure>
}


export const updatePackage: RequestHandler<UpdatePackageParam, unknown, UpdatePackageBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const packageId = req.params.packageId;
    const packageName = req.body.packageName;
    const items = req.body.items;
  
    try {
      assertIsDefined(authenticatedUserId);
  
      // making sure there are no duplicates products in item
      ItemManager.itemCreateManager(items);
  
      if (!mongoose.isValidObjectId(packageId)) {
        throw createHttpError(400, "Invalid product id");
      }
  
      if (!packageName) {
        throw createHttpError(404, "Product must have a name");
      }
  
      const packageFromDb = await PackageModel.findById(packageId).exec();
  
      if (packageFromDb) {
        if (!packageFromDb.userId.equals(authenticatedUserId)) {
          throw createHttpError(404, "You cannot access this package");
        }
  
        // item management
        if (packageFromDb.items && items) {
          // replace the contents of the items array with the contents of the updatedItems array
          packageFromDb.items.splice(0, packageFromDb.items.length, ...items);
        }
  
        // updating the package name
        packageFromDb.packageName = packageName;
  
        // saving the updated package
        const updatedPackage = await packageFromDb.save();
  
        res.status(200).send({ success: true, message: "Package updated successfully", data: updatedPackage });
  
      } else {
        throw createHttpError(404, "Package not found");
      }
  
    } catch (err) {
      next(err);
    }
  }

// deleting a package
export const deletePackage: RequestHandler = async (req, res, next) => {
  const packageId = req.params.packageId;

  try {
    if (!mongoose.isValidObjectId(packageId)) {
      throw createHttpError(400, 'Invalid package id!');
    }

    const packageFromDb = await PackageModel.findById(packageId).exec();

    if(!packageFromDb) {
      throw createHttpError(404, 'Package not found');
    }

    await packageFromDb.remove();

    res.sendStatus(204);

  } catch (err) {
    next(err);
  }
}

// getting a package 
export const getPackage: RequestHandler = async (req, res, next) => {
  const packageId = req.params.packageId;

  try {
    if (!mongoose.isValidObjectId(packageId)) {
      throw createHttpError(400, 'Invalid package id!');
    }
    const packageFromDb = await PackageModel.findById(packageId).exec();

    if (packageFromDb) {
      res.status(200).json(packageFromDb);
    } else {
      throw createHttpError(400, 'Package not found!');
    }

  } catch (err) {
    next(err);
  }
}
