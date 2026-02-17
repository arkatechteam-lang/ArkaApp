import { useState, useEffect } from 'react';
import { useAdminNavigation } from './useAdminNavigation';
import { validateCreateVendor } from '../validators/createVendor.validator';
import { createVendorWithMaterials, getMaterials } from '../../services/middleware.service';
import type { CreateVendorInput, Material } from '../../services/types';

export function useCreateVendor() {
  const { goBack } = useAdminNavigation();

  const [createVendorInput, setCreateVendorInput] = useState<CreateVendorInput>({
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
  const [loading, setLoading] = useState(false);

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

  function updateCreateVendorInput(field: keyof CreateVendorInput, value: any) {
    setCreateVendorInput(prev => ({ ...prev, [field]: value }));
  }

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterialIds(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const validateForm = () => {
    const newErrors = validateCreateVendor(createVendorInput, selectedMaterialIds);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      await createVendorWithMaterials(
        {
          ...createVendorInput,
          alternate_phone: createVendorInput.alternate_phone?.trim() || null,
          gst_number: createVendorInput.gst_number?.trim() || null,
          notes: createVendorInput.notes?.trim() || null,
        },
        selectedMaterialIds
      );

      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Failed to create vendor:', err);
      setErrors(prev => ({ ...prev, form: (err as Error).message || 'Failed to create vendor' }));
      setShowFailurePopup(true);
    } finally {
      setLoading(false);
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
    createVendorInput,
    updateCreateVendorInput,
    selectedMaterialIds,
    materials,
    materialsLoading,
    handleMaterialToggle,
    errors,
    showSuccessPopup,
    showFailurePopup,
    loading,
    handleCreate,
    handleSuccessClose,
    handleFailureClose,
    goBack,
  };
}
