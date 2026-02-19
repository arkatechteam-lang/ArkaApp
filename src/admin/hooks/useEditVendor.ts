import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminNavigation } from './useAdminNavigation';
import { validateUpdateVendor } from '../validators/updateVendor.validator';
import {
  getVendorByIdWithMaterials,
  getMaterials,
  updateVendorWithMaterials,
} from '../../services/middleware.service';
import type { CreateVendorInput, Material, VendorWithMaterials } from '../../services/types';

export function useEditVendor() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { goBack } = useAdminNavigation();

  const [vendor, setVendor] = useState<VendorWithMaterials | null>(null);
  const [loading, setLoading] = useState(true);

  const [updateVendorInput, setUpdateVendorInput] = useState<CreateVendorInput>({
    name: '',
    phone: '',
    alternate_phone: null,
    address: '',
    gst_number: null,
    notes: null,
  });

  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch materials on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setMaterialsLoading(true);
        const data = await getMaterials();
        if (mounted) setMaterials(data);
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        if (mounted) setMaterialsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch vendor data
  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) return;
      
      try {
        setLoading(true);
        const data = await getVendorByIdWithMaterials(vendorId);
        
        setVendor(data);
        setUpdateVendorInput({
          name: data.name,
          phone: data.phone || '',
          alternate_phone: data.alternate_phone || null,
          address: data.address || '',
          gst_number: data.gst_number || null,
          notes: data.notes || null,
        });
        
        setSelectedMaterialIds(data.materials.map((m) => m.id));
      } catch (error) {
        console.error('Failed to fetch vendor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  function updateInput(field: keyof CreateVendorInput, value: any) {
    setUpdateVendorInput((prev) => ({ ...prev, [field]: value }));
  }

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterialIds((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const validateForm = () => {
    const newErrors = validateUpdateVendor(updateVendorInput, selectedMaterialIds);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm() || !vendorId) return;

    try {
      setUpdating(true);

      await updateVendorWithMaterials(
        vendorId,
        {
          ...updateVendorInput,
          alternate_phone: updateVendorInput.alternate_phone?.trim() || null,
          gst_number: updateVendorInput.gst_number?.trim() || null,
          notes: updateVendorInput.notes?.trim() || null,
        },
        selectedMaterialIds
      );

      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Failed to update vendor:', err);
      setErrors((prev) => ({
        ...prev,
        form: (err as Error).message || 'Failed to update vendor',
      }));
      setShowFailurePopup(true);
    } finally {
      setUpdating(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    goBack('/admin/vendors');
  };

  const handleFailureClose = () => {
    setShowFailurePopup(false);
  };

  return {
    vendor,
    vendorId,
    loading,
    updateVendorInput,
    updateInput,
    selectedMaterialIds,
    materials,
    materialsLoading,
    handleMaterialToggle,
    errors,
    showSuccessPopup,
    showFailurePopup,
    updating,
    handleUpdate,
    handleSuccessClose,
    handleFailureClose,
    goBack,
  };
}
