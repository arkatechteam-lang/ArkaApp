import { useEffect, useState } from "react";
import {
  createMaterialPurchase,
} from "../services/materialPurchase.service";
import { MaterialPurchaseInput } from "../types";
import { createProcurement, getMaterials, getVendors, validateSession } from "../../services/middleware.service";
import { Material, Vendor } from "../../services/types";

export function useMaterialPurchase() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVendorList();
    getMaterialList();
  }, []);

  async function getVendorList() {
    try {
      const vendorList = await getVendors();
      setVendors(vendorList);
    } catch (err) {
      setError("Failed to load vendors");
    } finally {
      setVendorsLoading(false)
    }
  }

  async function getMaterialList() {
    try {
      const materialList = await getMaterials();
      setMaterials(materialList);
    } catch (err) {
      setError("Failed to load materials");
    } finally {
      setMaterialsLoading(false)
    }
  }

  async function submitMaterialPurchase(input: MaterialPurchaseInput) {
    try {
      setLoading(true);
      setError(null);
      const user = await validateSession()
      if(!user) throw new Error("User not authenticated");

      await createProcurement(input, user.id);
    } catch {
      setError("Failed to save material purchase");
      throw new Error();
    } finally {
      setLoading(false);
    }
  }

  return {
    vendors,
    vendorsLoading,
    materials,
    materialsLoading,
    submitMaterialPurchase,
    loading,
    error,
  };
}
