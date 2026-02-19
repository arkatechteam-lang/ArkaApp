import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminNavigation } from './useAdminNavigation';
import type { Vendor } from '../../services/types';

export function useVendorLedger() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { goBack, goTo } = useAdminNavigation();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) return;
      
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const vendor = await getVendorById(vendorId);
        // setVendor(vendor);
        
        // Mock data for now
        setVendor({
          id: vendorId,
          name: 'ABC Suppliers',
          phone: '9876543210',
          alternate_phone: null,
          address: '123 Main Street',
          gst_number: 'GST123456',
          notes: null,
        //   created_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to fetch vendor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  return {
    vendor,
    vendorId,
    loading,
    goBack,
    goTo,
  };
}
